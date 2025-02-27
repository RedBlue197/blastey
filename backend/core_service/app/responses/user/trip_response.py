from pydantic import BaseModel,UUID4,Field
import uuid
from models.trip_model import TripItemCategoryEnum, TripItemTypeEnum, TripCreationStatusEnum
from typing import List, Optional
from datetime import datetime

#-------------------------------------GET RESPONSES--------------------------------------

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
    trip_upvote: Optional[int] = None
    trip_downvote: Optional[int] = None
    trip_lowest_trip_opening_price:float
    trip_image_url : Optional[str] = Field(None, pattern=r'^https?:\/\/\S+$', description="Link URL of the trip")
    host: GetTripHostResponse

class GetTripsResponse(BaseModel):
    trips: list[GetTripResponse]

    class Config:
        orm_mode = True
        from_attributes = True  # This is the key setting

class GetTripItemResponse(BaseModel):
    trip_item_id: uuid.UUID
    trip_item_name: str
    trip_item_description: Optional[str] = None
    trip_item_category: TripItemCategoryEnum
    trip_item_address: Optional[str] = None
    trip_item_traveler_reward: Optional[float] = None
    trip_item_type: TripItemTypeEnum
    trip_item_price: Optional[float] = None
    trip_id: uuid.UUID

    class Config:
        orm_mode = True
        from_attributes = True


class GetTripOpeningResponse(BaseModel):
    trip_opening_id: uuid.UUID
    trip_id: uuid.UUID
    trip_opening_start_date: datetime
    trip_opening_end_date: datetime
    trip_opening_total_reward: Optional[float] = None
    is_limited_availability: bool
    trip_opening_total_availability: Optional[int] = None
    trip_opening_total_booking: Optional[int] = None
    trip_opening_price: float

    class Config:
        orm_mode = True
        from_attributes = True

class GetTripImageResponse(BaseModel):
    trip_image_id: uuid.UUID
    trip_id: uuid.UUID
    trip_image_url: str
    trip_image_is_primary: bool

    class Config:
        orm_mode = True
        from_attributes = True

class GetTripRatingResponse(BaseModel):
    trip_rating_id: uuid.UUID
    trip_id: uuid.UUID
    trip_client_id: uuid.UUID
    trip_rating_score: int
    trip_rating_review: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True

class GetTripByIdResponse(BaseModel):
    trip_id: uuid.UUID
    trip_title: str
    trip_description: Optional[str] = None
    trip_origin: Optional[str] = None
    trip_destination: Optional[str] = None
    trip_total_availability: Optional[int] = None
    trip_total_booking: Optional[int] = None
    host_id: uuid.UUID
    trip_items: List[GetTripItemResponse]
    trip_openings: List[GetTripOpeningResponse]
    trip_images: List[GetTripImageResponse]
    trip_ratings: List[GetTripRatingResponse]

    class Config:
        orm_mode = True
        from_attributes = True

#-------------------------------------CREATE RESPONSES--------------------------------------
