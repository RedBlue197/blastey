from fastapi import status, APIRouter, Query, HTTPException, Request
from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import user_dependency
from models.activity_model import Activity, ActivityItem
from schemas.professional.activity_schema import CreateActivityRequest
from utils.responses import api_response
from utils.extract_user import extract_user_id

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/professional/activities",
    tags=['Frontoffice Activities']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#----------------------------------------------------POST ENDPOINTS----------------------------------------------------
@router.post("/create-activity", status_code=status.HTTP_201_CREATED)
async def create_activity(
    db: db_dependency,
    user:user_dependency,
    request: Request,
    create_activity_request: CreateActivityRequest
):
    if user['user_role'] not in ["professional"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
