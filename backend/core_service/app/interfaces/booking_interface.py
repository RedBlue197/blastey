# app/interfaces/order.py

from sqlalchemy.orm import Session
from backend.core_service.app.models.booking_model import Booking
from interfaces.base_interface import BaseInterface

class BookingInterface(BaseInterface[Booking]):
    def __init__(self, db: Session):
        super().__init__(db, Booking, 'booking_id')

    # Add more specific queries for Order model
