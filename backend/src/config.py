from typing import Sequence
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppConfig(BaseSettings):
    """
    Application settings are loaded from environment variables or a .env file.
    """
    ORACLE_USER: str = ""
    ORACLE_PASSWORD: str = ""
    ORACLE_DSN: str = ""

    CORS_ORIGINS: Sequence[str] = ["http://localhost:4200"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = AppConfig()