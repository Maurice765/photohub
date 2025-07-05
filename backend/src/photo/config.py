from pydantic_settings import BaseSettings, SettingsConfigDict

class PhotoConfig(BaseSettings):
    """
    Defines configuration settings specific to the photo processing and storage.
    These can be overridden by environment variables.
    """
    
    MAX_PHOTO_SIZE_BYTES: int = 10 * 1024 * 1024 

    model_config = SettingsConfigDict(
        env_prefix="PHOTO_", 
        env_file=".env", 
        extra="ignore"
    )

photo_settings = PhotoConfig()