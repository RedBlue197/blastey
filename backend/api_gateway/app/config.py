from typing import ClassVar, Dict
from pydantic_settings import BaseSettings
import os

class DevSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "core": {"url": "http://localhost:8001"},
        "gateway": {"url": "http://localhost:8000"},
    }
    SECRET_KEY: str = "VIwCsS2THYOM0qvWYWszyAFbvnVPerJi8qGFYdrYbowINR7bM8Gd4/Gh/HgAKE/TL6k="
    ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./dev.db"

class ProdSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "core": {"url": "http://core-service:8001"},
        "gateway": {"url": "http://localhost:8000"},

    }
    SECRET_KEY: str = "prod-secret-key"
    ENV: str = "production"
    DATABASE_URL: str = "postgresql://user:password@db/prod"

def get_settings() -> BaseSettings:
    if os.getenv("ENV", "development") == "production":
        print("Production settings")
        return ProdSettings()
    return DevSettings()

settings = get_settings()
