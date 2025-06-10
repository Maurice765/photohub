from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from database import get_connection
from datetime import datetime

app = FastAPI()


@app.post("/upload")
async def upload_photo(
    user_id: int = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
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
            )
        """, {
            "cid": content_id,
            "blob": file_content,
            "ftype": file_type,
            "fsize": file_size
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
