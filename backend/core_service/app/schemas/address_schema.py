from pydantic import BaseModel, Field, UUID4, constr, Optional

class CreateAddressRequest(BaseModel):
    address_name: str = Field(..., min_length=1, max_length=200, description="Name of the address")
    address_city: str = Field(..., min_length=1, max_length=100, description="City of the address")
    address_country: str = Field(..., min_length=2, max_length=100, description="Country of the address")
    user_id: UUID4 = Field(..., description="User ID in UUID format")
    address_postal_code: Optional[str] = Field(None, regex=r'^\d{5,10}$', description="Postal code of the address, optional")
    address_latitude: Optional[str] = Field(None, regex=r"^\-?\d{1,2}\.\d+$", description="Latitude of the address, optional")
    address_longitude: Optional[str] = Field(None, regex=r"^\-?\d{1,3}\.\d+$", description="Longitude of the address, optional")
