from sqlalchemy import Column, DateTime, Boolean
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

class TrackTimeMixin:
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SoftDeleteMixin:
    deleted_at = Column(DateTime, nullable=True)
    
    def soft_delete(self):
        self.deleted_at = datetime.utcnow()
        self.is_deleted = True

class CreatedByMixin:
    created_by = Column(UUID(as_uuid=True), nullable=True)

class UpdatedByMixin:
    updated_by = Column(UUID(as_uuid=True), nullable=True)

class DeletedByMixin:
    deleted_by = Column(UUID(as_uuid=True), nullable=True)

class StatusMixin:
    status = Column(Boolean, default=True)

class isDeletedMixin:
    is_deleted = Column(Boolean, default=False)
