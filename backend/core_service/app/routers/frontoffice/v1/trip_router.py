from fastapi import status, APIRouter, Query, HTTPException, Request,Depends, UploadFile, File
from dependencies.db_dependency import db_dependency
from dependencies.role_dependency import role_required
from models.user_model import UserRole
from models.trip_model import Trip, TripItem
from interfaces.trip_interface import TripInterface
from schemas.trip_schema import CreateTripRequest
from responses.trip_response import GetTripsResponse,GetTripByIdResponse,CreateTripResponse
from utils.responses import success_response,error_response
from utils.extract_user import extract_user_id

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/trips",
    tags=['Frontoffice Trips']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#API to get all trips
@router.get("/",response_model=GetTripsResponse, status_code=status.HTTP_200_OK)
async def get_trips(
    db: db_dependency,
    Depends(role_required(required_roles=[UserRole.USER, UserRole.ADMIN])),
    page: int = Query(1, ge=1),  # Default to page 1, must be greater than or equal to 1
    items_per_page: int = Query(10, le=100),  # Default to 10 items per page, max 100
):
    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query  with pagination using the interface
    trips, total_count = TripInterface(db=db).trip_interface.get_trips_with_pagination(str(user_id), offset, limit)

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
        trips_response=GetTripsResponse.from_orm(trips)
        return success_response(
            data=trips_response,
            total_count=total_count,
            current_page=page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )

#API to get a specific trip by id
@router.get("/{trip_id}",response_model=GetTripByIdResponse, status_code=status.HTTP_200_OK)
async def get_trip_by_id(
    db: db_dependency,
    trip_id: uuid.UUID,
    Depends(role_required(required_roles=[UserRole.USER, UserRole.ADMIN])),
):
    trip = TripInterface(db=db).get_trip_by_id(trip_id)
    if trip:
        trip_response=GetTripByIdResponse.from_orm(trip)
        return success_response(
            data=trip_response, 
            message="Trip found"
            )
    else:
        return error_response(
            message="Trip not found"
            ,error_code=404
            )


#----------------------------------------------------POST ENDPOINTS----------------------------------------------------

@router.post("/create-trip", response_model=CreateTripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    db: Session = Depends(db_dependency),
    trip: CreateTripRequest,
    image_files: List[UploadFile] = File(...),  # Accept multiple image files
    _: UserRole = Depends(role_required(required_roles=[UserRole.HOST])),
):
    trip_obj = TripInterface(db=db).create_trip(trip, image_files)  # Pass image_files to create_trip

    # Pydantic automatically transforms the SQLAlchemy object to a response model
    trip_response = CreateTripResponse.from_orm(trip_obj)

    return success_response(
        data=trip_response, 
        message="Trip created"
    )
