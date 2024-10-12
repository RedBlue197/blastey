# app/interfaces/order.py

from fastapi import UploadFile, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from interfaces.base_interface import BaseInterface

import uuid

from typing import List,Optional

from models.trip_model import Trip, TripItem, TripImages

from schemas.trip_schema import CreateTripRequest
from schemas.trip_schema import PatchTripRequest, PatchTripItemRequest

from services.image_service import post_trip_images_on_gcs


class TripInterface(BaseInterface[Trip]):
    def __init__(self, db: Session):
        super().__init__(db, Trip, 'trip_id')

    # Add more specific queries for Trip model
    def get_trips_with_pagination(self, offset: int, limit: int):
        total_count_query = (
            self.db.query(func.count(Trip.trip_id))
            .filter(
                Trip.is_deleted == False,
                Trip.status == True
            )
            .scalar_subquery()  # Executes count as part of the same query
        )
        
        # Main query to get paginated Trips and total count
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
        
        # Since total count is part of each row, extract it from the first result
        if trips_query:
            total_count = trips_query[0].total_count
            trips = [trip for trip, _ in trips_query]
        else:
            total_count = 0
            trips = []

        return {"trips": trips}, total_count

    
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
            trip_name=trip.trip_title,
            trip_description=trip.trip_description,
            trip_departure_date=trip.trip_departure_date,
            trip_return_date=trip.trip_return_date,
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
                "trip_name": new_trip.trip_title,
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


    def patch_trip(self, trip_id: uuid.UUID, trip_update: PatchTripRequest, image_files: Optional[list[UploadFile]] = None):
        try:
            # Fetch the existing trip
            trip_obj = self.db.query(Trip).filter(Trip.id == trip_id).first()

            if not trip_obj:
                return None

            # Apply the partial update for trip fields
            update_data = trip_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                if field != "activity_items":  # Skip trip items for now
                    setattr(trip_obj, field, value)

            # Handle trip items if they are provided in the update request
            if trip_update.activity_items:
                self.update_trip_items(trip_obj, trip_update.activity_items)

            # Handle image files if any
            if image_files:
                self.update_trip_images(trip_obj, image_files)

            # Commit the changes to the database
            self.db.commit()
            self.db.refresh(trip_obj)

            return trip_obj

        except Exception as e:
            # If any error occurs, roll back the transaction
            self.db.rollback()
            raise Exception(f"Error updating trip: {str(e)}")

    def update_trip_items(self, trip_obj, updated_items: list[PatchTripItemRequest]):
        # Fetch existing trip items
        existing_items = {item.id: item for item in trip_obj.items}

        for item_data in updated_items:
            item_dict = item_data.dict(exclude_unset=True)
            
            # Check if the item already exists (by some unique identifier like ID)
            if "id" in item_dict and item_dict["id"] in existing_items:
                # Update the existing trip item
                existing_item = existing_items[item_dict["id"]]
                for field, value in item_dict.items():
                    setattr(existing_item, field, value)
            else:
                # If item does not exist, create a new trip item and add to the trip
                new_item = TripItem(**item_dict)
                trip_obj.items.append(new_item)

    def update_trip_images(self, trip_obj, image_files: list[UploadFile]):
        # Logic for handling image updates (if required)
        pass