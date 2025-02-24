from pydantic import BaseModel, Field, UUID4,field_validator
from models.trip_model import TripItemCategoryEnum, TripItemTypeEnum
from datetime import datetime
from typing import List, Optional
import json 


#----------------------------------------------------------CREATE SCHEMAS-----------------------------------------------------------------------------

class CreateTripSearchRequest(BaseModel):
    trip_search_origin : str = Field(None, max_length=100, description="Origin of the trip")
    trip_search_destination : str = Field(None, max_length=100, description="Destination of the trip")
    trip_search_start_date : datetime = Field(None, description="Start date of the trip")
    trip_search_end_date : Optional[datetime] = Field(None, description="End date of the trip")
    trip_search_comment : Optional[str] = Field(None, max_length=500, description="Comment of the trip")

