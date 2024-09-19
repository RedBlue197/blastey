from sqlalchemy import Column, ForeignKey, Boolean, Text,Email
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin

class Newsletter(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "newsletters"

    newsletter_id=Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    newsletter_email=Column(String, unique=True, nullable=False)