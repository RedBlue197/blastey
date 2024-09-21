from typing import ClassVar, Dict
from pydantic_settings import BaseSettings
import os

class DevSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "users": {"url": "http://localhost:8000"},
        "auth": {"url": "http://localhost:8001"},
        "orders": {"url": "http://localhost:8002"},
    }
    SECRET_KEY: str = "VIwCsS2THYOM0qvWYWszyAFbvnVPerJi8qGFYdrYbowINR7bM8Gd4/Gh/HgAKE/TL6k="
    ENV: str = "development"
    DATABASE_URL: str = "postgresql://postgres:3SS5fe71@localhost:5432/db_blastey"
    DATABASE_NAME: str = "db_blastey"
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = "3SS5fe71"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: str = "5432"
    BUCKET_NAME: str = "blastey_bucket_dev_1"
    SERVICE_ACCOUNT_JSON: str = "services/dev_service_account.json"

    # Add Firebase Dynamic Links settings
    FIREBASE_API_KEY: str = "AIzaSyApT-bwHspHA0N4SxVzVSbfgkxxWe2_xbo"
    DOMAIN_URI_PREFIX: str = "https://tiwaline.com/link"
    IOS_BUNDLE_ID: str = "com.hytego.tiwaline"
    ANDROID_PACKAGE_NAME: str = "com.hytego.tiwaline"
    IOS_FALLBACK_LINK: str = "https://play.google.com/store/apps/details?id=com.hytego.tiwaline"

class ProdSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "users": {"url": "http://users-service:8000"},
        "auth": {"url": "http://auth-service:8000"},
        "orders": {"url": "http://orders-service:8000"},
    }
    SECRET_KEY: str = "prod-secret-key"
    ENV: str = "production"
    DATABASE_URL: str = "postgresql://user:password@db/prod"
    BUCKET_NAME: str = "blastey_bucket_1"
    SERVICE_ACCOUNT_JSON: str = "services/prod_service_account.json"

    # Add Firebase Dynamic Links settings
    FIREBASE_API_KEY: str = "AIzaSyApT-bwHspHA0N4SxVzVSbfgkxxWe2_xbo"
    DOMAIN_URI_PREFIX: str = "https://tiwaline.com/link"
    IOS_BUNDLE_ID: str = "com.hytego.tiwaline"
    ANDROID_PACKAGE_NAME: str = "com.hytego.tiwaline"
    IOS_FALLBACK_LINK: str = "https://play.google.com/store/apps/details?id=com.hytego.tiwaline"


def get_settings() -> BaseSettings:
    if os.getenv("ENV", "development") == "production":
        return ProdSettings()
    return DevSettings()

settings = get_settings()
