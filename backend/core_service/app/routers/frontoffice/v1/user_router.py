# app/routers/user_router.py

from fastapi import status, APIRouter, Query
from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import bcrypt_context

import uuid

from models.user_model import User,UserRank,UserRole

from interfaces.user_interface import UserInterface

from schemas.user_schema import CreateUserRequest

from utils.responses import success_response

router = APIRouter(
    prefix="/core/frontoffice/v1/users",
    tags=['Frontoffice Users']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------
@router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_by_id(
    user_id: uuid.UUID,
    db: db_dependency,  # Database dependency
    page: int = Query(1, ge=1),  # Default to page 1, must be greater than or equal to 1
    items_per_page: int = Query(10, le=100),  # Default to 10 items per page, max 100
):
    # Initialize UserInterface
    user_interface = UserInterface(db=db)

    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query the user by ID with pagination using the interface
    users, total_count = user_interface.get_user_by_id_with_pagination(str(user_id), offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response
    if not users:
        return success_response(
            message="No users found",
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )
    else:
        return success_response(
            data=users,
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )
    
#----------------------------------------------------POST ENDPOINTS----------------------------------------------------
@router.post("/create-user", status_code=status.HTTP_201_CREATED)
async def create_user(
    db: db_dependency,  # Database dependency
    user: CreateUserRequest
):
    try :
        db_user = User(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            user_role=UserRole(user.user_role),
            user_rank=UserRank(user.user_rank),
            user_phone_number=user.phone_number,
            user_password=bcrypt_context.hash(user.password),
            user_address=user.address,
            user_city=user.city,
            user_country=user.country,
            user_postal_code=user.postal_code
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        db.close()
    except Exception as e:
        return success_response(
            message="User creation failed",
            error=str(e)
        )

    # Handle response
    return success_response(
        message="User created successfully",
        data=db_user,
    )
