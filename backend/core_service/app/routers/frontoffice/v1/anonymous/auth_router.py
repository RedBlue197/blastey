from services.user_service import authenticate_user
from services.auth_service import create_access_token
from datetime import timedelta
from config import settings
from fastapi import APIRouter, HTTPException, status
from dependencies.db_dependency import db_dependency

from schemas.anonymous.auth_schema import (
    LoginRequest
    )

from utils.responses import api_response





router=APIRouter(
    prefix="/core/frontoffice/v1/anonymous/auth",
    tags=['Backoffice Authentification']
)



@router.post("/login", status_code=status.HTTP_200_OK)
async def login_for_access_token(login_request: LoginRequest,db:db_dependency):
    user = authenticate_user(login_request.username, login_request.password, db)
    if not user :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="User not valid",)
    data={
        "user_email":user.user_email,
        "user_id":str(user.user_id),
        "user_role": user.user_role.value
    }
    token= create_access_token(data,timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    return api_response(
    data={
        "token": token,
        "user_email": data["user_email"],
        "user_id": str(data["user_id"]),
    },
    status_code=200
)

