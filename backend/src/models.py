from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, ConfigDict


class CustomModel(BaseModel):
    """
    A BaseModel to provide common configurations
    for all schemas in the application.
    """
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    def serializable_dict(self, **kwargs):
        """
        Returns a dictionary representation of the model that is JSON-serializable.
        """
        default_dict = self.model_dump()
        return jsonable_encoder(default_dict)