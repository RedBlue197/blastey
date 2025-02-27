# app/interfaces/order.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from interfaces.base_interface import BaseInterface

import uuid

from models.trip_model import (
    Trip, 
    TripItem, 
    TripOpening,
    TripOpeningItem, 
    TripImage,
    TripCreationStatusEnum,
    TripRating
    )
from models.user_model import User
from models.search_model import SearchLog

from backend.core_service.app.schemas.professional.trip_schema import (
    CreateTripRequest,
    CreateTripItemsRequest,
    CreateTripOpeningsRequest,
    CreateTripSearchRequest,
    PutTripRequest,
    PutTripItemsRequest,
    PutTripOpeningsRequest
    )



class TripInterface(BaseInterface[Trip]):
    
    def __init__(self, db: Session):
        super().__init__(db, Trip, 'trip_id')

#---------------------------------GET Functions----------------------------------------

    def get_trips_with_pagination(self, offset: int, limit: int):
        total_count_query = (
            self.db.query(func.count(Trip.trip_id))
            .filter(
                Trip.is_deleted == False,
                Trip.status == True
            )
            .scalar_subquery()
        )

        trips_query = (
            self.db.query(Trip, total_count_query.label('total_count'))
            .filter(
                Trip.is_deleted == False,
                Trip.status == True
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

        for trip, total_count in trips_query:
            # Get host data
            trip.host = self.db.query(User).filter(
                User.user_id == trip.host_id,
                User.is_deleted == False,
                User.status == True
            ).first()

            # Get lowest trip opening price
            lowest_price = self.db.query(func.min(TripOpening.trip_opening_price)).filter(
                TripOpening.trip_id == trip.trip_id,
                TripOpening.is_deleted == False,
                TripOpening.status == True
            ).scalar()
            trip.trip_lowest_trip_opening_price = lowest_price if lowest_price is not None else 0

            # Get default trip image
            default_image = self.db.query(TripImage).filter(
                TripImage.trip_id == trip.trip_id,
                TripImage.is_deleted == False,
                TripImage.status == True
            ).first()
            trip.trip_image_url=default_image.trip_image_url if default_image else None

        if trips_query:
            total_count = trips_query[0][1]  # Get total_count from the first result
            trips = [trip for trip, _ in trips_query]
        else:
            total_count = 0
            trips = []

        return {"trips": trips}, total_count
  
    def get_trip_by_id(self, trip_id: uuid.UUID):
        # Aliases for each related entity with filters
        filtered_trip_items = (
            self.db.query(TripItem)
            .filter(
                TripItem.trip_id == trip_id,
                TripItem.is_deleted == False,
                TripItem.status == True
            )
            .subquery()
        )

        filtered_trip_openings = (
            self.db.query(TripOpening)
            .filter(
                TripOpening.trip_id == trip_id,
                TripOpening.is_deleted == False,
                TripOpening.status == True
            )
            .subquery()
        )
        filtered_trip_images = (
            self.db.query(TripImage)
            .filter(
                TripImage.trip_id == trip_id,
                TripImage.is_deleted == False,
                TripImage.status == True
            )
            .subquery()
        )

        filtered_trip_ratings = (
            self.db.query(TripRating)
            .filter(
                TripRating.trip_id == trip_id,
                TripRating.is_deleted == False,
                TripRating.status == True
            )
            .subquery()
        )
        
        # Main Trip query with left joins on filtered subqueries
        return (
            self.db.query(Trip)
            .outerjoin(filtered_trip_items, Trip.trip_id == filtered_trip_items.c.trip_id)
            .outerjoin(filtered_trip_openings, Trip.trip_id == filtered_trip_openings.c.trip_id)
            .outerjoin(filtered_trip_images, Trip.trip_id == filtered_trip_images.c.trip_id)
            .outerjoin(filtered_trip_ratings, Trip.trip_id == filtered_trip_ratings.c.trip_id)
            .filter(
                Trip.trip_id == trip_id,
                Trip.is_deleted == False
            )
            .first()
        )

#---------------------------------CREATE Functions----------------------------------------