from sqlalchemy import event
from datetime import datetime
from models.base_model import TrackTimeMixin, CreatedByMixin, UpdatedByMixin, SoftDeleteMixin
from database import Base
from main import current_user_var


def get_current_user_id():
    current_user = current_user_var.get()
    if current_user:
        return current_user['id']
    return None  # Or handle it as you need

def set_created_by(mapper, connection, target):
    if hasattr(target, 'created_by'):
        target.created_by = get_current_user_id()

def set_updated_by(mapper, connection, target):
    if hasattr(target, 'updated_by'):
        target.updated_by = get_current_user_id()

def update_timestamps(mapper, connection, target):
    if hasattr(target, 'updated_at'):
        target.updated_at = datetime.utcnow()

def soft_delete(mapper, connection, target):
    if hasattr(target, 'deleted_at'):
        target.deleted_at = datetime.utcnow()
        target.is_deleted = True

# Attach event listeners to models
def register_event_listeners():
    for model in Base._decl_class_registry.values():
        if isinstance(model, type) and issubclass(model, (TrackTimeMixin, CreatedByMixin, UpdatedByMixin, SoftDeleteMixin)):
            event.listen(model, 'before_insert', set_created_by)
            event.listen(model, 'before_update', set_updated_by)
            event.listen(model, 'before_update', update_timestamps)
            event.listen(model, 'before_delete', soft_delete)

# Register event listeners once your models are imported
register_event_listeners()
