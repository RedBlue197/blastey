from typing import ClassVar, Dict
from pydantic_settings import BaseSettings
import os
import base64

class DevSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "users": {"url": "http://localhost:8000"},
        "auth": {"url": "http://localhost:8001"},
        "orders": {"url": "http://localhost:8002"},
    }
    SECRET_KEY: str = os.getenv("DEV_SECRET_KEY", "VIwCsS2THYOM0qvWYWszyAFbvnVPerJi8qGFYdrYbowINR7bM8Gd4/Gh/HgAKE/TL6k=")
    
    # Fetch AES secret key from environment variable, decode it, and provide a default
    AES_SECRET_KEY: bytes = bytes.fromhex(os.getenv("AES_SECRET_KEY", "04f5e5332f60cbe3f35f4a7d2525b9ce2678e3590db173ad281d85954e9463bf"))

    ENV: str = "development"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    HS256_ALGORITHM: str = "HS256"

    DATABASE_URL: str = os.getenv("DEV_DATABASE_URL", "postgresql://postgres:3SS5fe71@localhost:5432/db_blastey")
    DATABASE_NAME: str = "db_blastey"
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = os.getenv("DEV_DATABASE_PASSWORD", "3SS5fe71")
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: str = "5432"

    BUCKET_NAME: str = "blastey_bucket_dev_1"
    SERVICE_ACCOUNT_JSON: str = "services/dev_service_account.json"

    # Add Firebase Dynamic Links settings
    FIREBASE_API_KEY: str = os.getenv("FIREBASE_API_KEY", "AIzaSyApT-bwHspHA0N4SxVzVSbfgkxxWe2_xbo")
    DOMAIN_URI_PREFIX: str = "https://tiwaline.com/link"
    IOS_BUNDLE_ID: str = "com.hytego.tiwaline"
    ANDROID_PACKAGE_NAME: str = "com.hytego.tiwaline"
    IOS_FALLBACK_LINK: str = "https://play.google.com/store/apps/details?id=com.hytego.tiwaline"

    #Mail Settings
    MAIL_SETTINGS={
    MAIL_USERNAME = "goubs",
    MAIL_PASSWORD = "3SS5fe71",
    MAIL_FROM = "hamzagoubraim@email.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "mail server",
    MAIL_FROM_NAME="Hamza Goubs",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
    }


class ProdSettings(BaseSettings):
    SERVICES: ClassVar[Dict[str, Dict[str, str]]] = {
        "users": {"url": "http://users-service:8000"},
        "auth": {"url": "http://auth-service:8000"},
        "orders": {"url": "http://orders-service:8000"},
    }
    SECRET_KEY: str = os.getenv("PROD_SECRET_KEY", "prod-secret-key")
    ENV: str = "production"
    DATABASE_URL: str = os.getenv("PROD_DATABASE_URL", "postgresql://user:password@db/prod")
    BUCKET_NAME: str = "blastey_bucket_1"
    SERVICE_ACCOUNT_JSON: str = "services/prod_service_account.json"

    # Add Firebase Dynamic Links settings
    FIREBASE_API_KEY: str = os.getenv("FIREBASE_API_KEY", "AIzaSyApT-bwHspHA0N4SxVzVSbfgkxxWe2_xbo")
    DOMAIN_URI_PREFIX: str = "https://tiwaline.com/link"
    IOS_BUNDLE_ID: str = "com.hytego.tiwaline"
    ANDROID_PACKAGE_NAME: str = "com.hytego.tiwaline"
    IOS_FALLBACK_LINK: str = "https://play.google.com/store/apps/details?id=com.hytego.tiwaline"

def get_settings() -> BaseSettings:
    if os.getenv("ENV", "development") == "production":
        return ProdSettings()
    return DevSettings()

settings = get_settings()
