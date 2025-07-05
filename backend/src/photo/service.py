from fastapi import UploadFile
from src.database import get_connection
from src.photo import utils
from src.photo import exceptions
import numpy as np
import cv2

def process_and_store_photo(user_id: int, title: str, description: str, file: UploadFile):
    """
    Handles the core logic for processing an uploaded photo and storing its data.
    """
    file_content = file.file.read()
    file_type = file.content_type
    file_size = len(file_content)

    conn = get_connection()
    cur = conn.cursor()

    try:
        # Step 1: Insert into CONTENT table
        content_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO CONTENT (user_id, title, description, content_type) 
            VALUES (:user_id, :title, :description, 'PHOTO') 
            RETURNING id INTO :content_id
        """, {
            "user_id": user_id, "title": title, "description": description, 
            "content_id": content_id_var
        })
        content_id = content_id_var.getvalue()[0]

        # Step 2: Insert into PHOTO table
        photo_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO PHOTO (content_id, image, file_type, file_size) 
            VALUES (:cid, :blob, :ftype, :fsize) 
            RETURNING id INTO :photo_id
        """, {
            "cid": content_id, "blob": file_content, "ftype": file_type, 
            "fsize": file_size, "photo_id": photo_id_var
        })
        photo_id = photo_id_var.getvalue()[0]

        # Step 3: Process image for histogram
        nparr = np.frombuffer(file_content, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            raise exceptions.InvalidImageFormat()

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Step 4: Calculate histograms and statistics
        r_hist = cv2.calcHist([image_rgb], [0], None, [256], [0, 256]).flatten()
        g_hist = cv2.calcHist([image_rgb], [1], None, [256], [0, 256]).flatten()
        b_hist = cv2.calcHist([image_rgb], [2], None, [256], [0, 256]).flatten()

        total_pixels = image_rgb.shape[0] * image_rgb.shape[1]
        r_hist_norm = r_hist / total_pixels
        g_hist_norm = g_hist / total_pixels
        b_hist_norm = b_hist / total_pixels

        r_mean = np.average(np.arange(256), weights=r_hist) / 255
        g_mean = np.average(np.arange(256), weights=g_hist) / 255
        b_mean = np.average(np.arange(256), weights=b_hist) / 255

        # Step 5: Insert histogram data
        array_type = conn.gettype("INT_ARRAY_256_T")
        cur.execute("""
            INSERT INTO COLOR_HISTOGRAM (
                photo_id, r_bins, g_bins, b_bins,
                r_bins_norm, g_bins_norm, b_bins_norm,
                r_mean, g_mean, b_mean
            ) VALUES (
                :photo_id, :r_bins, :g_bins, :b_bins,
                :r_bins_norm, :g_bins_norm, :b_bins_norm,
                :r_mean, :g_mean, :b_mean
            )
        """, {
            "photo_id": photo_id,
            "r_bins": array_type.newobject(list(map(float, r_hist))),
            "g_bins": array_type.newobject(list(map(float, g_hist))),
            "b_bins": array_type.newobject(list(map(float, b_hist))),
            "r_bins_norm": array_type.newobject(list(map(float, r_hist_norm))),
            "g_bins_norm": array_type.newobject(list(map(float, g_hist_norm))),
            "b_bins_norm": array_type.newobject(list(map(float, b_hist_norm))),
            "r_mean": float(r_mean), "g_mean": float(g_mean), "b_mean": float(b_mean)
        })

        conn.commit()
        return {
            "status": "Photo uploaded successfully",
            "content_id": content_id,
            "photo_id": photo_id,
            "filename": file.filename
        }
    except Exception as e:
        conn.rollback()
        raise exceptions.HistogramInsertError(str(e))
    finally:
        cur.close()
        conn.close()

def search_by_rgb_histogram(r: int, g: int, b: int, limit: int = 10):
    """
    Searches the database for photos with similar color profiles.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        r_hist, g_hist, b_hist = utils.create_single_color_histogram(r, g, b)
        array_type = conn.gettype("INT_ARRAY_256_T")
        
        sql = """
            SELECT photo_id,
                   euclidean_distance_rgb_hist(
                       r_bins_norm, g_bins_norm, b_bins_norm,
                       :r_bins, :g_bins, :b_bins
                   ) AS distance
            FROM color_histogram
            ORDER BY distance ASC
            FETCH FIRST :limit ROWS ONLY
        """

        cur.execute(sql, {
            "r_bins": array_type.newobject(list(map(float, r_hist))),
            "g_bins": array_type.newobject(list(map(float, g_hist))),
            "b_bins": array_type.newobject(list(map(float, b_hist))),
            "limit": limit
        })

        return [{"photo_id": photo_id, "distance": float(distance)} for photo_id, distance in cur]
    except Exception as e:
        raise exceptions.HistogramInsertError(str(e))
    finally:
        cur.close()
        conn.close()