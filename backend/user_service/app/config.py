from typing import ClassVar, Dict
from pydantic_settings import BaseSettings
import os

class DevSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "users": {"url": "http://localhost:8000"},
        "auth": {"url": "http://localhost:8001"},
        "orders": {"url": "http://localhost:8002"},
    }
    SECRET_KEY: str = "dev-secret-key"
    ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./dev.db"

class ProdSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "users": {"url": "http://users-service:8000"},
        "auth": {"url": "http://auth-service:8000"},
        "orders": {"url": "http://orders-service:8000"},
    }
    SECRET_KEY: str = "prod-secret-key"
    ENV: str = "production"
    DATABASE_URL: str = "postgresql://user:password@db/prod"

def get_settings() -> BaseSettings:
    if os.getenv("ENV", "development") == "production":
        return ProdSettings()
    return DevSettings()

settings = get_settings()
