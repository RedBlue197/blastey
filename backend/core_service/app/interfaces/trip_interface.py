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

    
   def create_trip(self, trip: CreateTripRequest, image_files: List[UploadFile]):
        trip_id = uuid.uuid4()  # Generate a UUID for the trip

        # Upload images to GCS and get their public URLs
        uploaded_images = post_trip_images_on_gcs(trip_id=str(trip_id), files=image_files)

        # Create the main Trip object
        new_trip = Trip(
            trip_id=trip_id,
            trip_name=trip.trip_name,
            trip_description=trip.trip_description,
            trip_departure_date=trip.trip_start_date,
            trip_return_date=trip.trip_end_date,
            trip_origin=trip.trip_origin,
            trip_destination=trip.trip_destination,
            trip_total_availability=trip.trip_total_availability,
            trip_total_booking=trip.trip_total_booking,
            host_id=trip.host_id,
        )

        try:
            # Start a transaction
            self.db.add(new_trip)

            # Loop through each trip item and validate
            for trip_item in trip.activity_items:
                new_trip_item = TripItem(
                    trip_item_id=uuid.uuid4(),
                    trip_id=trip_id,
                    trip_item_date=trip_item.trip_item_date,
                    trip_item_name=trip_item.trip_item_name,
                    trip_item_description=trip_item.trip_item_description,
                    trip_item_category=trip_item.trip_item_category,
                    trip_item_address=trip_item.trip_item_address,
                    trip_item_traveler_reward=trip_item.trip_item_traveler_reward,
                    trip_item_type=trip_item.trip_item_type,
                    trip_item_price=trip_item.trip_item_price
                )
                if not self.is_valid_trip_item(new_trip_item):
                    raise ValueError(f"Invalid trip item: {trip_item.trip_item_name}")
                self.db.add(new_trip_item)

            # Save uploaded images to the database
            for image_info in uploaded_images:
                new_trip_image = TripImages(
                    trip_image_id=image_info['uuid'],  # Use the image UUID generated
                    trip_id=trip_id,
                    trip_image_url=image_info['public_url'],
                    trip_image_is_primary=False  # Set primary logic as needed
                )
                self.db.add(new_trip_image)

            # Commit all changes
            self.db.commit()
            self.db.refresh(new_trip)

            # Return a response with the created trip and images
            return {
                "trip_id": str(new_trip.trip_id),
                "trip_name": new_trip.trip_name,
                "trip_description": new_trip.trip_description,
                "images": [{"uuid": img['uuid'], "url": img['public_url']} for img in uploaded_images]
            }

        except Exception as e:
            # Rollback all changes if any error occurs
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Error occurred: {e}")

    def is_valid_trip_item(self, trip_item: TripItem) -> bool:
        # Add validation logic for a trip item
        if not trip_item.trip_item_name or trip_item.trip_item_price < 0:
            return False
        return True


