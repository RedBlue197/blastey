from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from utils.jwt_utils import decode_jwt
from services.auth_service import create_access_token
from jose import jwt
from config import settings
import logging

logger = logging.getLogger("auth_middleware")

class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, excluded_paths: list = None):
        super().__init__(app)
        self.excluded_paths = excluded_paths or []

    async def dispatch(self, request: Request, call_next):
        logger.info(f"Processing request path: {request.url.path}")
        if request.url.path in self.excluded_paths or (
            settings.ENV == "development" and request.url.path in ["/docs", "/openapi.json"]
        ):
            return await call_next(request)

        token = request.headers.get("Authorization")
        if not token or not token.startswith("Bearer "):
            logger.warning("Authorization token required")
            raise HTTPException(status_code=401, detail="Authorization token required")
        
        try:
            token = token.split("Bearer ")[1]
            user = decode_jwt(token)
            request.state.user = user
        except jwt.ExpiredSignatureError:
            refresh_token = request.headers.get("Refresh-Token")
            if refresh_token:
                try:
                    payload = decode_jwt(refresh_token)
                    new_access_token = create_access_token(data={"sub": payload["sub"]})
                    request.state.user = payload

                    response = await call_next(request)
                    response.headers["Authorization"] = f"Bearer {new_access_token}"
                    return response
                except Exception:
                    logger.warning("Invalid refresh token")
                    raise HTTPException(status_code=401, detail="Invalid refresh token")
            else:
                logger.warning("Access token expired")
                raise HTTPException(status_code=401, detail="Access token expired")
        except Exception as e:
            logger.warning(f"Invalid token: {str(e)}")
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
        
        response = await call_next(request)
        return response