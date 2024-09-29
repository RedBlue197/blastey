from schemas.token_schema import Token
from services.user_service import authenticate_user
from services.auth_service import create_access_token
from jose import jwt , JWTError
from datetime import timedelta
from config import settings
from fastapi import APIRouter, HTTPException, status
from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import  auth_bearer,auth_dependency
from schemas.auth_schema import LoginRequest

from utils.responses import success_response,error_response





router=APIRouter(
    prefix="/core/frontoffice/v1",
    tags=['Backoffice Authentification']
)



@router.post("/token", status_code=status.HTTP_200_OK)
async def login_for_access_token(login_request: LoginRequest,db:db_dependency):
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