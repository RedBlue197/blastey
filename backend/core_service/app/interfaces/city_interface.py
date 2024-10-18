# app/interfaces/order.py

from fastapi import UploadFile, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from interfaces.base_interface import BaseInterface

import uuid

from typing import List,Optional

from models.city_model import City
from models.user_model import User


class CityInterface(BaseInterface[City]):
    def __init__(self, db: Session):
        super().__init__(db, City, 'city_id')

    def get_cities(self, search: Optional[str]):
        query = self.db.query(City).filter(
            City.is_deleted == False,
            City.status == True
        )

        if search:
            query = query.filter(
                City.city_name.ilike(f'%{search}%')
            )

        cities = query.all()

        return {"cities": cities}
