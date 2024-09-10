import uuid
from sqlalchemy import Column, String, Boolean,ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin

class Address(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "addresses"

    address_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    address_name = Column(String, nullable=False)
    address_city = Column(String, nullable=False)
    address_country = Column(String, nullable=False)
    address_postal_code = Column(String, nullable=False)
    address_is_primary = Column(Boolean, default=False)
    address_is_active = Column(Boolean, default=True)
    address_latitude = Column(String, nullable=True)
    address_longitude = Column(String, nullable=True)

    # Foreign keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)




