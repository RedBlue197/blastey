import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    requests = relationship("Request", back_populates="user", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="user", cascade="all, delete-orphan")
    sent_messages = relationship("Message", foreign_keys="[Message.sender_id]", back_populates="sender", cascade="all, delete-orphan")
    received_messages = relationship("Message", foreign_keys="[Message.receiver_id]", back_populates="receiver", cascade="all, delete-orphan")
    ratings_as_traveler = relationship("Rating", foreign_keys="[Rating.traveler_id]", back_populates="traveler", cascade="all, delete-orphan")
    ratings_as_client = relationship("Rating", foreign_keys="[Rating.client_id]", back_populates="client", cascade="all, delete-orphan")
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    conversations_as_traveler = relationship("Conversation", foreign_keys="[Conversation.traveler_id]", back_populates="traveler", cascade="all, delete-orphan")
    conversations_as_client = relationship("Conversation", foreign_keys="[Conversation.client_id]", back_populates="client", cascade="all, delete-orphan")
