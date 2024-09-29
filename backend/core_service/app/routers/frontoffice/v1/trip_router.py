from fastapi import status, APIRouter, Query, UploadFile, File
from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import auth_dependency,user_dependency
from interfaces.trip_interface import TripInterface
from schemas.trip_schema import CreateTripRequest, PatchTripRequest
from responses.trip_response import GetTripsResponse,GetTripByIdResponse,CreateTripResponse,CreateTripItemResponse
from utils.responses import success_response,error_response
from typing import Optional

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/trips",
    tags=['Frontoffice Trips']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#API to get all trips
@router.get("/", status_code=status.HTTP_200_OK)
async def get_trips(
    user:user_dependency,
    db: db_dependency,
    page: int = Query(1, ge=1),
    items_per_page: int = Query(10, le=100),
):
    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query  with pagination using the interface
    trips, total_count = TripInterface(db=db).get_trips_with_pagination(offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response
    if not trips:
        return error_response(
            message="No trips found",
            error_code=404
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
    user:user_dependency,
    db: db_dependency,
    trip_id: uuid.UUID,
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

@router.post("/create-trip", status_code=status.HTTP_201_CREATED)
async def create_trip(
    db: db_dependency,
    trip: CreateTripRequest,
    image_files: list[UploadFile] = File(...),  # Accept multiple image files
):

    try:
        trip_obj = TripInterface(db=db).create_trip(trip, image_files)  # Pass image_files to create_trip

        # Pydantic automatically transforms the SQLAlchemy object to a response model
        trip_response = CreateTripResponse.from_orm(trip_obj)
        if not trip_response:
            return error_response(
                message="Failed to create trip",
                error_code=404  
            )
        else:
            return success_response(
                data=trip_response, 
                message="Trip created"
            )
    except Exception as e:
        return error_response(
            message="Failed to create trip : "+str(e),
            error_code=500
        )

#----------------------------------------------------PATCH ENDPOINTS----------------------------------------------------

@router.patch("/update-trip/{trip_id}", status_code=status.HTTP_200_OK)
async def patch_trip(
    trip_id: uuid.UUID, 
    db: db_dependency, 
    trip_update: PatchTripRequest,
    image_files: Optional[list[UploadFile]] = File(None),  # Image files are optional
):
    try:
        # Update trip in the database through the interface
        trip_obj = TripInterface(db=db).patch_trip(trip_id, trip_update, image_files)

        if not trip_obj:
            return error_response(
                message="Trip not found",
                error_code=404  
            )

        # Transform the updated trip object into response
        trip_response = CreateTripResponse.from_orm(trip_obj)
        trip_response.activity_items = [CreateTripItemResponse.from_orm(item) for item in trip_obj.items]

        return success_response(
            data=trip_response, 
            message="Trip updated"
        )
    except Exception as e:
        return error_response(
            message=f"Failed to update trip: {str(e)}",
            error_code=500
        )