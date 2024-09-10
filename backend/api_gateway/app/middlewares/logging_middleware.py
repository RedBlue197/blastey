import time
from fastapi import  Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log request details
        logger.info(f" Request: {request.method} {request.url}")

        # Start timer
        start_time = time.time()

        # Process the request
        response = await call_next(request)

        # Calculate processing time
        process_time = time.time() - start_time

        # Log response details
        logger.info(f" Response Status: {response.status_code} - Processed in {process_time:.2f} seconds")

        return response
