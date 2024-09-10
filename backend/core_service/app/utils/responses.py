from fastapi.responses import JSONResponse
from typing import Any, Optional, TypeVar
from schemas.response_schema import APIResponse, PaginationMetadata

T = TypeVar('T')

def success_response(
    data: Optional[T] = None,
    message: str = "Request was successful",
    total_count: Optional[int] = None,
    current_page: Optional[int] = None,
    total_pages: Optional[int] = None,
    items_per_page: Optional[int] = None,
    cacheable: Optional[bool] = None  # New parameter for caching
) -> JSONResponse:
    pagination = None
    if all(v is not None for v in [total_count, current_page, total_pages, items_per_page]):
        pagination = PaginationMetadata(
            total_count=total_count,
            current_page=current_page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )
    
    response = APIResponse[T](
        success=True,
        message=message,
        data=data,
        pagination=pagination,
        cacheable=cacheable  # Include cacheable in the response
    )
    return JSONResponse(status_code=200, content=response.dict())

def error_response(
    message: str,
    error_code: int = 400,
    data: Any = None,
    cacheable: Optional[bool] = None  # Include cacheable parameter if needed
) -> JSONResponse:
    response = APIResponse(
        success=False,
        message=message,
        error_code=error_code,
        data=data,
        cacheable=cacheable  # Include cacheable in the response if needed
    )
    return JSONResponse(status_code=error_code, content=response.dict())
