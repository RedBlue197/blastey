# app/interfaces/order.py

from sqlalchemy.orm import Session
from backend.core_service.app.models.trip_model import Trip
from interfaces.base_interface import BaseInterface
import uuid

class TripInterface(BaseInterface[Trip]):
    def __init__(self, db: Session):
        super().__init__(db, Trip, 'trip_id')

    # Add more specific queries for Trip model
    def get_trips_with_pagination(self, offset: int, limit: int):
        total_count_query = (
            self.db.query(func.count(Trip.trip_id))
            .filter(
                Trip.is_deleted == False,
                Trip.is_blocked == False,
                Trip.is_active == True
            )
            .scalar_subquery()  # Executes count as part of the same query
        )
        
        # Main query to get paginated Trips and total count
        trips_query = (
            self.db.query(Trip, total_count_query.label('total_count'))
            .filter(
                Trip.is_deleted == False,
                Trip.is_blocked == False,
                Trip.is_active == True
            )
            .offset(offset)
            .limit(limit)
            .all()
        )
        
        # Since total count is part of each row, extract it from the first result
        if trips_query:
            total_count = Trips_query[0].total_count
            Trips = [trip for trip, _ in trips_query]
        else:
            total_count = 0
            Trips = []

        return Trips, total_count
    
    def get_trip_by_id(self, trip_id: uuid.UUID):
        return self.db.query(Trip).filter(
            Trip.is_deleted == False,
            Trip.trip_id == trip_id
            ).first()

