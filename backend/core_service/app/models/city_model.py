from sqlalchemy import Column, Integer, String, ForeignKey, Float,Boolean
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from models.base_model import (
    TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin,
    StatusMixin, isDeletedMixin, DeletedByMixin
)

class City(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "cities"

    city_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city_name = Column(String, nullable=False)
    city_country = Column(String, nullable=False)
    city_latitude = Column(Float, nullable=True)
    city_longitude = Column(Float, nullable=True)
    city_image = Column(String, nullable=True)
    city_code = Column(String, nullable=True)
    is_popular = Column(Boolean,default=False)
    is_new = Column(Boolean,default=False)




