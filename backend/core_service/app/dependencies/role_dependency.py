from fastapi import Depends, HTTPException, status
from typing import List
from fastapi.security import OAuth2PasswordBearer
from utils.extract_user import extract_user_role

def role_required(required_roles: List[UserRole], user: User = Depends(extract_user_role)):
    if user.user_role not in required_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return user