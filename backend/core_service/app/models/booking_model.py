from sqlalchemy import Column, String, ForeignKey, Numeric, Enum, DateTime, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum

class BookingStatus(PyEnum):
    INITIATED = "initiated"
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class BookingItemType(PyEnum):
    ACTIVITY = "activity"
    TRIP = "trip"

class Booking(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "bookings"

    booking_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_number = Column(String, nullable=False, unique=True)
    booking_total_amount = Column(Numeric(precision=10, scale=2), nullable=False)
    booking_total_traveler_reward = Column(Numeric(precision=10, scale=2), nullable=False)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)

    # Foreign KeysBookingStatus
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    host_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

class BookingItem(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "booking_items"

    booking_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.booking_id", ondelete="CASCADE"), nullable=False)
    booking_item_type = Column(Enum(BookingItemType), default=BookingItemType.TRIP, nullable=False)
    booking_item_name = Column(String, nullable=False)
    booking_item_quantity = Column(Numeric(precision=10, scale=2), nullable=False, default=1)
    booking_item_price = Column(Numeric(precision=10, scale=2), nullable=False)

    # Link to TripOpening
    trip_opening_id = Column(UUID(as_uuid=True), ForeignKey("trip_openings.trip_opening_id"), nullable=True)


    @staticmethod
    def generate_booking_number(session):
        # Get the current date
        today = datetime.utcnow().strftime('%Y%m%d')

        # Query the last booking number for today
        last_booking = session.query(Booking).filter(Booking.booking_number.like(f"BOOK-{today}-%")).booking_by(Booking.booking_number.desc()).first()

        # If no bookings exist for today, start with 000001
        if not last_booking:
            sequence = 1
        else:
            # Extract the last 6 digits from the booking number and increment by 1
            last_sequence = int(last_booking.booking_number.split('-')[-1])
            sequence = last_sequence + 1

        # Generate the booking number with the format ORD-YYYYMMDD-XXXXXX
        booking_number = f"BOOK-{today}-{sequence:06d}"
        return booking_number
    

@event.listens_for(Booking, 'before_insert')
def receive_before_insert(mapper, connection, target):
    session = connection.info['session']
    target.booking_number = Booking.generate_booking_number(session)
