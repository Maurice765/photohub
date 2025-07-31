from typing import Optional
from src.models import CustomModel

class CategoryGetResponse(CustomModel):
    id: int
    name: str
    description: str
    parent_id: Optional[int] = None