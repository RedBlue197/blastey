from fastapi import status, APIRouter, Query, UploadFile, File,Form,HTTPException,Request
from pydantic import UUID4

from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import user_dependency

from interfaces.trip_interface import TripInterface

from schemas.trip_schema import (
    CreateTripRequest,
    CreateTripItemsRequest,
    CreateTripOpeningsRequest,
    CreateTripImagesRequest, 
    PutTripRequest,
    PutTripItemsRequest,
    PutTripOpeningsRequest
    )

from responses.trip_response import (
    GetTripsResponse,
    GetTripByIdResponse,
    CreateTripResponse,
    CreateTripItemsResponse,
    CreateTripOpeningsResponse,
    PutTripResponse,
    PutTripItemsResponse,
    PutTripOpeningsResponse
    )

from utils.responses import api_response

from typing import List

from main import limiter

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/trips",
    tags=['Frontoffice Trips']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

#API to get all trips
@router.get("/")
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
@router.get("/{trip_id}")
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

#----------------------------------------------------POST ENDPOINTS----------------------------------------------------
@router.post("/create-trip")
async def create_trip(
    user: user_dependency,
    db: db_dependency,
    trip: CreateTripRequest
    ):
    if user['user_role'] not in ["admin", "host","user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    host_id= user['user_id']
    try:
        trip_obj = TripInterface(db=db).create_trip(trip,host_id)
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

#API to create trip items
@router.post("/create-trip-items")
async def create_trip_items(
    user: user_dependency,
    db:db_dependency,
    trip_items: CreateTripItemsRequest
    ):
    # Only admin or host can create trip items
    if user['user_role'] not in ["admin", "host","user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
    try:
        # User
        host_id = user['user_id']
        # Create trip items using the interface
        trip_items_obj = TripInterface(db=db).create_trip_items(trip_items,host_id)

        
        # Convert the response object to the appropriate response schema
        trip_items_response = CreateTripItemsResponse.model_validate(trip_items_obj, from_attributes=True)
        
        return api_response(
            data=trip_items_response,
            message="Trip items created successfully",
            status_code=201
        )
    
    except HTTPException as http_exc:
        return api_response(
            message=http_exc.detail,
            status_code=http_exc.status_code
        )
    except Exception as e:
        return api_response(
            message="Failed to create trip items: " + str(e),
            status_code=500
        )

#API to create trip openings and trips items
@router.post("/create-trip-openings")
async def create_trip_openings(
    user: user_dependency,
    db: db_dependency,
    trip_openings: CreateTripOpeningsRequest
    ):
    if user['user_role'] not in ["admin", "host","user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    host_id= user['user_id']
    try:
        trip_openings_obj = TripInterface(db=db).create_trip_openings(trip_openings,host_id)
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

#[TO TEST] api to create trip images
@router.post("/create-trip-images")
async def create_trip_images(
        user: user_dependency,
        db: db_dependency,
        trip_id:  str = Form(...),  # Accept `trip_id` as a form field
        trip_images_data:  str = Form(...),  # Accept `trip_id` as a form field
        trip_images: List[UploadFile] = File(...)
    ):
    if user['user_role'] not in ["admin", "host", "user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
    host_id = user['user_id']
    try:
        # Parse the trip_images_data JSON string into a Python object
        trip_images_data_obj = CreateTripImagesRequest.model_validate_json(trip_images_data)
        
        # Pass the parsed data and images to the interface
        trip_images_obj = TripInterface(db=db).create_trip_images(trip_images_data_obj, trip_images, host_id)
        
        trip_images_response = CreateTripOpeningsResponse.model_validate(trip_images_obj, from_attributes=True)
        return api_response(
            data=trip_images_response,
            message="Trip images created",
            status_code=201
        )
    except Exception as e:
        return api_response(
            message="Failed to create trip images: " + str(e),
            status_code=500
        )
#----------------------------------------------------PUT ENDPOINTS----------------------------------------------------
@router.put("/update-trip")
async def put_trip(
    user: user_dependency,
    db: db_dependency, 
    trip_update: PutTripRequest,
    ):
    if user['user_role'] not in ["admin", "host","user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
    user_id = user['user_id']


    try:
        # Update trip in the database through the interface
        trip_obj = TripInterface(db=db).put_trip(user_id,trip_update)

        if not trip_obj:
            return api_response(
                message="Trip not found",
                status_code=404  
            )

        # Transform the updated trip object into response
        trip_response = PutTripResponse.model_validate(trip_obj, from_attributes=True)

        return api_response(
            data=trip_response, 
            message="Trip updated",
            status_code=202
        )
    except Exception as e:
        return api_response(
            message=f"Failed to update trip: {str(e)}",
            status_code=500
        )

@router.put("/update-trip-items")
async def put_trip_items(
    user: user_dependency,
    db: db_dependency, 
    trip_items_update: PutTripItemsRequest,
    ):
    if user['user_role'] not in ["admin", "host","user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
    user_id = user['user_id']


    try:
        # Update trip in the database through the interface
        trip_items_obj = TripInterface(db=db).put_trip_items(user_id,trip_items_update)

        if not trip_trip_items_objobj:
            return api_response(
                message="Trip Items not found",
                status_code=404  
            )

        # Transform the updated trip object into response
        trip_items_response = PutTripItemsResponse.model_validate(trip_items_obj, from_attributes=True)

        return api_response(
            data=trip_items_response, 
            message="Trip items updated",
            status_code=202
        )
    except Exception as e:
        return api_response(
            message=f"Failed to update trip: {str(e)}",
            status_code=500
        )

#[TO Complete] api to put trip openings
@router.put("/update-trip-openings")
async def put_trip_openings(
    user: user_dependency,
    db: db_dependency, 
    trip_openings_update: PutTripOpeningsRequest,
    ):
    if user['user_role'] not in ["admin", "host","user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
    user_id = user['user_id']


    try:
        # Update trip in the database through the interface
        trip_openings_obj = TripInterface(db=db).put_trip_openings(user_id,trip_openings_update)

        if not trip_openings_obj:
            return api_response(
                message="Trip Openings not found",
                status_code=404  
            )

        # Transform the updated trip object into response
        trip_openings_response = PutTripOpeningsResponse.model_validate(trip_openings_obj, from_attributes=True)

        return api_response(
            data=trip_openings_response, 
            message="Trip Openings updated",
            status_code=202
        )
    except Exception as e:
        return api_response(
            message=f"Failed to update trip openings: {str(e)}",
            status_code=500
        )

#[TO START] api to patch trip images
@router.put("/update-trip-images")
async def put_trip_images(
    user: user_dependency,
    db: db_dependency, 
    data: str = Form(...),  # JSON string of trip images metadata
    ):
    if user['user_role'] not in ["admin", "host", "user"]:
        return api_response(
            message="Unauthorized Role",
            status_code=403
        )
    
    host_id = user['user_id']
    try:
        # Parse the trip_images_data JSON string into a Python object
        trip_images_data_obj = CreateTripImagesRequest.model_validate_json(trip_images_data)
        
        # Pass the parsed data and images to the interface
        trip_images_obj = TripInterface(db=db).create_trip_images(trip_images_data_obj, trip_images, host_id)
        
        trip_images_response = CreateTripOpeningsResponse.model_validate(trip_images_obj, from_attributes=True)
        return api_response(
            data=trip_images_response,
            message="Trip images created",
            status_code=202
        )
    except Exception as e:
        return api_response(
            message="Failed to create trip images: " + str(e),
            status_code=500
        )
#----------------------------------------------------DELETE ENDPOINTS----------------------------------------------------
@router.delete("/delete-all-trips")
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