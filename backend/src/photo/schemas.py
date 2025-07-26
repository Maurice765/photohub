from datetime import datetime as Datetime
import io
from fastapi.responses import StreamingResponse
from typing_extensions import Annotated
from pydantic import Field, ValidationError, model_validator
from src.models import CustomModel
from typing import List, Optional
from src.photo.constants import OrientationEnum, FileFormatEnum

class RGBColor(CustomModel):
    r: Annotated[int, Field(ge=0, le=255)]
    g: Annotated[int, Field(ge=0, le=255)]
    b: Annotated[int, Field(ge=0, le=255)]

HistogramValue = Annotated[float, Field(ge=0.0, le=1.0)]

class ColorHistogram(CustomModel):
    r_bins: Annotated[List[HistogramValue], Field(min_length=256, max_length=256)]
    g_bins: Annotated[List[HistogramValue], Field(min_length=256, max_length=256)]
    b_bins: Annotated[List[HistogramValue], Field(min_length=256, max_length=256)]

class DateRange(CustomModel):
    start: Datetime
    end: Datetime

    @model_validator(mode="after")
    def check_dates(self) -> 'DateRange':
        if self.start > self.end:
            raise ValueError("start must be before or equal to end")
        return self

class PhotoSearchRequest(CustomModel):
    query: Optional[str] = None
    category_id: Optional[int] = None
    rgbColor: Optional[RGBColor] = None
    minHeight: Optional[int] = None
    minWidth: Optional[int] = None
    orientation: Optional[OrientationEnum] = None
    fileFormat: Optional[FileFormatEnum] = None
    location: Optional[str] = Field(default=None, max_length=255)
    cameraModel: Optional[str] = Field(default=None, max_length=255)
    uploadDate: Optional[DateRange] = None
    captureDate: Optional[DateRange] = None
    limit: Optional[int] = 20
    offset: Optional[int] = 0

    @model_validator(mode="before")
    def check_at_least_one_field(cls, values: dict) -> dict:
        if not any(
            values.get(field) is not None
            for field in values
            if field != "limit" and field != "offset"
        ):
            raise ValueError("At least one search parameter must be provided")
        return values


class PhotoUploadResponse(CustomModel):
    content_id: int
    photo_id: int
    filename: Optional[str] = None

class PhotoSearchResultItem(CustomModel):
    photo_id: int
    score: float
    preview_url: str 

class PhotoSearchResponse(CustomModel):
    results: List[PhotoSearchResultItem]

class ImageStreamResponse(StreamingResponse):
    def __init__(self, content: bytes, media_type: str):
        super().__init__(content=io.BytesIO(content), media_type=media_type)