from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import UUID

class CartStatus(PyEnum):
    ONGOING = "ongoing"
    PENDING = "pending"
    CONFIRMED = "confirmed"
    ABANDONNED = "abandonned"

class CartItemType(PyEnum):
    SERVICE="service"

class Cart(Base):
    __tablename__ = 'carts'
    cart_id = Column(Integer, primary_key=True, index=True)
    cart_status=Column(Enum(CartStatus), default=CartStatus.PENDING, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)

    # Trip Data (Immutable)
    trip_id = Column(UUID(as_uuid=True), nullable=False)  # Reference to the original trip (just for lookup)
    trip_title = Column(String, nullable=False)  # Store the trip title when added to cart
    trip_description = Column(String, nullable=True)
    trip_origin = Column(String, nullable=False)  # Store the trip origin when added to cart
    trip_destination = Column(String, nullable=False)  # Store the trip destination when added to cart
    trip_price = Column(Float, nullable=False)  # Store the trip price at the time of adding to the cart

    # Trip Opening Data (Immutable)
    trip_opening_id = Column(UUID(as_uuid=True), nullable=True)  # Reference to trip opening
    trip_opening_start_date = Column(DateTime, nullable=False)  # Store the opening start date
    trip_opening_end_date = Column(DateTime, nullable=False)  # Store the opening end date
    trip_opening_price = Column(Float, nullable=False)  # Store the trip opening price at the time of adding to cart

    # Trip Item Data (Immutable, Optional for Services)
    trip_item_id = Column(UUID(as_uuid=True), nullable=True)  # Reference to the original trip item (just for lookup)
    trip_item_name = Column(String, nullable=True)  # Store the trip item name
    trip_item_description = Column(String, nullable=True)
    trip_item_price = Column(Float, nullable=True)  # Store the trip item price at the time of adding to cart

class CartItem(Base):
    __tablename__ = 'cart_items'

    cart_item_id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('carts.id'))