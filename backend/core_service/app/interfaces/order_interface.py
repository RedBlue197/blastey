# app/interfaces/order.py

from sqlalchemy.orm import Session
from models.order_model import Order
from interfaces.base_interface import BaseInterface

class OrderInterface(BaseInterface[Order]):
    def __init__(self, db: Session):
        super().__init__(db, Order, 'order_id')

    # Add more specific queries for Order model
