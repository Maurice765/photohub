from fastapi import APIRouter, UploadFile, File, Form, Depends
from typing import Optional
from src.photo import service
from src.photo import schemas
from src.photo import dependencies

router = APIRouter()

@router.post(
    "/upload", 
    response_model=schemas.PhotoResponse 
)
async def upload_photo(
    user_id: int = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    validated_file: UploadFile = Depends(dependencies.validate_photo_upload)
):
    """
    Uploads a photo, processes it to generate a color histogram,
    and stores both the image and histogram in the database.
    """
    return service.process_and_store_photo(user_id, title, description, validated_file)

@router.post(
    "/searchByColor",
    response_model=schemas.PhotoSearchResponse
)
async def search_by_color(
    color: schemas.RGBVector, 
    limit: int = 10
):
    """
    Searches for photos that are most similar to a given RGB color
    by comparing color histograms.
    """
    search_results = service.search_by_rgb_histogram(
        r=color.r_target, 
        g=color.g_target, 
        b=color.b_target, 
        limit=limit
    )
    return schemas.PhotoSearchResponse(results=search_results)