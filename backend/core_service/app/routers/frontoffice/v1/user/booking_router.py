from fastapi import status, APIRouter, Query
from dependencies.db_dependency import db_dependency
from utils.responses import api_response
from utils.extract_user import extract_user_id

import uuid

router = APIRouter(
    prefix="/core/frontoffice/v1/bookings",
    tags=['Frontoffice Bookings']
)
