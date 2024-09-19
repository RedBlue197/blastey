import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from models.base_model import (
    TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin,
    StatusMixin, isDeletedMixin, DeletedByMixin
)
from enum import Enum as PyEnum

class LoyaltyType(PyEnum):
    PLATFORM = "platform"
    HOST = "host"

class LoyaltyProgram(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin, DeletedByMixin):
    __tablename__ = "loyalty_programs"

    loyalty_program_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    program_name = Column(String, nullable=False)
    loyalty_type = Column(Enum(LoyaltyType), nullable=False)  # PLATFORM or HOST
    description = Column(String, nullable=True)
    points_earned_per_action = Column(Integer, default=0)  # Points earned per action

class LoyaltyTransaction(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin, DeletedByMixin):
    __tablename__ = "loyalty_transactions"

    loyalty_transaction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    loyalty_program_id = Column(UUID(as_uuid=True), ForeignKey('loyalty_programs.loyalty_program_id'), nullable=False)
    transaction_type = Column(String, nullable=False)  # e.g., 'earn', 'redeem'
    points = Column(Integer, nullable=False)
    description = Column(String, nullable=True)  # Optional description of the transaction