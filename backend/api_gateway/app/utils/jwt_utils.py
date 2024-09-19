import jwt
from datetime import datetime, timedelta
from config import settings

# Suggested code may be subject to a license. Learn more: ~LicenseLog:2306640976.
SECRET_KEY = settings.SECRET_KEY


def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
