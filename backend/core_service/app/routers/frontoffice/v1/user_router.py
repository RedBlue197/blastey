# app/routers/user_router.py

from fastapi import status, APIRouter, Query, Depends
from dependencies.db_dependency import db_dependency

import uuid
from interfaces.user_interface import UserInterface

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
