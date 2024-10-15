from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import UUID

class City(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "cities"

    city_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city_name = column(String, nullable=False)
    city_country = column(String, nullable=False)
    city_latitude = column(Float, nullable=True)
    city_longitude = column(Float, nullable=True)
    city_image = column(String, nullable=True)
    city_code = column(String, nullable=True)




