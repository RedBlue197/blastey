from sqlalchemy import Column, Integer, String, ForeignKey, Float,Date
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import UUID


class GuestType(PyEnum):
    ADULT="adult"
    CHILD="child"
    INFANT="infant"



class Guests(Base):
    __tablename__ = 'guests'
    guest_id = Column(Integer, primary_key=True, index=True)
    guest_gender=Column(String, nullable=True)
    guest_last_name=Column(String, nullable=False)
    guest_first_nname = Column(String, nullable=False)
    guest_birthday=Column(Date, nullable=True)
    guest_email=Column(String, nullable=True)
    guest_country_code=Column(String, nullable=True)
    guest_phone=Column(String, nullable=True)
    guest_is_primary_contact=Column(Boolean, default=False)
    guest_type=Column(Enum(GuestType), nullable=False)

    cart_id = Column(UUID(as_uuid=True), ForeignKey("carts.cart_id"), nullable=False)