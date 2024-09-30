from pydantic import BaseModel
from typing import Optional
import uuid


class GetTokenResponse(BaseModel):
    token: str
    class Config:
        orm_mode = True
        from_attributes = True  # Pydantic v2 support for ORM models