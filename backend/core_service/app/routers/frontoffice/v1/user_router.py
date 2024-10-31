# app/routers/user_router.py

from fastapi import status, APIRouter, Query,Request,BackgroundTasks

from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import auth_bearer

import uuid

from interfaces.user_interface import UserInterface

from schemas.user_schema import (
    CreateUserRequest,
    PutUserVerificationRequest
    )

from responses.user_response import (
    GetUserByIdResponse,
    GetUserResponse,
    CreateUserResponse,
    
    )

from utils.responses import api_response

from utils.send_verification_email import send_verification_email

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

    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query all users with pagination using the interface
    users, total_count = UserInterface(db=db).get_all_users_with_pagination(offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response
    if not users:
        return api_response(
            message="No users found",
            error_code=404
        )
    else:
        users_response = [GetUserByIdResponse.from_orm(user) for user in users]

        return api_response(
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

    # Query the user by ID with pagination using the interface
    user = UserInterface(db=db).get_user_by_id_with_pagination(str(user_id))

    # Handle response
    if not user:
        return api_response(
            message="No users found",
            error_code=404
        )
    else:
        user_response=GetUserByIdResponse.from_orm(user)
        return api_response(
            data=user_response,

        )
    
#----------------------------------------------------POST ENDPOINTS----------------------------------------------------

#API to create user
@router.post("/create-user", status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: CreateUserRequest,
    db: db_dependency,
    background_tasks: BackgroundTasks
    ):
    
    try:
        user_obj = UserInterface(db).create_user(user_data)
        user_response = CreateUserResponse.model_validate(user_obj.user, from_attributes=True)

        # Generate Content
        subject = "Verify your email"
        body = "<h1>Welcome!</h1><p>Click the link below to verify your email:</p>"

        # Add send_email as a background task
        background_tasks.add_task(send_verification_email(), subject, [user_obj.user.user_email], body, user_obj.user.verification_code_value)


        return api_response(
            message="User created successfully and verification email is sent",
            data=user_response,
            status_code=201
        )
    except Exception as e:
        return api_response(
            message="User creation failed: " + str(e),
            status_code=500
        )


#----------------------------------------------------PUT ENDPOINTS----------------------------------------------------

#API to verify email
@router.put("/update-user-email-verification-status", status_code=status.HTTP_200_OK)
async def verify_user_email(
    user_data: PutUserVerificationRequest,
    db: db_dependency
    ):

    try:
        is_verified = UserInterface(db).update_user_verification(user_data)

        if is_verified:
            return api_response(
                message="User verified successfully",
                status_code=202
            )
        else:
            return api_response(
                message="User verification failed",
                status_code=500
            )

    except Exception as e:
        return api_response(
            message="User verification failed: " + str(e),
            status_code=500
        )