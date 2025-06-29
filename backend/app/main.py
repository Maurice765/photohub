from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from database import get_connection
from datetime import datetime
import cv2
import numpy as np

app = FastAPI()

@app.get("/")
async def read_main():
    return {"msg": "Hello World"}

@app.post("/upload")
async def upload_photo(
    user_id: int,
    title: str,
    description: str,
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

        number_list_type = conn.gettype("SYS.ODCINUMBERLIST")

        cur.execute("""
            BEGIN
                INSERT INTO COLOR_HISTOGRAM (
                    photo_id,
                    r_bins,
                    g_bins,
                    b_bins
                ) VALUES (
                    :photo_id,
                    :r_bins, 
                    :g_bins, 
                    :b_bins
                );
            END;
        """, {
            "photo_id": photo_id,
            "r_bins": number_list_type.newobject(list(map(float, r_hist))),
            "g_bins": number_list_type.newobject(list(map(float, g_hist))),
            "b_bins": number_list_type.newobject(list(map(float, b_hist)))
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
