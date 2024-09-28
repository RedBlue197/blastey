from schemas.token_schema import Token
from services.user_service import authenticate_user
from services.auth_service import create_access_token
from jose import jwt , JWTError
from datetime import timedelta
from config import settings
from fastapi import APIRouter, HTTPException, status
from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import  auth_bearer,auth_dependency

from utils.responses import success_response,error_response





router=APIRouter(
    prefix="/core/frontoffice/v1",
    tags=['Backoffice Authentification']
)



@router.post("/token", status_code=status.HTTP_200_OK)
async def login_for_access_token(login_request: auth_dependency,db:db_dependency):
    user = authenticate_user(login_request.username, login_request.password, db)
    if not user :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="User not valid",)
    data={
        "user_email":user.user_email,
        "id":str(user.user_id)
    }
    token= create_access_token(data,timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    return success_response(
    data=token,
    status=200
)


async def get_current_user(token: auth_bearer):
    print("Token Identified successfully")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.HS256_ALGORITHM])
        print(payload)
        user_email: str = payload.get("sub")
        user_id :int = payload.get("id")
        if user_email is None or user_id is None:
            raise HTTPException (status_code=status.HTTP_401_UNAUTHORIZED,
                                 detail="User not valid")
        
        return {'user_email':user_email,'id':user_id}
    except JWTError:
        raise HTTPException (status_code=status.HTTP_401_UNAUTHORIZED,
                                 detail="User not valid")