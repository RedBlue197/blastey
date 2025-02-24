from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi.util import get_remote_address
from slowapi import Limiter

from utils.responses import api_response

from middleware.logging_middleware import LoggingMiddleware
from middleware.decryption_middleware import DecryptionMiddleware

#dependencies
from dependencies.db_dependency import bcrypt_context

from database import engine, SessionLocal

from config import get_settings

from datetime import datetime


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
import models.conversation_model as conversation_model
import models.message_model as message_model
import models.booking_model as booking_model
import models.payment_model as payment_model
import models.rating_model as rating_model
import models.user_model as user_model
import models.activity_model as activity_model
import models.newsletter_model as newsletter_model
import models.trip_model as trip_model
import models.city_model as city_model
import models.search_model as search_model


#Creating tables
user_model.Base.metadata.create_all(bind=engine)
conversation_model.Base.metadata.create_all(bind=engine)
message_model.Base.metadata.create_all(bind=engine)
booking_model.Base.metadata.create_all(bind=engine)
payment_model.Base.metadata.create_all(bind=engine)
rating_model.Base.metadata.create_all(bind=engine)
activity_model.Base.metadata.create_all(bind=engine)
newsletter_model.Base.metadata.create_all(bind=engine)
trip_model.Base.metadata.create_all(bind=engine)
city_model.Base.metadata.create_all(bind=engine)
search_model.Base.metadata.create_all(bind=engine)

app.add_middleware(LoggingMiddleware)
app.add_middleware(DecryptionMiddleware)

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
include_frontoffice_routers = True

# Include routers
if include_frontoffice_routers:
    from routers.frontoffice.v1 import (
        user_router as frontoffice_user_router,
        activity_router as activity_router,
        city_router as city_router,
        newsletter_router as newsletter_router
    )
    from routers.frontoffice.v1.anonymous import (
        auth_router as auth_router,
        trip_router as trip_router
        )
if include_frontoffice_routers:
    app.include_router(frontoffice_user_router.router)
    app.include_router(activity_router.router)
    app.include_router(auth_router.router)
    app.include_router(city_router.router)
    app.include_router(newsletter_router.router)

# Include anonymous routers
app.include_router(auth_router.router)
app.include_router(trip_router.router)
    

@app.on_event("startup")
async def startup():
    print("Starting up")
    
    try:
        # Use context manager to handle session management
        with SessionLocal() as db:
            # Check if the user table is empty
            user = db.query(user_model.User).first()
            if user:
                print("User table is not empty")
            else:
                # Create a test user
                user = user_model.User(
                    user_first_name="hamza",
                    user_last_name="test",
                    user_hashed_password=bcrypt_context.hash("3ss5fe71"),
                    user_email="hamzagoubraim@gmail.com",
                    user_name="hamza",
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            # Check if the trip table is empty
            first_trip = db.query(trip_model.Trip).first()
            if first_trip:
                print("Trip table is not empty")
                return
            
            # Create a test trip
            trip = trip_model.Trip(
                trip_title="test trip",
                trip_description="test trip description",
                trip_origin="test origin",
                trip_destination="test destination",
                host_id=user.user_id
            )
            db.add(trip)
            db.commit()
            db.refresh(trip)

            # Create a test trip item
            trip_item = trip_model.TripItem(
                trip_item_name="test trip item",
                trip_item_description="test trip item description",
                trip_item_category=trip_model.TripItemCategoryEnum.OTHER,  # Changed to valid enum value
                trip_item_address="test address",
                trip_item_traveler_reward=20.0,
                trip_item_price=100.0,
                trip_item_image_url="test image url",
                trip_id=trip.trip_id
            )
            db.add(trip_item)
            db.commit()
            db.refresh(trip_item)

            # Create a trip opening with valid datetime objects
            trip_opening = trip_model.TripOpening(
                trip_id=trip.trip_id,
                trip_opening_start_date=datetime(2022, 1, 1),
                trip_opening_end_date=datetime(2022, 1, 10),
                trip_opening_total_availability=10,
                trip_opening_price=200. # Added price as it's required
            )
            db.add(trip_opening)
            db.commit()
            db.refresh(trip_opening)

        print("Startup completed successfully")
    
    except Exception as e:
        print(f"Error: {e}")


@app.get("/")
async def read_root():
    return api_response({
        "message": "Welcome to Blastey Core API"
    })