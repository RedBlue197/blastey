from typing import Annotated, List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jose import JWTError
from config import settings
from models.user_model import UserRole
from datetime import timedelta
from services.auth_service import create_access_token
import time
import uuid

# Password context and OAuth2 Bearer setup
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/core/frontoffice/v1/token")

auth_bearer = Annotated[str, Depends(oauth2_bearer)]

# Adjusted get_current_user function to handle multiple roles
async def get_current_user(token: auth_bearer, allowed_roles: Optional[List[UserRole]] = None):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.HS256_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Extract user information from token
    user_email: str = payload.get("user_email")
    user_id: uuid.UUID = payload.get("user_id")
    user_role: UserRole = payload.get("user_role")

    # Validate user data
    if user_email is None or user_id is None or user_role is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    # Check if the user has one of the allowed roles
    if allowed_roles and user_role not in allowed_roles:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this resource")

    # Refresh the token if it's near expiry
    if payload.get('exp') - time.time() < settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60 / 2:
        data = {
            "user_email": user_email,
            "user_id": str(user_id),
            "user_role": user_role
        }
        token = create_access_token(data, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))

    return {'user_email': user_email, 'user_id': user_id, 'user_role': user_role, 'token': token}
