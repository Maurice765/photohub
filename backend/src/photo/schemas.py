from pydantic import conint
from src.models import CustomModel
from typing import List

class RGBVector(CustomModel):
    r_target: conint(ge=0, le=255)
    g_target: conint(ge=0, le=255)
    b_target: conint(ge=0, le=255)

class PhotoResponse(CustomModel):
    content_id: int
    photo_id: int
    filename: str

class PhotoSearchResult(CustomModel):
    photo_id: int
    distance: float

class PhotoSearchResponse(CustomModel):
    results: List[PhotoSearchResult]