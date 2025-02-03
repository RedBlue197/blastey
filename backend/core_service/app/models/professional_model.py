import uuid
from sqlalchemy import Column, String, Boolean, DateTime,Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum

class ProfessionalUserRole(PyEnum):
    OWNER="owner"
    COLLABORATOR="collaborator"
    MEMBER="member"


class Professional(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "professionals"

    professional_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,index=True)
    professional_name = Column(String, unique=True, nullable=False)


class ProfessionalUser(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "professional_users"

    professional_user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,index=True)
    professional_id = Column(UUID(as_uuid=True), ForeignKey('professionals.professional_id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    user_role = Column(Enum(ProfessionalUserRole), default=ProfessionalUserRole.MEMBER, nullable=False)
    is_blocked = Column(Boolean, default=False)