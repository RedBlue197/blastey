from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, StreamingResponse
from utils.cache import redis_client, get_cache_key
from fastapi.responses import JSONResponse
import json
import logging
from io import BytesIO

logger = logging.getLogger(__name__)

class CachingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Extract 'service' and 'path' if present, default to None if missing
        service = request.path_params.get('service', None)
        path = request.path_params.get('path', None)

        # Build the cache key based on 'service' and 'path'
        cache_key = get_cache_key(service=service, path=path, query_params=dict(request.query_params))

        try:
            # Check if cached response exists
            cached_response = redis_client.get(cache_key)
            if cached_response:
                logger.info(f"Cache hit for key: {cache_key}")
                # Return cached response with cache hit header
                return JSONResponse(
                    content=json.loads(cached_response),
                    status_code=200,
                    headers={"X-Cache-Hit": "true"}
                )

            # Forward request to the actual handler
            response = await call_next(request)

            # Handle the response based on its type
            if isinstance(response, StreamingResponse):
                # For StreamingResponse, we cannot directly access the body
                # Handle it without caching
                logger.info(f"Cache miss for key: {cache_key}")
                return response

            # Read and cache the response if it's JSON
            response_data = b""
            async for chunk in response.body_iterator:
                response_data += chunk

            try:
                response_json = json.loads(response_data.decode())
                # Cache the response if it is cacheable
                if response_json.get('cacheable', False):
                    redis_client.set(cache_key, response_data, ex=3600)  # Cache for 1 hour
            except json.JSONDecodeError:
                # If JSON decoding fails, do not cache
                pass

            logger.info(f"Cache miss for key: {cache_key}")
            # Return the response with cache miss header
            return Response(
                content=response_data,
                status_code=response.status_code,
                headers=dict(response.headers, **{"X-Cache-Hit": "false"})
            )
        
        except Exception as e:
            # Log the error and proceed without caching
            logger.error(f"Error in CachingMiddleware: {e}")
            # Forward the request and return the response without caching
            response = await call_next(request)
            response_data = b""
            async for chunk in response.body_iterator:
                response_data += chunk
            return Response(
                content=response_data,
                status_code=response.status_code,
                headers=dict(response.headers, **{"X-Cache-Hit": "error"})
            )


from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import logging

class ConditionalCachingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, redis_client):
        super().__init__(app)
        self.redis_client = redis_client

    async def dispatch(self, request: Request, call_next):
        # Check if Redis is connected
        try:
            # Example check for Redis connectivity
            await self.redis_client.ping()
            redis_connected = True
        except Exception:
            redis_connected = False
            logging.warning("Redis is not connected. Caching will be skipped.")

        # Add a flag to the request state to determine if caching should be enabled
        request.state.redis_connected = redis_connected

        response = await call_next(request)

        # If Redis is not connected, do not cache the response
        if not redis_connected:
            response.headers["Cache-Control"] = "no-cache"

        return response
