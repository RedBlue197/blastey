import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from models.base_model import (
    TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin,
    StatusMixin, isDeletedMixin, DeletedByMixin
)
from enum import Enum as PyEnum

class WalletTypeEnum(PyEnum):
    PLATFORM = "Platform"
    HOST = "Host"

class Wallet(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin, DeletedByMixin):
    __tablename__ = "wallets"

    wallet_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), nullable=False)
    host_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), nullable=True)
    wallet_balance = Column(Integer, default=0)
    wallet_currency = Column(String, default="USD")
    wallet_type = Column(Enum(WalletTypeEnum), nullable=False, default=WalletTypeEnum.PLATFORM)

class WalletTransaction(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin, DeletedByMixin):
    __tablename__ = "wallet_transactions"

    wallet_transaction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    wallet_transaction_ammount = Column(Integer, nullable=False)
    wallet_transaction_description = Column(String, nullable=True)  # Optional description of the transaction
    wallet_transaction_reference = Column(String, nullable=True)  # Optional reference of the transaction

    wallet_sender_id = Column(UUID(as_uuid=True), ForeignKey('wallets.wallet_id'), nullable=True)
    wallet_receiver_id = Column(UUID(as_uuid=True), ForeignKey('wallets.wallet_id'), nullable=True)