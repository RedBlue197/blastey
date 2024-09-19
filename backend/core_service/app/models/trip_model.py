from sqlalchemy import Column, String, Text, Numeric, ForeignKey, Enum, Float, Boolean,DateTime,Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum



class TripItemCategoryEnum(PyEnum):
    ELECTRONICS = "electronics"
    FASHION = "fashion"
    BEAUTY = "beauty"
    FOOD = "food"
    HOME = "home"
    SPORT = "sport"
    OTHER = "other"

class  TripItemTypeEnum(PyEnum):
    INCLUDED="included"


class  Trip(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trips"

    trip_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_title = Column(String, nullable=False)
    trip_description = Column(Text, nullable=True)
    trip_departure_date=Column(DateTime, nullable=True)
    trip_return_date=Column(DateTime, nullable=True)
    trip_origin=Column(String, nullable=True)
    trip_destination=Column(String, nullable=True)
    trip_total_availability=Column(Integer, nullable=True)
    trip_total_booking=Column(Integer, nullable=True)

    #Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.address_id", ondelete="SET NULL"), nullable=True)


class TripItem(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_items"

    trip_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_item_date=Column(DateTime)
    trip_item_name = Column(String, nullable=False)
    trip_item_description= Column(String, nullable=False)
    trip_item_category = Column(Enum(TripItemCategoryEnum), nullable=True)
    trip_item_address = Column(String, nullable=True)   
    trip_item_traveler_reward = Column(Numeric(precision=10, scale=2), nullable=True)  # Reward for the traveler
    trip_item_type=Column(Enum(TripItemTypeEnum),default=TripItemTypeEnum.INCLUDED)
    trip_item_price=Column(Float, nullable=True) 

    #Foreign Keys
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)

class TripItemImages(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_item_images"

    trip_item_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("trip_items.trip_item_id", ondelete="CASCADE"), nullable=False)
    trip_item_image_url = Column(String, nullable=False)
    trip_item_image_is_primary = Column(Boolean, default=False)


class TripRating(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_ratings"

    trip_rating_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=False)
    trip_client_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    trip_rating_score = Column(Integer, nullable=False)  # Rating score, e.g., 1-5
    trip_rating_review = Column(Text, nullable=True)

class TripRatingImages(Base,TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "trip_rating_images"

    trip_rating_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_rating_id = Column(UUID(as_uuid=True), ForeignKey("trip_ratings.rating_id", ondelete="CASCADE"), nullable=False)
    trip_rating_image_url = Column(Text, nullable=False)
