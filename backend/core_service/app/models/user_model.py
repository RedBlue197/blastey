import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin

class User(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_email = Column(String, unique=True, nullable=False)
    user_hashed_password = Column(String, nullable=False)
    user_first_name = Column(String, nullable=False)
    user_last_name = Column(String, nullable=False)
    user_phone_number = Column(String, nullable=True)
    user_address = Column(String, nullable=True)
    user_city = Column(String, nullable=True)
    user_country = Column(String, nullable=True)
    user_postal_code = Column(String, nullable=True)
    user_avatar = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_blocked = Column(Boolean, default=False)
    user_last_login_date = Column(DateTime, nullable=True)