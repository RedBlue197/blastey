from sqlalchemy import Column, String, Text, Numeric, ForeignKey, Enum, Float, Boolean,DateTime,Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum

class TripCreationStatusEnum(PyEnum):
    DRAFT = "draft"
    ON_GOING_TRIP_ITEM_CREATION = "trip_item_creation"
    ON_GOING_TRIP_OPENING_CREATION = "trip_opening_creation"
    ON_GOING_TRIP_IMAGES_CREATION = "trip_images_creation"
    COMPLETED="completed"


class TripItemCategoryEnum(PyEnum):
    ACTIVITY="activity"
    FOOD="food"
    TRANSPORTATION="transportation"
    STAY="stay"
    OTHER="other"


class  TripItemTypeEnum(PyEnum):
    INCLUDED="included"
    OPTIONAL="optional"
    EXCLUDED="excluded"


class  Trip(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trips"

    trip_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_title = Column(String, nullable=False)
    trip_description = Column(Text, nullable=True)
    trip_origin=Column(String, nullable=True)
    trip_destination=Column(String, nullable=True)
    trip_link_url=Column(String, nullable=True)
    trip_upvote=Column(Integer, nullable=True,default=0)
    trip_downvote=Column(Integer, nullable=True,default=0)
    trip_base_price=Column(Float, nullable=True,default=0)
    trip_base_reward=Column(Float, nullable=True,default=0)
    trip_creation_status=Column(Enum(TripCreationStatusEnum),default=TripCreationStatusEnum.DRAFT)

    #Foreign Keys
    host_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)


class TripItem(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_items"

    trip_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_item_name = Column(String, nullable=False)
    trip_item_description= Column(String, nullable=False)
    trip_item_category = Column(Enum(TripItemCategoryEnum), nullable=True)
    trip_item_address = Column(String, nullable=True)   
    trip_item_traveler_reward = Column(Numeric(precision=10, scale=2), nullable=True)  # Reward for the traveler
    trip_item_type=Column(Enum(TripItemTypeEnum),default=TripItemTypeEnum.INCLUDED)
    trip_item_price=Column(Float, nullable=True) 
    trip_item_image = Column(String, nullable=False)

    #Foreign Keys
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)

class TripImages(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_images"

    trip_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)
    trip_image_url = Column(String, nullable=False)
    trip_image_is_primary = Column(Boolean, default=False)


class TripRating(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_ratings"

    trip_rating_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)
    trip_client_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    trip_rating_score = Column(Integer, nullable=False)  # Rating score, e.g., 1-5
    trip_rating_review = Column(Text, nullable=True)

    #Foreign Keys
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.booking_id", ondelete="CASCADE"), nullable=False)


class TripRatingImages(Base,TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_rating_images"

    trip_rating_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_rating_id = Column(UUID(as_uuid=True), ForeignKey("trip_ratings.trip_rating_id", ondelete="CASCADE"), nullable=False)
    trip_rating_image = Column(Text, nullable=False)




class TripOpening(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_openings"

    trip_opening_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_opening_start_date = Column(DateTime, nullable=False)
    trip_opening_end_date = Column(DateTime, nullable=False)
    trip_opening_total_reward = Column(Numeric(precision=10, scale=2), nullable=True)  # Reward for the trip
    is_limited_availability = Column(Boolean, default=False)
    trip_opening_total_availability = Column(Integer, nullable=True)
    trip_opening_total_booking=Column(Integer, nullable=True)
    trip_opening_price = Column(Float, nullable=False)  # Price specific to this trip opening

    # Foreign Keys
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)



class TripOpeningItem(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_opening_items"

    trip_opening_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    trip_opening_item_traveler_reward = Column(Numeric(precision=10, scale=2), nullable=True)  # Reward for the traveler

    is_limited_availability = Column(Boolean, default=False)
    trip_opening_item_total_availability = Column(Integer, nullable=False)
    trip_opening_item_total_booking=Column(Integer, nullable=True)

    trip_opening_item_price=Column(Float, nullable=True) 

    # Foreign Keys
    trip_opening_id = Column(UUID(as_uuid=True), ForeignKey("trip_openings.trip_opening_id", ondelete="CASCADE"), nullable=False)
    trip_item_id = Column(UUID(as_uuid=True), ForeignKey("trip_items.trip_item_id", ondelete="CASCADE"), nullable=False)