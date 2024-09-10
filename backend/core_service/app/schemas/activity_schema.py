from pydantic import BaseModel
import uuid
from models.activity_model import  ItemCategoryEnum
from typing import Optional

class CreateActivityItemRequest(BaseModel):
    activity_item_name: str
    activity_item_traveler_reward: float

class CreateActivityRequest(BaseModel):
    activity_items : list[CreateActivityItemRequest]
    activity_title : str
    activity_description : str
    user_id : uuid.UUID
