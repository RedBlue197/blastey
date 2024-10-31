from pydantic import BaseModel
from typing import Optional
import uuid

#----------------------------------------------------GET RESPONSES----------------------------------------------------

class GetUserByIdResponse(BaseModel):
    user_id: uuid.UUID
    user_first_name: str
    user_last_name: str
    user_email: str
    user_phone_number: Optional[str]

    class Config:
        orm_mode = True
        from_attributes = True  # Pydantic v2 support for ORM models

class GetUserResponse(BaseModel):
    data: list[GetUserByIdResponse]

    class Config:
        orm_mode = True
        from_attributes = True  # Pydantic v2 support for ORM models

#----------------------------------------------------CREATE RESPONSES----------------------------------------------------

class CreateUserResponse(BaseModel):
    user_id: uuid.UUID

    class Config:
        orm_mode = True
        from_attributes = True  # Pydantic v2 support for ORM models
