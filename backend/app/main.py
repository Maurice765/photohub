from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body, Query
from typing import Optional
from pydantic import BaseModel, conint
from database import get_connection
from datetime import datetime
import cv2
import numpy as np

class RGBVector(BaseModel):
    r_target: conint(ge=0, le=255)
    g_target: conint(ge=0, le=255)
    b_target: conint(ge=0, le=255)


def create_single_color_histogram(r: int, g: int, b: int):
    def color_to_hist(c):
        hist = np.zeros(256, dtype=float)
        hist[c] = 1.0
        return hist
    r_hist = color_to_hist(r)
    g_hist = color_to_hist(g)
    b_hist = color_to_hist(b)
    return r_hist, g_hist, b_hist

app = FastAPI()

@app.get("/")
async def read_main():
    return {"msg": "Hello World"}

@app.post("/upload")
async def upload_photo(
    user_id: int,
    title: str,
    description: Optional[str] = None,
    file: UploadFile = File(),
):
    file_content = await file.read()
    file_type = file.content_type
    file_size = len(file_content)

    conn = get_connection()
    cur = conn.cursor()

    try:
        # CONTENT einfügen und ID zurückbekommen
        content_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO CONTENT (
                user_id,
                title,
                description,
                content_type
            ) VALUES (
                :user_id,
                :title,
                :description,
                :content_type
            ) RETURNING id INTO :content_id
        """, {
            "user_id": user_id,
            "title": title,
            "description": description,
            "content_type": "PHOTO",
            "content_id": content_id_var
        })
        
        # ID aus dem Cursor holen
        content_id = content_id_var.getvalue()[0]

        # PHOTO einfügen mit der content_id
        photo_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO PHOTO (
                content_id, 
                image, 
                file_type, 
                file_size
            ) VALUES (
                :cid, 
                :blob, 
                :ftype, 
                :fsize
            ) RETURNING id INTO :photo_id
        """, {
            "cid": content_id,
            "blob": file_content,
            "ftype": file_type,
            "fsize": file_size,
            "photo_id": photo_id_var
        })

        # ID aus dem Cursor holen
        photo_id = photo_id_var.getvalue()[0]

        # Bild aus dem Binärinhalt laden
        nparr = np.frombuffer(file_content, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Bild konnte nicht verarbeitet werden.")

        # BGR zu RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Histogramm für jeden Kanal berechnen
        r_hist = cv2.calcHist([image_rgb], [0], None, [256], [0, 256]).flatten()
        g_hist = cv2.calcHist([image_rgb], [1], None, [256], [0, 256]).flatten()
        b_hist = cv2.calcHist([image_rgb], [2], None, [256], [0, 256]).flatten()

        # Normalisieren der Histogramme
        total_pixels = image_rgb.shape[0] * image_rgb.shape[1]
        r_hist_norm = r_hist / total_pixels
        g_hist_norm = g_hist / total_pixels
        b_hist_norm = b_hist / total_pixels
        
        r_mean = np.average(np.arange(256), weights=r_hist) / 255
        g_mean = np.average(np.arange(256), weights=g_hist) / 255
        b_mean = np.average(np.arange(256), weights=b_hist) / 255


        array_type = conn.gettype("INT_ARRAY_256_T")

        cur.execute("""
            INSERT INTO COLOR_HISTOGRAM (
                photo_id,
                r_bins,
                g_bins,
                b_bins,
                r_bins_norm,
                g_bins_norm,
                b_bins_norm,
                r_mean,
                g_mean,
                b_mean
            ) VALUES (
                :photo_id,
                :r_bins, 
                :g_bins, 
                :b_bins,
                :r_bins_norm,
                :g_bins_norm,
                :b_bins_norm,
                :r_mean,
                :g_mean,
                :b_mean
            )
        """, {
            "photo_id": photo_id,
            "r_bins": array_type.newobject(list(map(float, r_hist))),
            "g_bins": array_type.newobject(list(map(float, g_hist))),
            "b_bins": array_type.newobject(list(map(float, b_hist))),
            "r_bins_norm": array_type.newobject(list(map(float, r_hist_norm))),
            "g_bins_norm": array_type.newobject(list(map(float, g_hist_norm))),
            "b_bins_norm": array_type.newobject(list(map(float, b_hist_norm))),
            "r_mean": float(r_mean),
            "g_mean": float(g_mean),
            "b_mean": float(b_mean)
        })

        conn.commit()

        return {
            "status": "Foto erfolgreich hochgeladen",
            "content_id": content_id,
            "filename": file.filename
        }
    except Exception as e:
        # Rollback in case of error
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Close the cursor and connection
        cur.close()
        conn.close()


@app.post("/search-by-color")
async def search_by_color(color: RGBVector, limit: int = 10):
    try:
        conn = get_connection()
        cur = conn.cursor()

        r_hist, g_hist, b_hist = create_single_color_histogram(color.r_target, color.g_target, color.b_target)

        array_type = conn.gettype("INT_ARRAY_256_T")
        r_varray = array_type.newobject(list(map(float, r_hist)))
        g_varray = array_type.newobject(list(map(float, g_hist)))
        b_varray = array_type.newobject(list(map(float, b_hist)))

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
            "r_bins": r_varray,
            "g_bins": g_varray,
            "b_bins": b_varray,
            "limit": limit
        })

        results = []
        for photo_id, distance in cur:
            results.append({"photo_id": photo_id, "distance": float(distance)})

        return {"results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
