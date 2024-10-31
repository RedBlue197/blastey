from sqlalchemy import Column,JSON,UUID
from database import Base
from models.base_model import TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin
import uuid

class SearchLog(Base, TrackTimeMixin, SoftDeleteMixin, CreatedByMixin, UpdatedByMixin, StatusMixin, isDeletedMixin,DeletedByMixin):
    __tablename__ = "search_logs"
    
    search_log_id  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    search_log_filters = Column(JSON, nullable=True)  # Store filters as JSON

    def __repr__(self):
        return f"<SearchLog(query='{self.search_log_query}', filters={self.search_log_filters})>"