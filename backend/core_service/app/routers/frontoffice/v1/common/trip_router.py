from fastapi import APIRouter, Query,Request

from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import user_dependency

from interfaces.trip_interface import TripInterface

# from schemas.trip_schema import (

#     )

from responses.trip_response import (
    GetTripsResponse,
    GetTripByIdResponse,
    )

from utils.responses import api_response

from main import limiter

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/trips",
    tags=['Frontoffice Trips']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#API to get all trips
@router.get("/")
@limiter.limit("60/minute")
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
@router.get("/by-trip-id/{trip_id}")
async def get_trip_by_id(
    db: db_dependency,
    trip_id: uuid.UUID,
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
            message="Trip not found",
            status_code=404
            )

#API to get all trips by host id
@router.get("/by-host-id/")
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

#API to get the top trips in terms of upvotes
@router.get("/top-trips")
async def get_top_trips(
    db: db_dependency,
    page: int = Query(1, ge=1),
    items_per_page: int = Query(4, le=100),
    ):
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query trips with pagination using the interface
    trips, total_count = TripInterface(db=db).get_top_trips(offset, limit)

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

#API get the trips by city name
@router.get("/by-city-name")
async def get_trips_by_city_name(
    db: db_dependency,
    city_name: str = Query(..., description="Name of the city"),
    page: int = Query(1, ge=1, description="Page number"),
    items_per_page: int = Query(10, le=100, description="Number of items per page"),
):
    offset = (page - 1) * items_per_page
    limit = items_per_page

    # put first letter capital letter
    city_name = city_name.capitalize()
    print(city_name)
    # Query trips with pagination using the interface
    trips, total_count = TripInterface(db=db).get_trips_by_city_name(city_name, offset, limit)

    # Calculate total pages
    total_pages = (total_count + items_per_page - 1) // items_per_page

    # Handle response for empty trips
    if len(trips['trips'])==0:
        return api_response(
            success=True,
            message="No trips found",
            data=[],
            total_count=0,
            current_page=page,
            total_pages=0,
            items_per_page=items_per_page,
            status_code=404
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