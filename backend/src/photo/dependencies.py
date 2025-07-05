from fastapi import UploadFile, HTTPException, status
from src.photo.config import photo_settings
from src.photo.constants import (
    AllowedPhotoContentType, 
    ERROR_MSG_PHOTO_TOO_LARGE, 
    ERROR_MSG_INVALID_CONTENT_TYPE
)

async def validate_photo_upload(file: UploadFile) -> UploadFile:
    """
    A dependency to validate an uploaded photo.
    """
    # 1. Validate Content-Type
    if file.content_type not in [item.value for item in AllowedPhotoContentType]:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"{ERROR_MSG_INVALID_CONTENT_TYPE} Supported types are: {', '.join([item.value for item in AllowedPhotoContentType])}."
        )

    # 2. Validate File Size
    size = file.file.seek(0, 2)
    if size > photo_settings.MAX_PHOTO_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"{ERROR_MSG_PHOTO_TOO_LARGE} Maximum size is {photo_settings.MAX_PHOTO_SIZE_BYTES // 1024 // 1024}MB."
        )
    
    # Reset the file cursor to the beginning so it can be read again in the endpoint
    await file.seek(0)
    
    return file