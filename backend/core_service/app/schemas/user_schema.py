from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    user_password: str
    user_first_name : str
    user_last_name : str
    user_email : str
    user_phone_number :str