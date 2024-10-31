from sqlalchemy import Column, String, Text, Numeric, ForeignKey, Enum, Float, Boolean,DateTime,Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
from enum import Enum as PyEnum

class SearchLog(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "search_logs"
    
    search_log_id = Column(uuid.UUID, primary_key=True, index=True)
    search_log_filters = Column(JSON, nullable=True)  # Store filters as JSON

    def __repr__(self):
        return f"<SearchLog(query='{self.search_log_query}', filters={self.search_log_filters})>"