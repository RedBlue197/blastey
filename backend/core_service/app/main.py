from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi.util import get_remote_address
from slowapi import Limiter

from routers.frontoffice.v1 import activity_router as activity_router
from utils.responses import success_response

from middleware.logging_middleware import LoggingMiddleware
from middleware.decryption_middleware import DecryptionMiddleware

#dependencies
from dependencies.db_dependency import bcrypt_context

from database import engine, SessionLocal

from config import get_settings

settings = get_settings()

import psycopg2

try:
    conn = psycopg2.connect("dbname={settings.DATABASE_NAME} user={settings.DATABASE_USER} password={settings.DATABASE_PASSWORD} host={settings.DATABASE_HOST}")
    print("Connected to the database")
except Exception as e:
    print(f"Error: {e}")


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
import models.booking_model as booking_model
import models.payment_model as payment_model
import models.rating_model as rating_model
import models.user_model as user_model
import models.activity_model as activity_model
import models.newsletter_model as newsletter_model
import models.trip_model as trip_model


#Creating tables
user_model.Base.metadata.create_all(bind=engine)
conversation_model.Base.metadata.create_all(bind=engine)
message_model.Base.metadata.create_all(bind=engine)
booking_model.Base.metadata.create_all(bind=engine)
payment_model.Base.metadata.create_all(bind=engine)
rating_model.Base.metadata.create_all(bind=engine)
address_model.Base.metadata.create_all(bind=engine)
activity_model.Base.metadata.create_all(bind=engine)
newsletter_model.Base.metadata.create_all(bind=engine)
trip_model.Base.metadata.create_all(bind=engine)

app.add_middleware(LoggingMiddleware)
#app.add_middleware(DecryptionMiddleware)

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

# Flags to enable/disable routers
include_backoffice_routers = True

# Include routers
if include_backoffice_routers:
    from routers.frontoffice.v1 import (
        user_router as frontoffice_user_router,
        address_router as frontoffice_address_router,
        activity_router as activity_router,
        trip_router as trip_router,
        auth_router as auth_router
    )
if include_backoffice_routers:
    app.include_router(frontoffice_user_router.router)
    app.include_router(frontoffice_address_router.router)
    app.include_router(activity_router.router)
    app.include_router(trip_router.router)
    app.include_router(auth_router.router)
    

@app.on_event("startup")
async def startup():
    print("Starting up")

    try:
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
            user_hashed_password=bcrypt_context.hash("3ss5fe71"),
            user_email="hamzagoubraim@gmail.com"
            )
        
        db.add(user)
        db.commit()
        db.refresh(user)

        #create a host user
        host = user_model.User(
            user_first_name="hamza",
            user_last_name="test",
            user_hashed_password=bcrypt_context.hash("3ss5fe71"),
            user_email="hamzahost@gmail.com",
            user_role=user_model.UserRole.HOST
            )
        db.add(host)
        db.commit()
        db.refresh(host)

        #create a test trip
        trip = trip_model.Trip(
            trip_title="test trip",
            trip_description="test trip description",
            trip_origin="test origin",
            trip_destination="test destination",
            host_id=host.user_id
        )
        db.add(trip)
        db.commit()
        db.refresh(trip)

        #create a test trip item
        trip_item = trip_model.TripItem(
            trip_item_name="test trip item",
            trip_item_description="test trip item description",
            trip_item_category=trip_model.TripItemCategoryEnum.ELECTRONICS,
            trip_item_address="test address",
            trip_item_traveler_reward=20.0,
            trip_item_price=100.0,
            trip_item_image_url="test image url",
            trip_id=trip.trip_id
        )
        db.add(trip_item)
        db.commit()
        db.refresh(trip_item)

        db.close()
    except Exception as e:
        print(f"Error: {e}")

@app.get("/")
async def read_root():
    return success_response({
        "message": "Welcome to Blastey Core API"
    })