import os
from typing import List, Any, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Daedalus API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Use a default that is safe for local dev
    DATABASE_URL: str = "sqlite:///./daedalus.db"

    # JWT
    JWT_SECRET_KEY: str = "your-super-secret-key-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # CORS - Use Any to prevent pydantic-settings from forcing JSON loads on .env strings
    ALLOWED_ORIGINS: Any = "http://localhost:5173,http://localhost:3000"

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if not v:
                return []
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra='ignore' # Crucial: ignores system-level DATABASE_URL that causes psycopg2 errors
    )

settings = Settings()

# --- THE FOREVER FIX ---
# If we are on Windows (local dev), we force SQLite to ensure the app always starts.
if os.name == 'nt':
    settings.DATABASE_URL = "sqlite:///./daedalus.db"
