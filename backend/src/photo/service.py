from fastapi import UploadFile
from typing import Optional
import oracledb
from src.database import get_connection
from src.photo import utils
from src.photo import exceptions
from src.photo import schemas
import numpy as np
from datetime import datetime
import cv2
import re

async def process_and_store_photo(file: UploadFile,
    title: str,
    category_id: Optional[int],
    description: Optional[str],
    visibility: str,
    location: Optional[str],
    capture_date: Optional[datetime],
    camera_model: Optional[str]
) -> schemas.PhotoUploadResponse:
    """
    Handles the core logic for processing an uploaded photo and storing its data.
    """
    
    # 1. Read file content and extract basic info
    file_content = await file.read()
    file_type = file.content_type
    file_size = len(file_content)

    # 2. Generate file hash (SHA-256)
    file_hash = utils.generate_file_hash(file_content)

    # 3. Process image to get dimensions and orientation
    nparr = np.frombuffer(file_content, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise exceptions.InvalidImageFormat()

    height, width, _ = image.shape
    orientation = utils.calculate_orientation(width, height)

    preview = utils.generate_preview(image)

    # 4. Convert image to RGB and calculate color histograms
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    histogram = utils.calculate_color_histograms(image_rgb)

    # 5. Database Operations
    conn = get_connection()
    cur = conn.cursor()

    try:
        # 5a. Check for duplicate file based on hash
        cur.execute("SELECT id FROM PHOTO WHERE file_hash = :fhash", {"fhash": file_hash})
        existing_photo = cur.fetchone()
        if existing_photo:
            raise exceptions.DuplicateFileError()

        # 5b. Insert into CONTENT table
        content_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO CONTENT (user_id, title, category_id, description, visibility, content_type) 
            VALUES (:user_id, :title, :category_id, :description, :visibility, 'PHOTO') 
            RETURNING id INTO :content_id
        """, {
            "user_id": 1, "title": title, "category_id": category_id, "description": description, "visibility": visibility,
            "content_id": content_id_var
        })
        content_id = content_id_var.getvalue()[0]

        # 5c. Insert into PHOTO table
        photo_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO PHOTO (
                content_id, image, file_type, file_size, file_hash, 
                location, capture_date, camera_model,
                width, height, orientation, preview
            ) VALUES (
                :cid, :blob, :ftype, :fsize, :fhash,
                :location, :cdate, :cmodel, :width, :height, :orientation, :preview
            ) 
            RETURNING id INTO :photo_id
        """, {
            "cid": content_id,
            "blob": file_content,
            "ftype": file_type,
            "fsize": file_size,
            "fhash": file_hash,
            "location": location,
            "cdate": capture_date,
            "cmodel": camera_model,
            "width": width,
            "height": height,
            "orientation": orientation.value,
            "preview": preview,
            "photo_id": photo_id_var
        })
        
        photo_id = photo_id_var.getvalue()[0]

        # 5d. Insert into COLOR_HISTOGRAM table
        array_type = conn.gettype("INT_ARRAY_256_T")
        cur.execute("""
            INSERT INTO COLOR_HISTOGRAM (
                photo_id, r_bins_norm, g_bins_norm, b_bins_norm
            ) VALUES (
                :photo_id, :r_bins, :g_bins, :b_bins
            )
        """, {
            "photo_id": photo_id,
            "r_bins": array_type.newobject(histogram.r_bins),
            "g_bins": array_type.newobject(histogram.g_bins),
            "b_bins": array_type.newobject(histogram.b_bins),
        })

        conn.commit()

        return schemas.PhotoUploadResponse(
            content_id=content_id,
            photo_id=photo_id,
            filename=file.filename
        )
    except exceptions.DuplicateFileError:
        raise
    except oracledb.DatabaseError as e:
        conn.rollback()
        raise exceptions.PhotoUploadError(reason=str(e))
    finally:
        cur.close()
        conn.close()


async def search_photos(request: schemas.PhotoSearchRequest) -> schemas.PhotoSearchResponse:
    conn = get_connection()
    cur = conn.cursor()

    try:
        params = {}
        filters = []
        joins = ["JOIN content c ON p.content_id = c.id"]
        score_components = []
        array_type = conn.gettype("INT_ARRAY_256_T") if request.rgbColor else None

        use_score_1 = use_score_2 = False

        if request.query:
            q = re.sub(r'[^\wäöüßÄÖÜ0-9]', '', request.query.strip().lower())
            text_expr = f'STEM("{q}") OR FUZZY("{q}")'

            filters.append(
                "(CONTAINS(c.title, :search_expr1, 1) > 0 OR CONTAINS(c.description, :search_expr2, 2) > 0)"
            )
            params["search_expr1"] = text_expr
            params["search_expr2"] = text_expr

            score_components.append("NVL(SCORE(1), 0) * 0.6 + NVL(SCORE(2), 0) * 0.4")
            use_score_1 = True
            use_score_2 = True
            
        # RGB similarity score
        if request.rgbColor and array_type:
            joins.append("JOIN color_histogram ch ON ch.photo_id = p.id")
            target = utils.create_single_color_histogram(
                request.rgbColor.r,
                request.rgbColor.g,
                request.rgbColor.b
            )
            params.update({
                "r_bins": array_type.newobject(target.r_bins),
                "g_bins": array_type.newobject(target.g_bins),
                "b_bins": array_type.newobject(target.b_bins),
            })

            score_components.append("""
                (1 - LEAST(
                    euclidean_distance_rgb_hist(
                        ch.r_bins_norm, ch.g_bins_norm, ch.b_bins_norm,
                        :r_bins, :g_bins, :b_bins
                    ) / 441.67, 1.0)
                ) * 0.4
            """)

        # Optional field boosts
        if request.category_id:
            filters.append("c.category_id = :category_id")
            params["category_id"] = request.category_id
            score_components.append("0.1")

        if request.orientation:
            filters.append("p.orientation = :orientation")
            params["orientation"] = request.orientation.value
            score_components.append("0.05")

        if request.fileFormat:
            filters.append("LOWER(p.file_type) = :file_format")
            params["file_format"] = f"image/{request.fileFormat.value.lower()}"
            score_components.append("0.05")

        if request.minHeight:
            filters.append("p.height >= :min_height")
            params["min_height"] = request.minHeight
            score_components.append("0.05")

        if request.minWidth:
            filters.append("p.width >= :min_width")
            params["min_width"] = request.minWidth
            score_components.append("0.05")

        if request.location:
            filters.append("LOWER(p.location) LIKE :location")
            params["location"] = f"%{request.location.lower()}%"
            score_components.append("0.05")

        if request.cameraModel:
            filters.append("LOWER(p.camera_model) LIKE :camera_model")
            params["camera_model"] = f"%{request.cameraModel.lower()}%"
            score_components.append("0.05")

        if request.uploadDate:
            if request.uploadDate.start:
                filters.append("c.create_date >= :upload_start")
                params["upload_start"] = request.uploadDate.start
            if request.uploadDate.end:
                filters.append("c.create_date <= :upload_end")
                params["upload_end"] = request.uploadDate.end

        if request.captureDate:
            if request.captureDate.start:
                filters.append("p.capture_date >= :capture_start")
                params["capture_start"] = request.captureDate.start
            if request.captureDate.end:
                filters.append("p.capture_date <= :capture_end")
                params["capture_end"] = request.captureDate.end

        # Final score expression
        score_expr = " + ".join(score_components) if score_components else "0"

        # SELECT clause with SCORE(n) if needed
        select_fields = ["p.id AS photo_id"]
        if use_score_1:
            select_fields.append("SCORE(1) AS score1")
        if use_score_2:
            select_fields.append("SCORE(2) AS score2")
        select_fields.append(f"({score_expr}) AS score")

        sql = f"""
            SELECT {', '.join(select_fields)}
            FROM photo p
            {' '.join(joins)}
        """

        if filters:
            sql += " WHERE " + " AND ".join(filters)

        sql += """
            ORDER BY score DESC
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        """

        params["limit"] = request.limit
        params["offset"] = request.offset

        cur.execute(sql, params)

        results = schemas.PhotoSearchResponse(results=[])
        for row in cur:
            photo_id = row[0]
            score = row[-1]  # last column is the final score
            results.results.append(schemas.PhotoSearchResultItem(
                photo_id=photo_id,
                score=round(score, 4),
                preview_url=f"/photo/preview/{photo_id}"
            ))

        return results

    except Exception as e:
        raise exceptions.PhotoSearchError(f"Search failed: {str(e)}")
    finally:
        cur.close()
        conn.close()


async def search_by_photo(file: UploadFile) -> schemas.PhotoSearchResponse:
    """
    Searches the database for photos with similar color profiles.
    Returns a list of results including photo metadata and a URL to the image.
    """

    # 1. Read file content and Process image
    file_content = await file.read()
    nparr = np.frombuffer(file_content, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise exceptions.InvalidImageFormat()

    # 2. Convert image to RGB and calculate color histograms
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    target_histogram = utils.calculate_color_histograms(image_rgb)

    # 3. Database Operations
    conn = get_connection()
    cur = conn.cursor()

    try:
        array_type = conn.gettype("INT_ARRAY_256_T")
        cur.execute("""
            SELECT photo_id, 
                   euclidean_distance_rgb_hist(
                       r_bins_norm, g_bins_norm, b_bins_norm,
                       :r_bins, :g_bins, :b_bins
                   ) AS distance
            FROM color_histogram
            ORDER BY distance ASC
            FETCH FIRST :limit ROWS ONLY
        """, {
            "r_bins": array_type.newobject(target_histogram.r_bins),
            "g_bins": array_type.newobject(target_histogram.g_bins),
            "b_bins": array_type.newobject(target_histogram.b_bins),
            "limit": 10
        })

        results = schemas.PhotoSearchResponse(results=[])
        for row in cur:
            photo_id, score = row
            results.results.append(schemas.PhotoSearchResultItem(
                photo_id=photo_id,
                score=round(score, 4),
                preview_url=f"/photo/preview/{photo_id}"
            ))

        return results

    except Exception as e:
        raise exceptions.PhotoSearchError(f"Search failed: {str(e)}")
    finally:
        cur.close()
        conn.close()

async def get_photo(photo_id: int) -> schemas.PhotoGetResponse:
    """
    Retrieves detailed information about a specific photo.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT p.id, c.title, c.description, c.visibility, 
                   p.file_type, p.file_size, p.location, 
                   p.capture_date, p.camera_model, 
                   p.width, p.height, p.orientation,
                   c.create_date, c.views, c.user_id, c.category_id,
                   u.username, cat.name
            FROM photo p
            JOIN content c ON p.content_id = c.id
            JOIN "USER" u ON c.user_id = u.id
            LEFT JOIN category cat ON c.category_id = cat.id
            WHERE p.id = :id
        """, {"id": photo_id})

        result = cur.fetchone()
        if result is None:
            raise exceptions.PhotoNotFound()

        return schemas.PhotoGetResponse(
            photo_id=result[0],
            title=result[1],
            description=result[2],
            visibility=result[3],
            file_format=result[4].replace("image/", ""),
            file_size=result[5],
            location=result[6],
            capture_date=result[7],
            camera_model=result[8],
            width=result[9],
            height=result[10],
            orientation=result[11],
            upload_date=result[12],
            views=result[13],
            user_id=result[14],
            category_id=result[15],
            username=result[16],
            category_name=result[17],
            image_url=f"/photo/image/{photo_id}"
        )
    finally:
        cur.close()
        conn.close()

async def get_photo_preview(photo_id: int) -> schemas.ImageStreamResponse:
    """
    Retrieves photo preview data and prepares a streaming response.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT preview, file_type FROM PHOTO WHERE id = :id", {"id": photo_id})
        result = cur.fetchone()
        if result is None:
            raise exceptions.PhotoNotFound()

        preview_blob, file_type = result
        data = preview_blob.read()
        media_type = file_type if file_type else "application/octet-stream"
        
        return schemas.ImageStreamResponse(content=data, media_type=media_type)
    finally:
        cur.close()
        conn.close()
    
async def get_photo_image(photo_id: int) -> schemas.ImageStreamResponse:
    """
    Retrieves photo image data and prepares a streaming response.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT image, file_type FROM PHOTO WHERE id = :id", {"id": photo_id})
        result = cur.fetchone()
        if result is None:
            raise exceptions.PhotoNotFound()
        
        image_blob, file_type = result
        data = image_blob.read()
        media_type = file_type if file_type else "application/octet-stream"
        
        return schemas.ImageStreamResponse(content=data, media_type=media_type)
    finally:
        cur.close()
        conn.close()