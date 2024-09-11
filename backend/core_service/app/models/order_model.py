from sqlalchemy import Column, String, ForeignKey, Numeric, Enum, DateTime, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum

class OrderStatus(PyEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class OrderItemType(PyEnum):
    ACTIVITY = "activity"
    TRIP = "trip"

class Order(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "orders"

    order_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String, nullable=False, unique=True)
    order_total_amount = Column(Numeric(precision=10, scale=2), nullable=False)
    order_total_traveler_reward = Column(Numeric(precision=10, scale=2), nullable=False)
    order_status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)

    # Foreign Keys
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    merchant_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

class OrderItem(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "order_items"

    order_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False)
    order_item_type= Column(Enum(OrderItemType), default=OrderItemType.ACTIVITY, nullable=False)
    order_item_name = Column(String, nullable=False)
    order_item_quantity = Column(Numeric(precision=10, scale=2), nullable=False,default=1)
    order_item_price = Column(Numeric(precision=10, scale=2), nullable=False)

    @staticmethod
    def generate_order_number(session):
        # Get the current date
        today = datetime.utcnow().strftime('%Y%m%d')

        # Query the last order number for today
        last_order = session.query(Order).filter(Order.order_number.like(f"ORD-{today}-%")).order_by(Order.order_number.desc()).first()

        # If no orders exist for today, start with 000001
        if not last_order:
            sequence = 1
        else:
            # Extract the last 6 digits from the order number and increment by 1
            last_sequence = int(last_order.order_number.split('-')[-1])
            sequence = last_sequence + 1

        # Generate the order number with the format ORD-YYYYMMDD-XXXXXX
        order_number = f"ORD-{today}-{sequence:06d}"
        return order_number
    

@event.listens_for(Order, 'before_insert')
def receive_before_insert(mapper, connection, target):
    session = connection.info['session']
    target.order_number = Order.generate_order_number(session)
