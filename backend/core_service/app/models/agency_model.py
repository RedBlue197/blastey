import uuid
from sqlalchemy import Column, String, Boolean, DateTime,Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum

class AgencyUserRole(PyEnum):
    OWNER="owner"
    COLLABORATOR="collaborator"
    MEMBER="member"


class Agency(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "agencies"

    agency_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,index=True)
    agency_name = Column(String, unique=True, nullable=False)


class AgencyUser(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "agency_users"

    agency_user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,index=True)
    agency_id = Column(UUID(as_uuid=True), ForeignKey('agencies.agency_id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    user_role = Column(Enum(AgencyUserRole), default=AgencyUserRole.MEMBER, nullable=False)
    is_blocked = Column(Boolean, default=False)