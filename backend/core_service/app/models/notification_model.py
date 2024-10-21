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