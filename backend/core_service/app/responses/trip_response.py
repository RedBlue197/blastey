from pydantic import BaseModel
import uuid
from models.trip_model import TripItemCategoryEnum, TripItemTypeEnum
from typing import Optional
from datetime import datetime


class GetTripResponse(BaseModel):
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

        
class CreateTripItemResponse(BaseModel):
    trip_item_date: Optional[datetime] = None
    trip_item_name : str
    trip_item_description: Optional[str] = None
    trip_item_category : TripItemCategoryEnum
    trip_item_address : Optional[str] = None
    trip_item_traveler_reward : Optional[int] = None
    trip_item_type: TripItemTypeEnum
    trip_item_price: Optional[float] = None
    trip_item_id: uuid.UUID


class CreateTripResponse(BaseModel):
    activity_items: list[CreateTripItemResponse]
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