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

async def process_and_store_photo(file: UploadFile,
    title: str,
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
            INSERT INTO CONTENT (user_id, title, description, visibility, content_type) 
            VALUES (:user_id, :title, :description, :visibility, 'PHOTO') 
            RETURNING id INTO :content_id
        """, {
            "user_id": 1, "title": title, "description": description, "visibility": visibility,
            "content_id": content_id_var
        })
        content_id = content_id_var.getvalue()[0]

        # 5c. Insert into PHOTO table
        photo_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO PHOTO (
                content_id, image, file_type, file_size, file_hash, 
                location, capture_date, camera_model,
                width, height, orientation
            ) VALUES (
                :cid, :blob, :ftype, :fsize, :fhash,
                :location, :cdate, :cmodel, :width, :height, :orientation
            ) 
            RETURNING id INTO :photo_id
        """, {
            "cid": content_id, "blob": file_content, "ftype": file_type, 
            "fsize": file_size, "fhash": file_hash, "location": location, 
            "cdate": capture_date, "cmodel": camera_model, "width": width, 
            "height": height, "orientation": orientation.value, "photo_id": photo_id_var
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


def search_photos(request: schemas.PhotoSearchRequest) -> schemas.PhotoSearchResponse:
    conn = get_connection()
    cur = conn.cursor()

    try:
        params = {}
        filters = []
        joins = ["JOIN content c ON p.content_id = c.id"]
        score_components = []
        array_type = conn.gettype("INT_ARRAY_256_T") if request.RgbColor else None

        # Text search score
        if request.searchInput:
            filters.append("(CONTAINS(c.title, :search, 1) > 0 OR CONTAINS(c.description, :search, 2) > 0)")
            score_components.append("SCORE(1) * 0.6 + SCORE(2) * 0.4")  # You can tune these weights
            params["search"] = request.searchInput

        # RGB similarity score (max distance = sqrt(255^2 * 3) = ~441.67)
        if request.RgbColor and array_type:
            joins.append("JOIN color_histogram ch ON ch.photo_id = p.id")
            target = utils.create_single_color_histogram(
                request.RgbColor.r,
                request.RgbColor.g,
                request.RgbColor.b
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

        # Optional field boosts (binary score)
        if request.Orientation:
            filters.append("p.orientation = :orientation")
            params["orientation"] = request.Orientation.value
            score_components.append("0.05")

        if request.FileFormat:
            filters.append("LOWER(p.file_type) = :file_format")
            params["file_format"] = request.FileFormat.value.lower()
            score_components.append("0.05")

        if request.minHeight:
            filters.append("p.height >= :min_height")
            params["min_height"] = request.minHeight
            score_components.append("0.05")

        if request.minWidth:
            filters.append("p.width >= :min_width")
            params["min_width"] = request.minWidth
            score_components.append("0.05")

        if request.Location:
            filters.append("LOWER(p.location) LIKE :location")
            params["location"] = f"%{request.Location.lower()}%"
            score_components.append("0.05")

        if request.CameraModell:
            filters.append("LOWER(p.camera_model) LIKE :camera_model")
            params["camera_model"] = f"%{request.CameraModell.lower()}%"
            score_components.append("0.05")

        if request.UploadDate:
            if request.UploadDate.start:
                filters.append("c.create_date >= :upload_start")
                params["upload_start"] = request.UploadDate.start
            if request.UploadDate.end:
                filters.append("c.create_date <= :upload_end")
                params["upload_end"] = request.UploadDate.end

        if request.CaptureDate:
            if request.CaptureDate.start:
                filters.append("p.capture_date >= :capture_start")
                params["capture_start"] = request.CaptureDate.start
            if request.CaptureDate.end:
                filters.append("p.capture_date <= :capture_end")
                params["capture_end"] = request.CaptureDate.end

        # Final score formula
        score_expr = " + ".join(score_components) if score_components else "0"

        sql = f"""
            SELECT p.id AS photo_id,
                   ({score_expr}) AS score
            FROM photo p
            {' '.join(joins)}
        """

        if filters:
            sql += " WHERE " + " AND ".join(filters)

        sql += f"""
            ORDER BY score DESC
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        """

        params["limit"] = request.limit
        params["offset"] = request.offset

        cur.execute(sql, params)

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
    
def get_photo_image(photo_id: int) -> schemas.ImageStreamResponse:
    """
    Retrieves photo data and prepares a streaming response.
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