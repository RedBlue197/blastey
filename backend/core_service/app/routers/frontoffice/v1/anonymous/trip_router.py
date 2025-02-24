from fastapi import APIRouter, Query,Request, status

from dependencies.db_dependency import db_dependency

from interfaces.trip_interface import TripInterface

from responses.trip_response import (
    GetTripsResponse,
    GetTripByIdResponse,
    )

from schemas.trip_schema import (
    CreateTripSearchRequest
)

from utils.responses import api_response

from main import limiter

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/anonymous/trips",
    tags=['Frontoffice Anonymous Trips']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#API to get all trips
@router.get("/")
@limiter.limit("20/minute")
async def get_trips(
    request: Request,
    db: db_dependency,
    page: int = Query(1, ge=1),
    items_per_page: int = Query(10, le=100),
    ):
    try :
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
    except Exception as e:
        return api_response(
            message="Failed to get trips: " + str(e),
            status_code=500
        )

#API to get a specific trip by id
@router.get("/by-trip-id/{trip_id}")
@limiter.limit("20/minute")
async def get_trip_by_id(
    request: Request,
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

#----------------------------------------------------POST ENDPOINTS----------------------------------------------------


@router.post("/create-trip-search",status_code=status.HTTP_201_CREATED)
async def create_trip_search(
    db: db_dependency,
    trip_search: CreateTripSearchRequest,
    page: int = Query(1, ge=1),
    items_per_page: int = Query(10, le=100),
    ):

    offset = (page - 1) * items_per_page
    limit = items_per_page

    # Query trips with pagination using the interface

    # Calculate total pages
    try :
        trip_search_obj,total_count = TripInterface(db=db).create_trip_search(trip_search, offset, limit)
        if not trip_search_obj['trips']:
            return api_response(
                message="Trip search not found",
                status_code=201
            )
        else: 
            trip_search_response = GetTripsResponse.model_validate(trip_search_obj, from_attributes=True)
            total_pages = (total_count + items_per_page - 1) // items_per_page
            return api_response(
                data=trip_search_response,
                message="Trip search created",
                status_code=201,
                total_count=total_count,
                current_page=page,
                total_pages=total_pages,
                items_per_page=items_per_page,
            )
    except Exception as e:
        return api_response(
            message="Failed to create trip search: " + str(e),
            status_code=500
        )
