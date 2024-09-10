from fastapi import Depends, HTTPException
from utils.jwt_utils import decode_jwt

def get_current_user(token: str = Depends(decode_jwt)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return token
