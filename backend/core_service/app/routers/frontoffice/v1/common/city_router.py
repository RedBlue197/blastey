from fastapi import status, APIRouter, Query,Request

from dependencies.db_dependency import db_dependency
from dependencies.auth_dependency import user_dependency

from interfaces.common.city_interface import CityInterface



from responses.common.city_response import GetCitiesResponse

from utils.responses import api_response

from typing import Optional

from main import limiter

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/cities",
    tags=['Frontoffice Cities']
)

#----------------------------------------------------GET ENDPOINTS----------------------------------------------------

@router.get("/", status_code=status.HTTP_200_OK)
@limiter.limit("60/minute")
async def get_cities(
    request: Request,
    user: user_dependency,
    db: db_dependency,
    search: Optional[str] = Query(None),
    ):
    # Query cities using the interface
    cities = CityInterface(db=db).get_cities(search)

    cities_response = GetCitiesResponse.model_validate(cities, from_attributes=True)

    # Handle response for empty cities
    if not cities_response:
        return api_response(
            success=True,
            message="No cities found",
            data=[],
            status_code=204
        )

    # Return response
    return api_response(
        success=True,
        message="Cities found",
        data=cities_response,
        status_code=200
    )
    