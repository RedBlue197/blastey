from pydantic import BaseModel
from models.user_model import UserRole, UserRank
from typing import Optional

class CreateUserRequest(BaseModel):
    user_password: str
    user_first_name : str
    user_last_name : str
    user_email : str
    user_phone_number :str
    user_role : UserRole
    user_rank : UserRank
    user_address : str
    user_city : str
    user_country : str
    user_postal_code : Optional[str]