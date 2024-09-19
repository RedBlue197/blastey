from fastapi import status, APIRouter, Query, HTTPException, Request,Depends
from dependencies.db_dependency import db_dependency
from dependencies.role_dependency import role_required
from models.user_model import UserRole
from models.trip_model import Trip, TripItem
from interfaces.trip_interface import TripInterface
from utils.responses import success_response
from utils.extract_user import extract_user_id

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/trips",
    tags=['Frontoffice Trips']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#API to get all trips
@router.get("/", status_code=status.HTTP_200_OK)
async def get_trips(
    db: db_dependency,
    Depends(role_required(required_roles=[UserRole.USER, UserRole.ADMIN])),
    page: int = Query(1, ge=1),  # Default to page 1, must be greater than or equal to 1
    items_per_page: int = Query(10, le=100),  # Default to 10 items per page, max 100
):
    # Initialize UserInterface
    trip_interface = TripInterface(db=db)

    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query  with pagination using the interface
    trips, total_count = trip_interface.get_trips_with_pagination(str(user_id), offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response
    if not trips:
        return success_response(
            message="No trips found",
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

