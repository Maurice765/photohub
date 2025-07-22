from datetime import datetime
from fastapi import APIRouter, UploadFile, Form, Depends
from typing import Optional

from src.photo import constants
from src.photo import service
from src.photo import schemas
from src.photo import dependencies

router = APIRouter()

@router.post(
    "/upload", 
    response_model=schemas.PhotoUploadResponse 
)
async def upload_photo(
    title: str = Form(..., max_length=255),
    description: Optional[str] = Form(None, max_length=1000),
    visibility: constants.VisibilityEnum = Form(...),
    location: Optional[str] = Form(None, max_length=255),
    capture_date: Optional[datetime] = Form(None),
    camera_model: Optional[str] = Form(None, max_length=255),
    file: UploadFile = Depends(dependencies.validate_photo_upload)
):
    """
    Uploads a photo, processes it to generate a color histogram,
    and stores both the image and histogram in the database.
    """

    return await service.process_and_store_photo(
        file=file,
        title=title,
        description=description,
        visibility=visibility,
        location=location,
        capture_date=capture_date,
        camera_model=camera_model
    )


@router.post(
    "/search",
    response_model=schemas.PhotoSearchResponse
)
async def search_by_color(
    request: schemas.PhotoSearchRequest
):
    """
    Searches for photos that are most similar to a given RGB color
    by comparing color histograms.
    """
    return service.search_photos(request)


@router.get(
    "/preview/{photo_id}"
)
async def get_photo_image(photo_id: int):
    """
    Returns the raw image data for a specific photo.
    """
    return service.get_photo_image(photo_id)
