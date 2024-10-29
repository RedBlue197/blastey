from pydantic import BaseModel, Field, UUID4
from models.trip_model import TripItemCategoryEnum, TripItemTypeEnum
from datetime import datetime
from typing import List, Optional

class CreateTripItemImageRequest(BaseModel):
    trip_image_is_primary: bool = Field(..., description="Indicates if the image is primary")



class CreateTripOpeningItemRequest(BaseModel):
    trip_opening_item_name: str = Field(..., min_length=1, max_length=100, description="Name of the trip opening item")
    trip_opening_item_description: Optional[str] = Field(None, max_length=500, description="Description of the trip opening item")
    trip_opening_item_category: TripItemCategoryEnum = Field(..., description="Category of the trip opening item")
    trip_opening_item_address: str = Field(..., max_length=200, description="Address of the trip opening item")
    trip_opening_item_traveler_reward: Optional[float] = Field(None, description="Traveler reward for the trip opening item")
    is_limited_availability: bool = Field(..., description="Indicates if this item has limited availability")
    trip_opening_item_total_availability: int = Field(..., description="Total availability for this trip opening item")
    trip_opening_item_total_booking: Optional[int] = Field(None, description="Total bookings for this trip opening item")
    trip_opening_item_price: Optional[float] = Field(None, description="Price of this trip opening item")
    trip_item_id: UUID4 = Field(..., description="ID of the trip item to link this opening to")


class CreateTripOpeningRequest(BaseModel):
    trip_opening_start_date: datetime = Field(..., description="Start date of the trip opening")
    trip_opening_end_date: datetime = Field(..., description="End date of the trip opening")
    trip_opening_total_reward: Optional[float] = Field(None, description="Total reward for this trip opening")
    is_limited_availability: bool = Field(..., description="Indicates if the trip opening has limited availability")
    trip_opening_total_availability: Optional[int] = Field(None, description="Total availability of the trip opening")
    trip_opening_total_booking: Optional[int] = Field(None, description="Total bookings for this trip opening")
    trip_opening_price: float = Field(..., description="Price of this trip opening")
    trip_opening_items: Optional[List[CreateTripOpeningItemRequest]] = Field(None, description="List of trip opening items")


class CreateTripOpeningsRequest(BaseModel):
    trip_openings: List[CreateTripOpeningRequest] = Field(..., min_items=1, description="List of trip openings")
    trip_id: UUID4 = Field(..., description="Trip ID")


class CreateTripItemRequest(BaseModel):
    trip_item_name: str = Field(..., min_length=1, max_length=100, description="Name of the trip item")
    trip_item_description: Optional[str] = Field(None, max_length=500, description="Description of the trip item")
    trip_item_category: TripItemCategoryEnum = Field(..., description="Category of the trip item")
    trip_item_address: Optional[str] = Field(None, max_length=200, description="Address of the trip item")
    trip_item_traveler_reward: Optional[int] = Field(None, description="Traveler reward for the trip item")
    trip_item_type: TripItemTypeEnum = Field(..., description="Type of the trip item")
    trip_item_price: Optional[float] = Field(None, ge=0, description="Price of the trip item")
    
class CreateTripItemsRequest(BaseModel):
    trip_items: List[CreateTripItemRequest] = Field(..., min_items=1, description="List of trip items")
    trip_id: UUID4 = Field(..., description="Trip ID")

class CreateTripRequest(BaseModel):
    trip_title: str = Field(..., min_length=1, max_length=200, description="Title of the trip")
    trip_description: Optional[str] = Field(None, max_length=1000, description="Description of the trip")
    trip_origin: Optional[str] = Field(None, max_length=100, description="Origin of the trip")
    trip_destination: Optional[str] = Field(None, max_length=100, description="Destination of the trip")
    trip_link_url: Optional[str] = Field(None, pattern=r'^https?:\/\/\S+$', description="Link URL of the trip")
    trip_base_price: Optional[float] = Field(None, ge=0, description="Price of the trip")
    trip_base_reward : Optional[float] = Field(None, ge=0, description="Base reward of the trip")

class CreateTripImageRequest(BaseModel):
    trip_image_is_primary: bool = Field(..., description="Indicates if the image is primary")

class CreateTripImagesRequest(BaseModel):
    trip_images: List[CreateTripImageRequest] = Field(..., min_items=1, description="List of trip images")

#----------------------------------------------------------PATCH SCHEMAS-----------------------------------------------------------------------------

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


#----------------------------------------------------------PUT SCHEMAS-----------------------------------------------------------------------------

class PutTripRequest(BaseModel):
    trip_id: UUID4 = Field(..., description="Trip ID")
    trip_title: str = Field(..., min_length=1, max_length=200, description="Title of the trip")
    trip_description: Optional[str] = Field(None, max_length=1000, description="Description of the trip")
    trip_origin: Optional[str] = Field(None, max_length=100, description="Origin of the trip")
    trip_destination: Optional[str] = Field(None, max_length=100, description="Destination of the trip")
    trip_base_price: Optional[float] = Field(None, ge=0, description="Price of the trip")
    trip_base_reward : Optional[float] = Field(None, ge=0, description="Base reward of the trip")

class PutTripItemRequet(BaseModel):
    trip_item_id: Optional[UUID4] = Field(..., description="Trip item ID")
    trip_item_name: str = Field(..., min_length=1, max_length=100, description="Name of the trip item")
    trip_item_description: Optional[str] = Field(None, max_length=500, description="Description of the trip item")
    trip_item_category: TripItemCategoryEnum = Field(..., description="Category of the trip item")
    trip_item_address: Optional[str] = Field(None, max_length=200, description="Address of the trip item")
    trip_item_traveler_reward: Optional[int] = Field(None, description="Traveler reward for the trip item")
    trip_item_type: TripItemTypeEnum = Field(..., description="Type of the trip item")
    trip_item_price: Optional[float] = Field(None, ge=0, description="Price of the trip item")

class PutTripItemsRequest(BaseModel):
    trip_items: List[PatchTripItemRequest] = Field(..., min_items=1, description="List of trip items")
    trip_id: UUID4 = Field(..., description="Trip ID")
