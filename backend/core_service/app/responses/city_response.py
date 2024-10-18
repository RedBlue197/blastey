from pydantic import BaseModel
import uuid
from typing import Optional
from datetime import datetime

class GetCityResponse(BaseModel):
    city_id: uuid.UUID
    city_name: str
    city_description: Optional[str] = None
    city_image: Optional[str] = None
    city_latitude: Optional[float] = None
    city_longitude: Optional[float] = None

    class Config:
        orm_mode = True
        from_attributes = True  # This is the key setting

class GetCitiesResponse(BaseModel):
    cities: list[GetCityResponse]

    class Config:
        orm_mode = True
        from_attributes = True  # This is the key setting   

