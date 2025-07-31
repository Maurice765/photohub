from fastapi import APIRouter
from src.category import schemas
from src.category import service

router = APIRouter()

@router.get(
    "/{category_id}",
    response_model=schemas.CategoryGetResponse
)
async def get_category(category_id: int):
    """
    Fetches a category by its ID.
    """
    return await service.get_category(category_id)


@router.get(
    "/",
    response_model=list[schemas.CategoryGetResponse]
)
async def get_all_categories():
    """
    Fetches all categories.
    """
    return await service.get_all_categories()