from pydantic import BaseModel, Field, UUID4
from models.trip_model import TripItemCategoryEnum, TripItemTypeEnum
from datetime import datetime
from typing import List, Optional

class CreateTripItemImageRequest(BaseModel):
    trip_image_is_primary: bool = Field(..., description="Indicates if the image is primary")


class CreateTripOpeningItemRequest(BaseModel):
    trip_opening_item_name: str = Field(..., min_length=1, max_length=100, description="Name of the trip opening item")
    trip_opening_item_description : str = Field(None, max_length=500, description="Description of the trip opening item")
    trip_opening_item_category : TripItemCategoryEnum = Field(..., description="Category of the trip opening item")
    trip_opening_item_address : str = Field(..., max_length=200, description="Address of the trip opening item")
    trip_opening_item_traveler_reward : int = Field(..., description="Traveler reward for the trip opening item")
    trip_opening_item_type : TripItemTypeEnum = Field(..., description="Type of the trip opening item")


class CreateTripOpeningRequest(BaseModel):
    trip_opening_start_date: Optional[datetime] = Field(None, description="Start date of the trip opening")
    trip_opening_end_date : Optional[datetime] = Field(None, description="End date of the trip opening")
    trip_opening_total_reward : Optional[int] = Field(None, description="Traveler reward for the trip item")
    is_limited_availability : bool = Field(..., description="Indicates if the trip opening is limited")
    trip_opening_total_availability : Optional[int] = Field(None, description="Total availability of the trip opening")
    trip_opening_price : int = Field(..., description="Price of the trip opening")


class CreateTripItemRequest(BaseModel):
    trip_item_date: Optional[datetime] = Field(None, description="Date of the trip item")
    trip_item_name: str = Field(..., min_length=1, max_length=100, description="Name of the trip item")
    trip_item_description: Optional[str] = Field(None, max_length=500, description="Description of the trip item")
    trip_item_category: TripItemCategoryEnum = Field(..., description="Category of the trip item")
    trip_item_address: Optional[str] = Field(None, max_length=200, description="Address of the trip item")
    trip_item_traveler_reward: Optional[int] = Field(None, description="Traveler reward for the trip item")
    trip_item_type: TripItemTypeEnum = Field(..., description="Type of the trip item")
    trip_item_price: Optional[float] = Field(None, ge=0, description="Price of the trip item")
    
class CreateTripItemsRequest(BaseModel):
    trip_items: List[CreateTripItemRequest] = Field(..., min_items=1, description="List of trip items")
    

class CreateTripRequest(BaseModel):
    trip_items: List[CreateTripItemRequest] = Field(..., min_items=1, description="List of trip items")
    trip_images: Optional[List[CreateTripItemImageRequest]] = Field(None, description="List of trip images")
    trip_title: str = Field(..., min_length=1, max_length=200, description="Title of the trip")
    trip_description: Optional[str] = Field(None, max_length=1000, description="Description of the trip")
    trip_origin: Optional[str] = Field(None, max_length=100, description="Origin of the trip")
    trip_destination: Optional[str] = Field(None, max_length=100, description="Destination of the trip")
    host_id: UUID4 = Field(..., description="Host ID")
    trip_link_url: Optional[str] = Field(None, pattern=r'^https?:\/\/\S+$', description="Link URL of the trip")
    trip_base_price: Optional[float] = Field(None, ge=0, description="Price of the trip")
    trip_base_reward : Optional[float] = Field(None, ge=0, description="Base reward of the trip")

class PatchTripItemRequest(BaseModel):
    trip_item_date: Optional[datetime] = Field(None, description="Date of the trip item")
    trip_item_name: Optional[str] = Field(None, min_length=1, max_length=100, description="Name of the trip item")
    trip_item_description: Optional[str] = Field(None, max_length=500, description="Description of the trip item")
    trip_item_category: Optional[TripItemCategoryEnum] = Field(None, description="Category of the trip item")
    trip_item_address: Optional[str] = Field(None, max_length=200, description="Address of the trip item")
    trip_item_traveler_reward: Optional[int] = Field(None, description="Traveler reward for the trip item")
    trip_item_type: Optional[TripItemTypeEnum] = Field(None, description="Type of the trip item")
    trip_item_price: Optional[float] = Field(None, ge=0, description="Price of the trip item")
    trip_item_id: UUID4 = Field(..., description="Trip item ID")


class PatchTripRequest(BaseModel):
    trip_id: UUID4 = Field(..., description="Trip ID")
    trip_items: Optional[List[PatchTripItemRequest]] = Field(None, description="List of trip items")
    trip_images: Optional[List[CreateTripItemImageRequest]] = Field(None, description="List of trip images")
    trip_title: Optional[str] = Field(None, min_length=1, max_length=200, description="Title of the trip")
    trip_description: Optional[str] = Field(None, max_length=2000, description="Description of the trip")
    trip_departure_date: Optional[datetime] = Field(None, description="Departure date of the trip")
    trip_return_date: Optional[datetime] = Field(None, description="Return date of the trip")
    trip_origin: Optional[str] = Field(None, max_length=100, description="Origin of the trip")
    trip_destination: Optional[str] = Field(None, max_length=100, description="Destination of the trip")
    trip_total_availability: Optional[int] = Field(None, description="Total availability of the trip")
    trip_total_booking: Optional[int] = Field(None, description="Total bookings of the trip")
    host_id: Optional[UUID4] = Field(None, description="Host ID")
    trip_link_url: Optional[str] = Field(None, pattern=r'^https?:\/\/\S+$', description="Link URL of the trip")
    trip_price: Optional[float] = Field(None, ge=0, description="Price of the trip")
    status : Optional [bool] = Field(None, description="Status of the trip")

