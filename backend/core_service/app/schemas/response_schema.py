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
    message: str
    data: Optional[T] = None
    pagination: Optional[PaginationMetadata] = None
    error_code: Optional[int] = None
    cacheable: Optional[bool] = None  # New field for caching

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Request was successful",
                "data": {"key": "value"},
                "error_code": None,
                "pagination": {
                    "total_count": 100,
                    "current_page": 1,
                    "total_pages": 10,
                    "items_per_page": 10
                },
                "cacheable": True  # Example value for cacheable
            }
        }
