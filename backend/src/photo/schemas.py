from pydantic import conint
from src.models import CustomModel

class RGBVector(CustomModel):
    r_target: conint(ge=0, le=255)
    g_target: conint(ge=0, le=255)
    b_target: conint(ge=0, le=255)

class PhotoResponse(CustomModel):
    status: str
    content_id: int
    photo_id: int
    filename: str