import io
from fastapi.responses import StreamingResponse
from typing_extensions import Annotated
from pydantic import Field
from src.models import CustomModel
from typing import List, Optional

class RGBVector(CustomModel):
    r_target: Annotated[int, Field(ge=0, le=255)]
    g_target: Annotated[int, Field(ge=0, le=255)]
    b_target: Annotated[int, Field(ge=0, le=255)]

class PhotoResponse(CustomModel):
    content_id: int
    photo_id: int
    filename: Optional[str] = None

class PhotoSearchResultItem(CustomModel):
    photo_id: int
    distance: float
    image_url: str = Field(...)

class PhotoSearchResponse(CustomModel):
    results: List[PhotoSearchResultItem]

class ImageStreamResponse(StreamingResponse):
    def __init__(self, content: bytes, media_type: str):
        super().__init__(content=io.BytesIO(content), media_type=media_type)

