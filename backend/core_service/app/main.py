from fastapi import FastAPI

from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers.frontoffice.v1 import activity_router as frontoffice_demand_router
from utils.responses import success_response

from middleware.logging_middleware import LoggingMiddleware

#dependencies
from dependencies.db_dependency import bcrypt_context

from database import engine, SessionLocal

from config import get_settings

settings = get_settings()


limiter = Limiter(key_func=get_remote_address)

app=FastAPI(
    title="Blastey Core API",
    description="This is Blastey project, with auto docs for the API and everything",
    version="1.0.0",
    dependencies=[],
    responses={404: {"description": "Not found"}},
    prefix="core"
)

from contextvars import ContextVar

current_user_var = ContextVar('current_user', default=None)

# Import models first
import models.address_model as address_model
import models.conversation_model as conversation_model
import models.message_model as message_model
import models.order_model as order_model
import models.payment_model as payment_model
import models.rating_model as rating_model
import models.user_model as user_model


#Creating tables
user_model.Base.metadata.create_all(bind=engine)
conversation_model.Base.metadata.create_all(bind=engine)
message_model.Base.metadata.create_all(bind=engine)
order_model.Base.metadata.create_all(bind=engine)
payment_model.Base.metadata.create_all(bind=engine)
rating_model.Base.metadata.create_all(bind=engine)
address_model.Base.metadata.create_all(bind=engine)



# Flags to enable/disable routers
include_backoffice_routers = True

# Include routers
if include_backoffice_routers:
    from routers.frontoffice.v1 import (
        user_router as frontoffice_user_router,
        address_router as frontoffice_address_router,
        order_router as frontoffice_order_router,
    )
if include_backoffice_routers:
    app.include_router(frontoffice_user_router.router)
    app.include_router(frontoffice_address_router.router)
    app.include_router(frontoffice_demand_router.router)
    app.include_router(frontoffice_order_router.router)
    


app.add_middleware(LoggingMiddleware)

app.mount("/static", StaticFiles(directory="static"), name="static")

origins =[
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    print("Starting up")
    db = SessionLocal()

    # check if the user table is empty
    user = db.query(user_model.User).first()
    if user:
        print("User table is not empty")
        return
    # Create a test user
    user = user_model.User(
        user_first_name="hamza",
        user_last_name="test",
        user_hashed_password=bcrypt_context.hash("test"),
        user_email="test@gmail.com"
        )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

@app.get("/")
async def read_root():
    return success_response({
        "message": "Welcome to Blastey Core API"
    })