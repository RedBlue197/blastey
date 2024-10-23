from pydantic import BaseModel,UUID4
import uuid
from models.trip_model import TripItemCategoryEnum, TripItemTypeEnum, TripCreationStatusEnum
from typing import List, Optional
from datetime import datetime

#-------------------------------------GET SCHEMAS--------------------------------------


class GetTripHostResponse(BaseModel):
    user_name: str
    user_email: str
    user_phone_number: Optional[str] = None
    user_id: uuid.UUID


class GetTripResponse(BaseModel):
    trip_id: uuid.UUID
    trip_title: str
    trip_description: Optional[str] = None
    trip_origin: Optional[str] = None
    trip_destination: Optional[str] = None
    trip_link_url: Optional[str] = None
    trip_image: Optional[str] = None
    trip_upvote: Optional[int] = None
    trip_downvote: Optional[int] = None
    trip_lowest_trip_opening_price:float
    host: GetTripHostResponse


class GetTripsResponse(BaseModel):
    trips: list[GetTripResponse]

    class Config:
        orm_mode = True
        from_attributes = True  # This is the key setting

 
class GetTripByIdResponse(BaseModel):
    trip_id: uuid.UUID
    trip_title: str
    trip_description: Optional[str] = None
    trip_departure_date: Optional[datetime] = None
    trip_return_date: Optional[datetime] = None
    trip_origin: Optional[str] = None
    trip_destination: Optional[str] = None
    trip_total_availability: Optional[int] = None
    trip_total_booking: Optional[int] = None
    host_id: uuid.UUID

    class Config:
        orm_mode = True
        from_attributes = True

#-------------------------------------CREATE SCHEMAS--------------------------------------

class CreateTripOpeningItemResponse(BaseModel):
    trip_opening_item_id: UUID4
    trip_opening_item_name: str
    trip_opening_item_description: Optional[str]
    trip_opening_item_category: str  # Assuming this is an Enum or string representation
    trip_opening_item_address: Optional[str]
    trip_opening_item_traveler_reward: Optional[float]
    is_limited_availability: bool
    trip_opening_item_total_availability: Optional[int]
    trip_opening_item_total_booking: Optional[int]
    trip_opening_item_price: Optional[float]


class CreateTripOpeningResponse(BaseModel):
    trip_opening_id: UUID4
    trip_id: UUID4
    trip_opening_start_date: datetime
    trip_opening_end_date: datetime
    trip_opening_total_reward: Optional[float]
    is_limited_availability: bool
    trip_opening_total_availability: Optional[int]
    trip_opening_total_booking: Optional[int]
    trip_opening_price: float


class CreateTripOpeningsResponse(BaseModel):
    trip_openings: List[CreateTripOpeningResponse]
        
class CreateTripItemResponse(BaseModel):
    trip_item_name : str
    trip_item_description: Optional[str] = None
    trip_item_category : TripItemCategoryEnum
    trip_item_address : Optional[str] = None
    trip_item_traveler_reward : Optional[float] = None
    trip_item_type: TripItemTypeEnum
    trip_item_price: Optional[float] = None
    trip_item_id: uuid.UUID
    trip_id: uuid.UUID

class CreateTripItemsResponse(BaseModel):
    trip_items: list[CreateTripItemResponse]

    class Config:
        orm_mode = True
        from_attributes = True

class CreateTripResponse(BaseModel):
    trip_id: uuid.UUID
    trip_title: str
    trip_description: Optional[str] = None
    trip_origin: Optional[str] = None
    trip_destination: Optional[str] = None
    trip_link_url: Optional[str] = None
    trip_upvote: Optional[int] = None
    trip_downvote: Optional[int] = None
    trip_creation_status: TripCreationStatusEnum
    trip_base_price: Optional[float] = None
    trip_base_reward: Optional[float] = None
    host_id: uuid.UUID


    class Config:
        orm_mode = True