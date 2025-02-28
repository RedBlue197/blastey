from sqlalchemy import Column, ForeignKey, Boolean, Text,String,Enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum

class NotificationTypeEnum(PyEnum):
    EMAIL="email"
    SMS="sms"
    PUSH="push"


class Notification(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "notifications"

    notification_id=Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    notification_title=Column(String, nullable=False)
    notification_description=Column(String, nullable=True)
    notification_type=Column(Enum(NotificationTypeEnum), nullable=False)
    notification_url=Column(String, nullable=True)
    notification_image=Column(String, nullable=True)

    receiver_id=Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    sender_id=Column(UUID(as_uuid=True), ForeignKey('users.user_id'), nullable=True)