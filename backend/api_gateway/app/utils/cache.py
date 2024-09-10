# utils/cache.py

import redis
from typing import Optional

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def get_cache_key(service: str, path: str, query_params: Optional[dict] = None) -> str:
    # Create a cache key based on service, path, and query params
    query_str = '&'.join(f"{k}={v}" for k, v in (query_params or {}).items())
    return f"{service}/{path}?{query_str}" if query_str else f"{service}/{path}"
