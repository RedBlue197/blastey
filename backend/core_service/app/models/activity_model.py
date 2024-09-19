from sqlalchemy import Column, String, Text, Numeric, ForeignKey, Enum, Float, Boolean,Integer,DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum



class ActivityItemCategoryEnum(PyEnum):
    ELECTRONICS = "electronics"
    FASHION = "fashion"
    BEAUTY = "beauty"
    FOOD = "food"
    HOME = "home"
    SPORT = "sport"
    OTHER = "other"

class ActivityItemTypeEnum(PyEnum):
    INCLUDED="included"


class Activity(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activities"

    activity_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_title = Column(String, nullable=False)
    activity_description = Column(Text, nullable=True)
    activity_start_date = Column(DateTime, nullable=False)
    activity_end_date = Column(DateTime, nullable=False)
    activity_price = Column(Numeric(precision=10, scale=2), nullable=False)
    activity_total_availability = Column(Integer, nullable=True)
    activity_total_booking=Column(Integer, nullable=True)
    

    #Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.address_id", ondelete="SET NULL"), nullable=True)


class ActivityItem(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activity_items"

    activity_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_item_name = Column(String, nullable=False)
    activity_item_category = Column(Enum(ActivityItemCategoryEnum), nullable=True)
    activity_item_address = Column(String, nullable=True)   
    activity_item_traveler_reward = Column(Numeric(precision=10, scale=2), nullable=False)  # Reward for the traveler
    activity_item_type=Column(Enum(ActivityItemTypeEnum),default=ActivityItemTypeEnum.INCLUDED)
    activity_item_price=Column(Float, nullable=True) 

    #Foreign Keys
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.activity_id", ondelete="CASCADE"), nullable=False)

class ActivityItemImages(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activity_item_images"

    activity_item_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("activity_items.activity_item_id", ondelete="CASCADE"), nullable=False)
    activity_item_image_url = Column(String, nullable=False)
    activity_item_image_is_primary = Column(Boolean, default=False)

class ActivityRating(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activity_ratings"

    activity_rating_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.activity_id", ondelete="CASCADE"), nullable=False)
    activity_client_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    activity_rating_score = Column(Integer, nullable=False)  # Rating score, e.g., 1-5
    activity_rating_review = Column(Text, nullable=True)

class ActivityRatingImages(Base,TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activity_rating_images"

    activity_rating_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_rating_id = Column(UUID(as_uuid=True), ForeignKey("activity_ratings.activity_rating_id", ondelete="CASCADE"), nullable=False)
    activity_rating_image_url = Column(Text, nullable=False)
