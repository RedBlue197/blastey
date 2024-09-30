# app/routers/user_router.py

from fastapi import status, APIRouter, Query,Request
from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import auth_bearer,get_current_user

import uuid

from interfaces.user_interface import UserInterface

from schemas.user_schema import CreateUserRequest

from responses.user_response import GetUserByIdResponse,GetUserResponse,CreateUserResponse

from utils.responses import success_response,error_response

from main import limiter

router = APIRouter(
    prefix="/core/frontoffice/v1/users",
    tags=['Frontoffice Users']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#API to get all users
@router.get("/", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def get_users(
    db: db_dependency,  # Database dependency
    auth:auth_bearer,
    request: Request,
    page: int = Query(1, ge=1),  # Default to page 1, must be greater than or equal to 1
    items_per_page: int = Query(10, le=100),  # Default to 10 items per page, max 100
):
    # Initialize UserInterface
    user_interface = UserInterface(db=db)

    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query all users with pagination using the interface
    users, total_count = user_interface.get_all_users_with_pagination(offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response
    if not users:
        return error_response(
            message="No users found",
            error_code=404
        )
    else:
        users_response = [GetUserByIdResponse.from_orm(user) for user in users]

        return success_response(
            data=GetUserResponse(data=users_response),
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )

#API to get user by ID
@router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_by_id(
    user_id: uuid.UUID,
    db: db_dependency,  # Database dependency
):
    # Initialize UserInterface
    user_interface = UserInterface(db=db)

    # Query the user by ID with pagination using the interface
    user = user_interface.get_user_by_id_with_pagination(str(user_id))

    # Handle response
    if not user:
        return error_response(
            message="No users found",
            error_code=404
        )
    else:
        user_response=GetUserByIdResponse.from_orm(user)
        return success_response(
            data=user_response,

        )
    
#----------------------------------------------------POST ENDPOINTS----------------------------------------------------

#API to create user
@router.post("/create-user", status_code=status.HTTP_201_CREATED)
async def create_user(
    user: CreateUserRequest,
    current_user: dict = Depends(lambda: get_current_user(allowed_roles=[UserRole.ADMIN])),
    db: db_dependency  # Database dependency
):
    user_interface = UserInterface(db)
    
    try:
        db_user = user_interface.create_user(user)
        user_response = CreateUserResponse.from_orm(db_user)
        return success_response(
            message="User created successfully",
            data=user_response,
        )
    except Exception as e:
        return error_response(
            message="User creation failed: " + str(e),
            error_code=500
        )
