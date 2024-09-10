from pydantic import BaseModel
import uuid
from typing import Optional

class CreateAddressRequest(BaseModel):
    address_name: str
    address_city: str
    address_country: str
    user_id: uuid.UUID
    address_postal_code: Optional[str]
    address_latitude : Optional[str]
    address_longitude : Optional[str]


