from pydantic import BaseModel
from typing import Generic, TypeVar, Optional
from pydantic.generics import GenericModel

# Type variable to allow dynamic data types
T = TypeVar('T')

class PaginationMetadata(BaseModel):
    total_count: int
    current_page: int
    total_pages: int
    items_per_page: int

class APIResponse(GenericModel, Generic[T]):
    success: bool
    message: str  # You can customize the message as needed
    data: Optional[T] = None
    pagination: Optional[PaginationMetadata] = None
    status_code: Optional[int] = None  # Changed from error_code to status_code
    cacheable: Optional[bool] = None  # New field for caching

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Request was successful",
                "data": {"key": "value"},
                "pagination": {
                    "total_count": 100,
                    "current_page": 1,
                    "total_pages": 10,
                    "items_per_page": 10
                },
                "status_code": 200,  # Example of the new status_code field
                "cacheable": True  # Example value for cacheable
            }
        }
