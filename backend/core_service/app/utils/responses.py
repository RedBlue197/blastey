from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Any, Optional, TypeVar
from schemas.response_schema import APIResponse, PaginationMetadata

T = TypeVar('T')

from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
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
    cacheable: Optional[bool] = None,  # New parameter for caching
    status: int = 200  # Set default to 200
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
        cacheable=cacheable,  # Include cacheable in the response
    )

    # Include status in the response
    response_with_status = {
        "success": response.success,
        "message": response.message,
        "data": response.data,
        "pagination": response.pagination,
        "error_code": response.error_code,
        "cacheable": response.cacheable,
        "status": status  # Add the status here
    }
    
    # Ensure everything is JSON-serializable, including UUIDs
    json_content = jsonable_encoder(response_with_status)
    
    return JSONResponse(status_code=status, content=json_content)

import logging

def error_response(
    message: str,
    error_code: int = 400,
    data: Any = None,
    cacheable: Optional[bool] = None
) -> JSONResponse:
    response = APIResponse(
        success=False,
        message=message,
        error_code=error_code,
        data=data,
        cacheable=cacheable
    )
    
    json_content = jsonable_encoder(response)
    
    # Log the content for debugging
    logging.info(f"Error Response: {json_content}")
    
    return JSONResponse(status_code=error_code, content=json_content)