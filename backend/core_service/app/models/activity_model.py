from sqlalchemy import Column, String, Text, Numeric, ForeignKey, Enum, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum



class ItemCategoryEnum(PyEnum):
    ELECTRONICS = "electronics"
    FASHION = "fashion"
    BEAUTY = "beauty"
    FOOD = "food"
    HOME = "home"
    SPORT = "sport"
    OTHER = "other"

class Activity(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activities"

    activity_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_title = Column(String, nullable=False)
    activity_description = Column(Text, nullable=True)

    #Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.address_id", ondelete="SET NULL"), nullable=True)


class ActivityItem(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activity_items"

    activity_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_item_name = Column(String, nullable=False)
    activity_item_category = Column(Enum(ItemCategoryEnum), nullable=True)
    activity_item_address = Column(String, nullable=True)   
    activity_item_traveler_reward = Column(Numeric(precision=10, scale=2), nullable=False)  # Reward for the traveler

    #Foreign Keys
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.activity_id", ondelete="CASCADE"), nullable=False)

class ActivityItemImages(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "activity_item_images"

    activity_item_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("activity_items.activity_item_id", ondelete="CASCADE"), nullable=False)
    activity_item_image_url = Column(String, nullable=False)
    activity_item_image_is_primary = Column(Boolean, default=False)

