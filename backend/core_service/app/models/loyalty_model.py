import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from models.base_model import (
    TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin,
    StatusMixin, isDeletedMixin, DeletedByMixin
)
from enum import Enum as PyEnum

class LoyaltyProgramTypeEnum(PyEnum):
    PLATFORM = "platform"
    HOST = "host"

class LoyaltyTransactionTypeEnum(PyEnum):
    EARN = "earn"
    REDEEM = "redeem"

class LoyaltyProgram(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin, DeletedByMixin):
    __tablename__ = "loyalty_programs"

    loyalty_program_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    loyalty_program_name = Column(String, nullable=False)
    loyalty_program_type = Column(Enum(LoyaltyProgramTypeEnum), nullable=False)  # PLATFORM or HOST
    loyalty_program_description = Column(String, nullable=True)
    loyalty_program_points_earned_per_action = Column(Integer, default=0)  # Points earned per action
    host_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), nullable=True)  # Host ID if loyalty type is HOST