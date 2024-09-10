# app/interfaces/base.py

from sqlalchemy.orm import Session
from typing import Generic, Type, TypeVar, Optional, List

T = TypeVar('T')

class BaseInterface(Generic[T]):
    def __init__(self, db: Session, model: Type[T], pk_field: str):
        self.db = db  # The database session
        self.model = model  # The model to be queried
        self.pk_field = pk_field  # The primary key field name

    def get(self, id: str) -> Optional[T]:
        """Retrieve a single record by primary key."""
        return self.db.query(self.model).filter(getattr(self.model, self.pk_field) == id).first()

    def get_all(self) -> List[T]:
        """Retrieve all records."""
        return self.db.query(self.model).all()

    def create(self, obj_in: T) -> T:
        """Create a new record."""
        self.db.add(obj_in)
        self.db.commit()
        self.db.refresh(obj_in)
        return obj_in

    def update(self, id: str, obj_in: dict) -> Optional[T]:
        """Update an existing record."""
        obj = self.db.query(self.model).filter(getattr(self.model, self.pk_field) == id).first()
        if obj:
            for field, value in obj_in.items():
                setattr(obj, field, value)
            self.db.commit()
            self.db.refresh(obj)
        return obj

    def delete(self, id: str) -> Optional[T]:
        """Delete a record by primary key."""
        obj = self.db.query(self.model).filter(getattr(self.model, self.pk_field) == id).first()
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
