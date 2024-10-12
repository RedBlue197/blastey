from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Any, Optional, TypeVar
from schemas.response_schema import APIResponse, PaginationMetadata

T = TypeVar('T')

def api_response(
    success: bool = True,
    message: str = "Request was successful",
    data: Optional[T] = None,
    total_count: Optional[int] = None,
    current_page: Optional[int] = None,
    total_pages: Optional[int] = None,
    items_per_page: Optional[int] = None,
    cacheable: Optional[bool] = None,
    status_code: int = 200,  # Default for success, adjust if error
) -> JSONResponse:
    pagination = None
    # If all pagination parameters are present, create the pagination object
    if all(v is not None for v in [total_count, current_page, total_pages, items_per_page]):
        pagination = PaginationMetadata(
            total_count=total_count,
            current_page=current_page,
            total_pages=total_pages,
            items_per_page=items_per_page
        )

    # Construct the response object based on success or error
    response = APIResponse[T](
        success=success,
        message=message,
        data=data,
        pagination=pagination,
        cacheable=cacheable,
        status_code=status_code
    )

    # Log the response content if it's an error (optional)
    if not success:
        import logging
        logging.info(f"Error Response: {jsonable_encoder(response)}")

    # Ensure everything is JSON-serializable
    json_content = jsonable_encoder(response)

    # Return the JSONResponse with the appropriate status code
    return JSONResponse(status_code=status_code, content=json_content)
