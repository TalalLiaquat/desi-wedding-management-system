from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Desi Wedding Management System"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:80",
        "http://127.0.0.1",
        "http://127.0.0.1:4173",
    ]
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@db:5432/desi_wedding"
    SECRET_KEY: str = "CHANGE_THIS_SECRET"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"
    SMTP_HOST: str = "smtp.example.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "user@example.com"
    SMTP_PASSWORD: str = "password"
    BACKEND_CORS_ORIGINS_STR: str = ",".join(BACKEND_CORS_ORIGINS)

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

settings = Settings()
