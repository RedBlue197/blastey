# app/interfaces/order.py

from fastapi import UploadFile, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from interfaces.base_interface import BaseInterface

import uuid

from typing import List,Optional

from models.trip_model import Trip, TripItem, TripImages, TripOpening
from models.user_model import User

from schemas.trip_schema import CreateTripRequest
from schemas.trip_schema import PatchTripRequest, PatchTripItemRequest

from services.image_service import post_trip_images_on_gcs


class TripInterface(BaseInterface[Trip]):
    def __init__(self, db: Session):
        super().__init__(db, Trip, 'trip_id')

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

        if trips_query:
            total_count = trips_query[0][1]  # Get total_count from the first result
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
    
    def get_trips_by_user_id_with_pagination(self, user_id: uuid.UUID, offset: int, limit: int):
        total_count_query = (
            self.db.query(func.count(Trip.trip_id))
            .filter(
                Trip.is_deleted == False,
                Trip.host_id == user_id
            )
            .scalar_subquery()
        )

        trips_query = (
            self.db.query(Trip, total_count_query.label('total_count'))
            .filter(
                Trip.is_deleted == False,
                Trip.host_id == user_id
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
            ).scalar()
            
            trip.trip_lowest_trip_opening_price = lowest_price if lowest_price is not None else 0

        if trips_query:
            total_count = trips_query[0][1]
            trips = [trip for trip, _ in trips_query]
        else:
            total_count = 0
            trips = []
        
        return {"trips": trips}, total_count

    #---------------------------------Create Functions----------------------------------------
    def create_trip(self, trip: CreateTripRequest):
        trip_id = uuid.uuid4()  # Generate a UUID for the trip

        # Upload images to GCS and get their public URLs
        uploaded_images = post_trip_images_on_gcs(trip_id=str(trip_id), files=image_files)

        # Create the main Trip object
        new_trip = Trip(
            trip_id=trip_id,
            trip_name=trip.trip_title,
            trip_description=trip.trip_description,
            trip_origin=trip.trip_origin,
            trip_destination=trip.trip_destination,
            trip_link_url=trip.trip_link_url,
            trip_upvote=trip.trip_upvote,
            trip_downvote=trip.trip_downvote,
            trip_base_price=trip.trip_base_price,
            trip_base_reward=trip.trip_base_reward,
            trip_creation_status=trip.trip_creation_status,

            host_id=trip.host_id,
        )

        try:
            # Start a transaction
            self.db.add(new_trip)

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

    def create_trip_items(self, trip_items_request: CreateTripItemsRequest):
        # Ensure the trip exists
        trip = self.db.query(Trip).filter(
            Trip.trip_id == trip_items_request.trip_id,
            Trip.is_deleted == False
        ).first()
        
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        # Create the trip items
        new_trip_items = []
        for item_request in trip_items_request.trip_items:
            trip_item = TripItem(
                trip_item_id=uuid.uuid4(),
                trip_id=trip_items_request.trip_id,
                trip_item_name=item_request.trip_item_name,
                trip_item_description=item_request.trip_item_description,
                trip_item_category=item_request.trip_item_category,
                trip_item_traveler_reward=item_request.trip_item_traveler_reward,
                trip_item_type=item_request.trip_item_type,
                trip_item_price=item_request.trip_item_price,
                trip_item_status=item_request.trip_item_status,
            )
            
            # Validate the item (optional)
            if not self.is_valid_trip_item(trip_item):
                raise HTTPException(status_code=400, detail="Invalid trip item details")

            self.db.add(trip_item)
            new_trip_items.append(trip_item)

        # Commit the transaction to save the new trip items
        try:
            self.db.commit()
            return new_trip_items
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create trip items: {str(e)}")

    def create_trip_openings(self, trip_openings_request: CreateTripOpeningsRequest):
        # Ensure the trip exists
        trip = self.db.query(Trip).filter(
            Trip.trip_id == trip_openings_request.trip_id,
            Trip.is_deleted == False
        ).first()
        
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        # Create the trip opening
        new_trip_opening = TripOpening(
            trip_opening_id=uuid.uuid4(),
            trip_id=trip_openings_request.trip_id,
            trip_opening_start_date=trip_openings_request.trip_opening_start_date,
            trip_opening_end_date=trip_openings_request.trip_opening_end_date,
            trip_opening_total_reward=trip_openings_request.trip_opening_total_reward,
            is_limited_availability=trip_openings_request.is_limited_availability,
            trip_opening_total_availability=trip_openings_request.trip_opening_total_availability,
            trip_opening_total_booking=trip_openings_request.trip_opening_total_booking,
            trip_opening_price=trip_openings_request.trip_opening_price
        )

        # Validate the trip opening (optional)
        if not self.is_valid_trip_opening(new_trip_opening):
            raise HTTPException(status_code=400, detail="Invalid trip opening details")

        self.db.add(new_trip_opening)
        
        # Create the associated trip opening items (if any)
        new_trip_opening_items = []
        if trip_openings_request.trip_opening_items:
            for item_request in trip_openings_request.trip_opening_items:
                trip_opening_item = TripOpeningItem(
                    trip_opening_item_id=uuid.uuid4(),
                    trip_opening_id=new_trip_opening.trip_opening_id,
                    trip_item_id=item_request.trip_item_id,
                    trip_opening_item_name=item_request.trip_opening_item_name,
                    trip_opening_item_description=item_request.trip_opening_item_description,
                    trip_opening_item_category=item_request.trip_opening_item_category,
                    trip_opening_item_address=item_request.trip_opening_item_address,
                    trip_opening_item_traveler_reward=item_request.trip_opening_item_traveler_reward,
                    is_limited_availability=item_request.is_limited_availability,
                    trip_opening_item_total_availability=item_request.trip_opening_item_total_availability,
                    trip_opening_item_total_booking=item_request.trip_opening_item_total_booking,
                    trip_opening_item_price=item_request.trip_opening_item_price
                )
                
                # Validate the trip opening item (optional)
                if not self.is_valid_trip_opening_item(trip_opening_item):
                    raise HTTPException(status_code=400, detail="Invalid trip opening item details")

                self.db.add(trip_opening_item)
                new_trip_opening_items.append(trip_opening_item)

        # Commit the transaction
        try:
            self.db.commit()
            return {"trip_opening": new_trip_opening, "trip_opening_items": new_trip_opening_items}
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create trip opening: {str(e)}")

    def is_valid_trip_opening(self, trip_opening: TripOpening):
        # Add validation logic for trip opening here (e.g., date range checks, etc.)
        return True

    def is_valid_trip_opening_item(self, trip_opening_item: TripOpeningItem):
        # Add validation logic for trip opening items here (e.g., availability checks, etc.)
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
                if field != "trip_items":  # Skip trip items for now
                    setattr(trip_obj, field, value)

            # Handle trip items if they are provided in the update request
            if trip_update.trip_items:
                self.update_trip_items(trip_obj, trip_update.trip_items)

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
        existing_items = {item.trip_item_id: item for item in trip_obj.items}

        for item_data in updated_items:
            item_dict = item_data.dict(exclude_unset=True)
            
            # Check if the item already exists (by some unique identifier like ID)
            if "trip_item_id" in item_dict and item_dict["trip_item_id"] in existing_items:
                # Update the existing trip item
                existing_item = existing_items[item_dict["trip_item_id"]]
                for field, value in item_dict.items():
                    setattr(existing_item, field, value)
            else:
                # If item does not exist, create a new trip item and add to the trip
                new_item = TripItem(**item_dict)
                trip_obj.items.append(new_item)

    def update_trip_images(self, trip_obj, image_files: list[UploadFile]):
        # Logic for handling image updates (if required)
        pass