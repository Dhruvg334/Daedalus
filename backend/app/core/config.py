import os
from typing import Any, List, Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Daedalus API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Use a default that is safe for local development.
    DATABASE_URL: str = "sqlite:///./daedalus.db"

    # AI: optional. Core product flow must work without this key.
    GOOGLE_API_KEY: Optional[str] = None

    # JWT fields are retained for compatibility with older modules, but auth is not
    # required for the current public product flow.
    JWT_SECRET_KEY: str = "your-super-secret-key-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Comma-separated string or JSON/list from the host. Values are normalized below
    # to avoid common production CORS mistakes such as trailing slashes.
    ALLOWED_ORIGINS: Any = (
        "http://localhost:3000,"
        "http://localhost:3001,"
        "http://localhost:5173,"
        "http://127.0.0.1:3000,"
        "http://127.0.0.1:3001,"
        "https://daedalus-iota.vercel.app"
    )

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, value: Any) -> List[str]:
        if value is None:
            return []

        if isinstance(value, str):
            if not value.strip():
                return []
            raw_items = value.split(",")
        elif isinstance(value, list):
            raw_items = value
        else:
            return []

        normalized: List[str] = []
        for item in raw_items:
            origin = str(item).strip()
            if not origin:
                continue
            # Browsers send Origin without a trailing slash. Hosts/users often paste
            # with a trailing slash. Normalize so exact-origin CORS does not fail.
            if origin != "*":
                origin = origin.rstrip("/")
            if origin not in normalized:
                normalized.append(origin)
        return normalized

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",
    )


settings = Settings()

# Local Windows development should not accidentally pick up a hosted Postgres URL.
if os.name == "nt":
    settings.DATABASE_URL = "sqlite:///./daedalus.db"
