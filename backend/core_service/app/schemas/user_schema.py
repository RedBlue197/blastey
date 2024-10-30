from pydantic import BaseModel, Field,EmailStr
from models.user_model import UserRole, UserRank
from typing import Optional

#----------------------------------------------------------CREATE SCHEMAS-----------------------------------------------------------------------------

class CreateUserRequest(BaseModel):
    user_password: str = Field(..., min_length=8, max_length=100, description="Password for the user")
    user_first_name: str = Field(..., min_length=1, max_length=50, description="First name of the user")
    user_last_name: str = Field(..., min_length=1, max_length=50, description="Last name of the user")
    user_email: str = Field(..., pattern=r'^\S+@\S+\.\S+$', description="Email of the user")
    user_phone_number: str = Field(..., pattern=r'^\+?\d{10,15}$', description="Phone number of the user")
    user_role: UserRole = Field(..., description="Role of the user")
    user_rank: UserRank = Field(..., description="Rank of the user")
    user_address: str = Field(..., min_length=1, max_length=200, description="Address of the user")
    user_city: str = Field(..., min_length=1, max_length=100, description="City of the user")
    user_country: str = Field(..., min_length=2, max_length=100, description="Country of the user")
    user_postal_code: Optional[str] = Field(None, pattern=r'^\d{5,10}$', description="Postal code of the user (optional)")

#----------------------------------------------------------UPDATE SCHEMAS-----------------------------------------------------------------------------

class PutUserVerificationRequest(BaseModel):
    user_email: EmailStr = Field(..., pattern=r'^\S+@\S+\.\S+$', description="Email of the user")
    verification_code_value: str = Field(..., min_length=1, max_length=6, description="City of the user")