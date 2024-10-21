from fastapi import status, APIRouter, Query, UploadFile, File,Form,HTTPException,Request
from pydantic import ValidationError

from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import user_dependency

from interfaces.trip_interface import TripInterface

from schemas.trip_schema import CreateTripRequest,CreateTripItemsRequest, PatchTripRequest

from responses.trip_response import GetTripsResponse,GetTripByIdResponse,CreateTripResponse,CreateTripItemResponse,CreateTripOpeningsResponse

from utils.responses import api_response

from typing import Optional,List

from main import limiter

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/trips",
    tags=['Frontoffice Trips']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------


#API to get all trips
@router.get("/", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def get_trips(
    request: Request,
    db: db_dependency,
    page: int = Query(1, ge=1),
    items_per_page: int = Query(10, le=100),
):
    # Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query trips with pagination using the interface
    trips, total_count = TripInterface(db=db).get_trips_with_pagination(offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response for empty trips
    if not trips:
        return api_response(
            success=True,
            message="No trips found",
            data=[],
            total_count=0,
            current_page=page,
            total_pages=0,
            items_per_page=items_per_page,
            status_code=200
        )
    
    # Validate response
    trips_response = GetTripsResponse.model_validate(trips, from_attributes=True)

    # Return paginated trips data
    return api_response(
        message="Trips found",
        data=trips_response,
        total_count=total_count,
        current_page=page,
        total_pages=total_pages,
        items_per_page=items_per_page,
        status_code=200
    )


#API to get a specific trip by id
@router.get("/{trip_id}",response_model=GetTripByIdResponse, status_code=status.HTTP_200_OK)
async def get_trip_by_id(
    db: db_dependency,
    trip_id: uuid.UUID,
    user: user_dependency
):
    trip = TripInterface(db=db).get_trip_by_id(trip_id)
    if trip:
        trip_response=GetTripByIdResponse.model_validate(trip, from_attributes=True)
        return api_response(
            data=trip_response, 
            message="Trip found",
            status_code=200
            )
    else:
        return api_response(
            message="Trip not found"
            ,error_code=404
            )

#API to get all trips by host id
@router.get("/by-host-id/", status_code=status.HTTP_200_OK)
async def get_trips_by_host_id(
    user: user_dependency,
    db: db_dependency,
    page: int = Query(1, ge=1),
    items_per_page: int = Query(10, le=100),

):
    if user['user_role'] not in ["admin", "host","user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
# Calculate pagination offsets
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query trips with pagination using the interface
    trips, total_count = TripInterface(db=db).get_trips_by_user_id_with_pagination(user['user_id'],offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response for empty trips
    if not trips:
        return api_response(
            success=True,
            message="No trips found",
            data=[],
            total_count=0,
            current_page=page,
            total_pages=0,
            items_per_page=items_per_page,
            status_code=200
        )
    
    # Validate response
    trips_response = GetTripsResponse.model_validate(trips, from_attributes=True)

    # Return paginated trips data
    return api_response(
        message="Trips found",
        data=trips_response,
        total_count=total_count,
        current_page=page,
        total_pages=total_pages,
        items_per_page=items_per_page,
        status_code=200
    )


#----------------------------------------------------POST ENDPOINTS----------------------------------------------------
@router.post("/create-trip", status_code=status.HTTP_201_CREATED)
async def create_trip(
    user: user_dependency,
    db: db_dependency,
    trip: CreateTripRequest
):
    if user['user_role'] not in ["admin", "host"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    try:
        trip_obj = TripInterface(db=db).create_trip(trip)
        trip_response = CreateTripResponse.model_validate(trip_obj, from_attributes=True)
        return api_response(
            data=trip_response,
            message="Trip created",
            status_code=201
        )
    except Exception as e:
        return api_response(
            message="Failed to create trip: " + str(e),
            status_code=500
        )

#API to create trip items, need to create the interface function creat_trip_items
@router.post("/create-trip-items")
async def create_trip_items(
    user: user_dependency,
    db: db_dependency,
    trip_items: CreateTripItemsRequest
):
    if user['user_role'] not in ["admin", "host"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    try:
        trip_items_obj = TripInterface(db=db).create_trip_items(trip_items)
        trip_items_response = CreateTripItemsResponse.model_validate(trip_items_obj, from_attributes=True)
        return api_response(
            data=trip_items_response,
            message="Trip items created",
            status_code=201
        )
    except Exception as e:
        return api_response(
            message="Failed to create trip items: " + str(e),
            status_code=500
        )

#API to create trip openings and trips items, need to create the interface function creat_trip_openings
@router.post("/create-trip-openings")
async def create_trip_openings(
    user: user_dependency,
    db: db_dependency,
    trip_openings: CreateTripOpeningsRequest
):
    if user['user_role'] not in ["admin", "host"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    try:
        trip_openings_obj = TripInterface(db=db).create_trip_openings_obj(trip_openings)
        trip_openings_response = CreateTripOpeningsResponse.model_validate(trip_openings_obj, from_attributes=True)
        return api_response(
            data=trip_openings_response,
            message="Trip openings created",
            status_code=201
        )
    except Exception as e:
        return api_response(
            message="Failed to create trip: " + str(e),
            status_code=500
        )

#----------------------------------------------------PATCH ENDPOINTS----------------------------------------------------

@router.patch("/update-trip/{trip_id}", status_code=status.HTTP_200_OK)
async def patch_trip(
    user: user_dependency,
    trip_id: uuid.UUID,
    db: db_dependency, 
    trip_update: PatchTripRequest,
    image_files: Optional[list[UploadFile]] = File(None),  # Image files are optional
):
    if user['user_role'] not in ["admin", "host"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
    if user.user_id != trip_update.host_id:
        return api_response(
            message="Unauthorized request",
            status_code=403
        )

    try:
        # Update trip in the database through the interface
        trip_obj = TripInterface(db=db).patch_trip(trip_id, trip_update, image_files)

        if not trip_obj:
            return api_response(
                message="Trip not found",
                status_code=404  
            )

        # Transform the updated trip object into response
        trip_response = CreateTripResponse.model_validate(trip_obj, from_attributes=True)

        return api_response(
            data=trip_response, 
            message="Trip updated",
            status_code=204
        )
    except Exception as e:
        return api_response(
            message=f"Failed to update trip: {str(e)}",
            status_code=500
        )
    

#----------------------------------------------------DELETE ENDPOINTS----------------------------------------------------
@router.delete("/delete-all-trips", status_code=status.HTTP_200_OK)
async def delete_all_trips(
    user: user_dependency,
    db: db_dependency
):
    
    #check role of user
    # if user['user_role'] not in ["admin"]:
    #     return api_response(
    #         message="Unauthorized Role",
    #         error_code=401
    #     )
    
    # Delete all trips
    TripInterface(db=db).delete_all_trips()

    return api_response(
        message="All trips deleted"
    )