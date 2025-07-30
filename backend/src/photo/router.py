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
async def upload(
    title: str = Form(..., max_length=255),
    category_id: Optional[int] = Form(None),
    description: Optional[str] = Form(None, max_length=1000),
    visibility: constants.VisibilityEnum = Form(...),
    location: Optional[str] = Form(None, max_length=255),
    capture_date: Optional[datetime] = Form(None),
    camera_model: Optional[str] = Form(None, max_length=255),
    file: UploadFile = Depends(dependencies.validate_photo)
):
    """
    Uploads a photo, processes it to generate a color histogram,
    and stores both the image and histogram in the database.
    """

    return await service.process_and_store_photo(
        file=file,
        category_id=category_id,
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
async def search(
    request: schemas.PhotoSearchRequest
):
    """
    Searches for photos that are most similar to a given RGB color
    by comparing color histograms.
    """
    return await service.search_photos(request)


@router.post(
    "/searchByPhoto",
    response_model=schemas.PhotoSearchResponse
)
async def search_by_photo(
    file: UploadFile = Depends(dependencies.validate_photo)
):
    """
    Searches for photos that are most similar to a given photo
    by comparing color histograms.
    """
    return await service.search_by_photo(file)

@router.get(
    "/{photo_id}",
    response_model=schemas.PhotoGetResponse
)
async def get_photo(photo_id: int):
    """
    Returns detailed information about a specific photo.
    """
    return await service.get_photo(photo_id)

@router.get(
    "/preview/{photo_id}"
)
async def get_image_preview(photo_id: int):
    """
    Returns preview image data for a specific photo.
    """
    return await service.get_photo_preview(photo_id)

@router.get(
    "/image/{photo_id}"
)
async def get_image(photo_id: int):
    """
    Returns the image data for a specific photo.
    """
    return await service.get_photo_image(photo_id)
