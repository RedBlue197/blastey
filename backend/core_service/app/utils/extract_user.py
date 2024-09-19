import jwt
from jwt.exceptions import InvalidTokenError
from config import settings

SECRET_KEY = settings.SECRET_KEY  # Should be the same key used to sign the JWT

def extract_user_id(token: str) -> str:
    try:
        # Decode the JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        # Extract user_id from the payload
        user_id = payload.get("user_id")
        if not user_id:
            raise ValueError("user_id not found in token")
        
        return user_id
    except InvalidTokenError:
        raise ValueError("Invalid token")

def extract_user_role(token: str) -> str:
    try:
        # Decode the JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        # Extract user_id from the payload
        user_id = payload.get("user_id")        
        if not user_id:
            raise ValueError("user_id not found in token")
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return user
    except InvalidTokenError:
        raise ValueError("Invalid token")