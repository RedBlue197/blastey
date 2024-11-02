# app/interfaces/order.py

from fastapi import UploadFile, HTTPException

from sqlalchemy.orm import Session,joinedload
from sqlalchemy.sql import func
from sqlalchemy import and_

from interfaces.base_interface import BaseInterface

import uuid

from typing import List,Optional

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

from schemas.trip_schema import (
    CreateTripRequest,
    CreateTripItemsRequest,
    CreateTripOpeningsRequest,
    CreateTripSearchRequest,
    PutTripRequest,
    PutTripItemsRequest,
    PutTripOpeningsRequest
    )

from services.image_service import post_trip_images_on_gcs


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
                TripOpening.status==True
            ).scalar()
            
            trip.trip_lowest_trip_opening_price = lowest_price if lowest_price is not None else 0

        if trips_query:
            total_count = trips_query[0][1]
            trips = [trip for trip, _ in trips_query]
        else:
            total_count = 0
            trips = []
        
        return {"trips": trips}, total_count

    def get_top_trips(self, offset: int, limit: int):
        # Calculate total count of trips
        total_count_query = (
            self.db.query(func.count(Trip.trip_id))
            .filter(
                Trip.is_deleted == False,
                Trip.status == True
            )
            .scalar_subquery()
        )

        # Query for trips ordered by upvote-downvote difference
        trips_query = (
            self.db.query(
                Trip,
                total_count_query.label('total_count'),
                (Trip.upvotes - Trip.downvotes).label('score')  # Calculate score
            )
            .filter(
                Trip.is_deleted == False,
                Trip.status == True
            )
            .order_by(func.desc("score"))  # Order by score in descending order
            .offset(offset)
            .limit(limit)
            .all()
        )

        # Populate additional fields for each trip
        for trip, total_count, _ in trips_query:
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
                TripImage.trip_image_is_primary == True,
                TripImage.is_deleted == False,
                TripImage.status == True
            ).first()
            trip.trip_image_url = default_image.trip_image_url if default_image else None

        # Prepare the response
        if trips_query:
            total_count = trips_query[0][1]  # Get total_count from the first result
            trips = [trip for trip, _, _ in trips_query]
        else:
            total_count = 0
            trips = []

        return {"trips": trips}, total_count

#---------------------------------CREATE Functions----------------------------------------

    def create_trip(self, trip: CreateTripRequest,host_id:uuid.UUID):
        trip_id = uuid.uuid4()  # Generate a UUID for the trip

        # Upload images to GCS and get their public URLs

        # Create the main Trip object
        new_trip = Trip(
            trip_id=trip_id,
            trip_title=trip.trip_title,
            trip_description=trip.trip_description,
            trip_origin=trip.trip_origin,
            trip_destination=trip.trip_destination,
            trip_link_url=trip.trip_link_url,
            trip_base_price=trip.trip_base_price,
            trip_base_reward=trip.trip_base_reward,
            created_by=host_id,
            updated_by=host_id,
        
            host_id=host_id,
        )

        try:
            # Start a transaction
            self.db.add(new_trip)

            # Commit all changes
            self.db.commit()
            self.db.refresh(new_trip)

            # Return a response with the created trip and images
            return new_trip

        except Exception as e:
            # Rollback all changes if any error occurs
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Error occurred: {e}")

    def is_valid_trip_item(self, trip_item: TripItem) -> bool:
        # Add validation logic for a trip item
        if not trip_item.trip_item_name or trip_item.trip_item_price < 0:
            return False
        return True

    def create_trip_items(self, trip_items_request: CreateTripItemsRequest,host_id:uuid.UUID):
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

                created_by=host_id,
                updated_by=host_id
            )
            
            # Validate the item (optional)
            if not self.is_valid_trip_item(trip_item):
                raise HTTPException(status_code=400, detail="Invalid trip item details")

            self.db.add(trip_item)
            trip_item_to_add={
                "trip_id":trip_items_request.trip_id,
                "trip_item_id":trip_item.trip_item_id,
                "trip_item_name":trip_item.trip_item_name,
                "trip_item_description":trip_item.trip_item_description,
                "trip_item_category":trip_item.trip_item_category,
                "trip_item_address":trip_item.trip_item_address,
                "trip_item_traveler_reward":trip_item.trip_item_traveler_reward,
                "trip_item_type":trip_item.trip_item_type,
                "trip_item_price":trip_item.trip_item_price
            }
            new_trip_items.append(trip_item_to_add)
        # Update the step of the trip
        setattr(trip, "trip_creation_status", TripCreationStatusEnum.TRIP_OPENING_CREATION)

        # Commit the transaction to save the new trip items
        try:
            self.db.commit()
            return {"trip_items":new_trip_items}
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create trip items: {str(e)}")

    def create_trip_openings(self, trip_openings_request: CreateTripOpeningsRequest,host_id:uuid.UUID):
        # Ensure the trip exists
        trip = self.db.query(Trip).filter(
            Trip.trip_id == trip_openings_request.trip_id,
            Trip.is_deleted == False
        ).first()
        
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        new_trip_openings = []

        for opening_request in trip_openings_request.trip_openings:
            new_trip_opening = TripOpening(
                trip_opening_id=uuid.uuid4(),
                trip_id=trip_openings_request.trip_id,
                trip_opening_start_date=opening_request.trip_opening_start_date,
                trip_opening_end_date=opening_request.trip_opening_end_date,
                trip_opening_total_reward=opening_request.trip_opening_total_reward,
                is_limited_availability=opening_request.is_limited_availability,
                trip_opening_total_availability=opening_request.trip_opening_total_availability,
                trip_opening_total_booking=opening_request.trip_opening_total_booking,
                trip_opening_price=opening_request.trip_opening_price,

                created_by=host_id,
                updated_by=host_id
            )

            # Validate the trip opening (optional)
            if not self.is_valid_trip_opening(new_trip_opening):
                raise HTTPException(status_code=400, detail="Invalid trip opening details")

            self.db.add(new_trip_opening)
            trip_opening_to_add={
                "trip_id":trip_openings_request.trip_id,
                "trip_opening_id":new_trip_opening.trip_opening_id,
                "trip_opening_start_date":new_trip_opening.trip_opening_start_date,
                "trip_opening_end_date":new_trip_opening.trip_opening_end_date,
                "trip_opening_total_reward":new_trip_opening.trip_opening_total_reward,
                "is_limited_availability":new_trip_opening.is_limited_availability,
                "trip_opening_total_availability":new_trip_opening.trip_opening_total_availability,
                "trip_opening_total_booking":new_trip_opening.trip_opening_total_booking,
                "trip_opening_price":new_trip_opening.trip_opening_price
            }
            new_trip_openings.append(trip_opening_to_add)
        setattr(trip, "trip_creation_status", TripCreationStatusEnum.TRIP_IMAGES_CREATION)
        # Commit the transaction
        try:
            self.db.commit()
            return {"trip_openings": new_trip_openings}
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create trip opening: {str(e)}")

    def is_valid_trip_opening(self, trip_opening: TripOpening):
        # Add validation logic for trip opening here (e.g., date range checks, etc.)
        return True

    def is_valid_trip_opening_item(self, trip_opening_item: TripOpeningItem):
        # Add validation logic for trip opening items here (e.g., availability checks, etc.)
        return True
    
    def create_trip_images(self, trip_id: uuid.UUID,trip_images_data_obj:List[bool] ,image_files: List[UploadFile],host_id:uuid.UUID):
        # Ensure the trip exists
        trip = self.db.query(Trip).filter(
            Trip.trip_id == trip_id,
            Trip.is_deleted == False
        ).first()
        
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        # Upload images to GCS and get their public URLs
        image_urls = post_trip_images_on_gcs(trip_id,image_files)

        # Create the trip images
        new_trip_images = []
        for image_url in image_urls:
            new_trip_image = TripImage(
                trip_image_id=image_url['uuid'],
                trip_id=trip_id,
                trip_image_is_primary=False,
                trip_image_url=image_url['public_url'],
                created_by=host_id,
                updated_by=host_id
            )
            self.db.add(new_trip_image)
            new_trip_images.append(new_trip_image)
        
        setattr(trip, "trip_creation_status", TripCreationStatusEnum.COMPLETED)

        # Commit the transaction
        try:
            self.db.commit()
            return {"trip_images": new_trip_images}
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create trip images: {str(e)}")

    def create_trip_search(self,trip_search_request: CreateTripSearchRequest,offset: int, limit: int):
        #First Log the search
        search_log_filters={
            "search_type":"trip_search",
            "search_parameters":{
                "trip_origin":trip_search_request.trip_origin,
                "trip_destination":trip_search_request.trip_destination,
                "trip_start_date":trip_search_request.trip_start_date,
                "trip_end_date":trip_search_request.trip_end_date
            }
        }
        search=SearchLog(
                search_log_filters=search_log_filters
        )
        self.db.add(search)
        self.db.commit()

        total_count_query = (
            self.db.query(func.count(Trip.trip_id))
            .filter(
                Trip.is_deleted == False,
                Trip.status == True,
                Trip.trip_origin==trip_search_request.trip_origin,
                Trip.trip_destination==trip_search_request.trip_destination,
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
                TripImage.trip_image_is_primary == True,
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
        
#---------------------------------PUT Functions----------------------------------------

    def put_trip(self,user_id: uuid.UUID,trip_update: PutTripRequest):
        try:
            # Fetch the existing trip
            trip_obj = self.db.query(Trip).filter(
                Trip.trip_id == trip_update.trip_id,
                Trip.is_deleted == False,
                ).first()

            if not trip_obj:
                return None

            # Apply the partial update for trip fields
            update_data = trip_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                if field != "trip_items":  # Skip trip items for now
                    setattr(trip_obj, field, value)
            setattr(trip_obj, "updated_by", user_id)

            # Commit the changes to the database
            self.db.commit()
            self.db.refresh(trip_obj)

            return trip_obj

        except Exception as e:
            # If any error occurs, roll back the transaction
            self.db.rollback()
            raise Exception(f"Error updating trip: {str(e)}")

    def put_trip_items(self, trip_items_obj: PutTripItemsRequest):
        try:
            # Fetch the existing trip with associated items
            trip_obj = self.db.query(Trip).filter(
                Trip.trip_id == trip_items_obj.trip_id,
                Trip.is_deleted == False
            ).first()
            
            if not trip_obj:
                raise Exception("Trip not found or has been deleted.")

            # Fetch existing trip items from the trip
            existing_items = {item.trip_item_id: item for item in trip_obj.items}

            # Track IDs that are updated or added
            processed_ids = set()

            # Loop through each item in the provided trip items list
            for item_data in trip_items_obj.trip_items:
                item_dict = item_data.dict(exclude_unset=True)
                trip_item_id = item_dict.get("trip_item_id")

                if trip_item_id and trip_item_id in existing_items:
                    # Update the existing item if it exists in the database
                    existing_item = existing_items[trip_item_id]
                    for field, value in item_dict.items():
                        setattr(existing_item, field, value)
                    processed_ids.add(trip_item_id)  # Mark this ID as processed
                else:
                    # If no matching item found, create a new trip item
                    new_item = TripItem(**item_dict)
                    trip_obj.items.append(new_item)

            # Mark any items that were not processed as deleted
            for trip_item_id, existing_item in existing_items.items():
                if trip_item_id not in processed_ids:
                    existing_item.is_deleted = True

            # Commit the transaction to apply all changes to the database
            self.db.commit()
            
            # Refresh the trip object to reflect all updates, including the new items
            self.db.refresh(trip_obj)
            
            # Return the updated list of trip items, including newly generated IDs
            return trip_obj.items

        except Exception as e:
            # Roll back the transaction if any error occurs
            self.db.rollback()
            raise Exception(f"Error updating trip items: {str(e)}")

    def put_trip_openings(self, trip_openings_obj: PutTripOpeningsRequest):
        try:
            # Fetch the existing trip with associated openings
            trip_obj = self.db.query(Trip).filter(
                Trip.trip_id == trip_openings_obj.trip_id,
                Trip.is_deleted == False
            ).first()
            
            if not trip_obj:
                raise Exception("Trip not found or has been deleted.")

            # Fetch existing trip openings as a dictionary by trip_opening_id
            existing_openings = {opening.trip_opening_id: opening for opening in trip_obj.openings}

            # Track IDs that are updated or added
            processed_ids = set()

            # Loop through each opening in the provided trip openings list
            for opening_data in trip_openings_obj.trip_openings:
                opening_dict = opening_data.dict(exclude_unset=True)
                trip_opening_id = opening_dict.get("trip_opening_id")

                if trip_opening_id and trip_opening_id in existing_openings:
                    # Update the existing opening if it exists in the database
                    existing_opening = existing_openings[trip_opening_id]
                    for field, value in opening_dict.items():
                        setattr(existing_opening, field, value)
                    processed_ids.add(trip_opening_id)  # Mark this ID as processed
                else:
                    # If no matching opening found, create a new trip opening
                    new_opening = TripOpening(**opening_dict)
                    trip_obj.openings.append(new_opening)

            # Mark any openings that were not processed as deleted
            for trip_opening_id, existing_opening in existing_openings.items():
                if trip_opening_id not in processed_ids:
                    existing_opening.is_deleted = True

            # Commit the transaction to apply all changes to the database
            self.db.commit()
            
            # Refresh the trip object to reflect all updates, including the new openings
            self.db.refresh(trip_obj)
            
            # Return the updated list of trip openings, including newly generated IDs
            return trip_obj.openings

        except Exception as e:
            # Roll back the transaction if any error occurs
            self.db.rollback()
            raise Exception(f"Error updating trip openings: {str(e)}")

    def update_trip_images(self, trip_obj, image_files: list[UploadFile]):
        # Logic for handling image updates (if required)
        pass