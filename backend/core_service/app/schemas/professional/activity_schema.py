from pydantic import BaseModel, Field, UUID4, PositiveFloat
from typing import List

class CreateActivityItemRequest(BaseModel):
    activity_item_name: str = Field(..., min_length=1, max_length=100, description="Name of the activity item")
    activity_item_traveler_reward: PositiveFloat = Field(..., description="Reward for the traveler, must be positive")

class CreateActivityRequest(BaseModel):
    activity_items: List[CreateActivityItemRequest] = Field(..., min_items=1, description="List of activity items")
    activity_title: str = Field(..., min_length=1, max_length=200, description="Title of the activity")
    activity_description: str = Field(..., min_length=1, max_length=1000, description="Description of the activity")
    user_id: UUID4 = Field(..., description="User ID in UUID format")
