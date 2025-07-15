from fastapi import UploadFile
from typing import List, Optional

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
) -> schemas.PhotoResponse:
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

        return schemas.PhotoResponse(
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


def search_by_rgb_histogram(r: int, g: int, b: int, limit: int = 10) -> List[schemas.PhotoSearchResultItem]:
    """
    Searches the database for photos with similar color profiles.
    Returns a list of results including photo metadata and a URL to the image.
    """

    # 1. Create a histogram for the target color
    target_histogram = utils.create_single_color_histogram(r, g, b)

    # 2. Database Operations
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
            "limit": limit
        })
        
        results = []
        for row in cur:
            photo_id, distance = row
            results.append(schemas.PhotoSearchResultItem(
                photo_id=photo_id,
                distance=float(distance),
                image_url=f"/photo/image/{photo_id}" 
            ))
        return results
    except Exception as e:
        raise exceptions.PhotoSearchError(str(e))
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