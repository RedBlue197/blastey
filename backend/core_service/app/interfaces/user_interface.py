# app/interfaces/user.py

from sqlalchemy.orm import Session
from sqlalchemy import func

from models.user_model import User
from interfaces.base_interface import BaseInterface

class UserInterface(BaseInterface[User]):
    def __init__(self, db: Session):
        super().__init__(db, User, 'user_id')

    def get_user_by_id_with_pagination(self, user_id: str, offset: int, limit: int):
        """Retrieve user by ID with pagination."""
        
        # Subquery to get total count
        total_count_query = (
            self.db.query(func.count(User.user_id))
            .filter(
                User.user_id == user_id,
                User.is_deleted == False,
                User.is_blocked == False,
                User.is_active == True
            )
            .scalar_subquery()  # Executes count as part of the same query
        )
        
        # Main query to get paginated users and total count
        users_query = (
            self.db.query(User, total_count_query.label('total_count'))
            .filter(
                User.user_id == user_id,
                User.is_deleted == False,
                User.is_blocked == False,
                User.is_active == True
            )
            .offset(offset)
            .limit(limit)
            .all()
        )
        
        # Since total count is part of each row, extract it from the first result
        if users_query:
            total_count = users_query[0].total_count
            users = [user for user, _ in users_query]
        else:
            total_count = 0
            users = []

        return users, total_count