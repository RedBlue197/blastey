from sqlalchemy import Column, ForeignKey, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin

class Message(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "messages"

    message_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)

    # Relationships
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

