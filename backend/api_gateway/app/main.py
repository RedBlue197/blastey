from fastapi import FastAPI, Request, HTTPException
from utils.request_forwarder import forward_request
from fastapi.middleware.cors import CORSMiddleware
import httpx
from middlewares import auth_middleware, logging_middleware
from config import settings
from slowapi.util import get_remote_address
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)



app = FastAPI(
    title="Blastey API Gateway",
    description="This is Blastey project, with auto docs for the API and everything",
    version="1.0.0",
)

excluded_paths = [
    "/docs",
    "/openapi.json",
    "/redoc",
    '/core/frontoffice/v1/activities/',
    ]

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for logging
app.add_middleware(logging_middleware.LoggingMiddleware)
# Include authentication middleware globally
app.add_middleware(auth_middleware.AuthMiddleware, excluded_paths=excluded_paths)

@app.get("/")
def read_root():
    return {"message": "Welcome to the API Gateway"}


@app.on_event("startup")
async def startup_event():

    app.openapi_schema = await get_merged_openapi()

async def get_merged_openapi() -> dict:
    merged_schema = {
        "openapi": "3.0.0",
        "info": {"title": "API Gateway", "version": "1.0.0"},
        "paths": {},
        "components": {"schemas": {}},
        "tags": []  # To hold tags for different microservices
    }

    service_urls = [
        settings.SERVICES["core"]["url"] + "/openapi.json",
        # settings.SERVICES["auth"]["url"] + "/openapi.json",
        # settings.SERVICES["orders"]["url"] + "/openapi.json",
    ]

    service_tags = {
        "Core Microservice": "Core Service Endpoints",
    }

    for service_name, url in zip(service_tags.keys(), service_urls):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status()
                service_schema = response.json()

                # Add a tag for this microservice
                if "tags" not in merged_schema:
                    merged_schema["tags"] = []
                merged_schema["tags"].append({
                    "name": service_name,
                    "description": service_tags[service_name]
                })

                if "paths" in service_schema:
                    # Add service name as prefix in tags
                    for path, path_item in service_schema["paths"].items():
                        for operation in path_item:
                            operation_item = path_item[operation]
                            if "tags" not in operation_item:
                                operation_item["tags"] = []
                            operation_item["tags"].append(service_name)
                        merged_schema["paths"][path] = path_item
                        

                if "components" in service_schema:
                    if "schemas" not in merged_schema["components"]:
                        merged_schema["components"]["schemas"] = {}
                    for schema_name, schema in service_schema["components"].get("schemas", {}).items():
                        merged_schema["components"]["schemas"][schema_name] = schema

        except httpx.RequestError as e:
            print(f"Request error while fetching schema from {url}: {e}")
        except httpx.HTTPStatusError as e:
            print(f"HTTP error while fetching schema from {url}: {e}")
        except Exception as e:
            print(f"Unexpected error while fetching schema from {url}: {e}")

    # Debugging
    return merged_schema

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
@limiter.limit("5/minute")
async def proxy_request(service: str, path: str, request: Request):
    try:
        method = request.method
        headers = dict(request.headers)
        data = await request.json() if method in ["POST", "PUT"] else None
        path = f"/{service}/{path}"
        # Forward request using the forward_request function
        response_data = forward_request(
            service=service,
            path=path,
            method=method,
            data=data,
            headers=headers
        )

        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))