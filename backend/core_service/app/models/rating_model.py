from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin

class Rating(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "ratings"

    rating_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    traveler_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    rating_score = Column(Integer, nullable=False)  # Rating score, e.g., 1-5
    rating_review = Column(Text, nullable=True)

class RatingImages(Base,TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "rating_images"

    rating_image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rating_id = Column(UUID(as_uuid=True), ForeignKey("ratings.rating_id", ondelete="CASCADE"), nullable=False)
    rating_image_url = Column(Text, nullable=False)

