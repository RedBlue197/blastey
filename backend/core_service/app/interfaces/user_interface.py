# app/interfaces/user.py

from sqlalchemy.orm import Session
from sqlalchemy import func

from models.user_model import User
from interfaces.base_interface import BaseInterface
from schemas.user_schema import CreateUserRequest

from dependencies.auth_dependency import bcrypt_context

import uuid

class UserInterface(BaseInterface[User]):
    def __init__(self, db: Session):
        super().__init__(db, User, 'user_id')

#---------------------------------GET Functions----------------------------------------

    def get_all_users_with_pagination(self, offset: int, limit: int):
        """Retrieve all users with pagination."""
        
        # Subquery to get total count
        total_count_query = (
            self.db.query(func.count(User.user_id))
            .filter(
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

    def get_user_by_id_with_pagination(self, user_id: uuid.UUID):
        """Retrieve a user by ID."""
        return self.db.query(User).filter(
            User.user_id == user_id,
            User.is_deleted == False,
            User.is_blocked == False,
            User.is_active == True
        ).first()

#---------------------------------CREATE Functions----------------------------------------

    def create_user(self, user: CreateUserRequest):
        """Create a new user and save it to the database."""
        try:
            db_user = User(
                user_first_name=user.user_first_name,
                user_last_name=user.user_last_name,
                user_email=user.user_email,
                user_role=user.user_role,  # Assume enums are validated before
                user_rank=user.user_rank,
                user_phone_number=user.user_phone_number,
                user_hashed_password=bcrypt_context.hash(user.user_password),
                user_address=user.user_address,
                user_city=user.user_city,
                user_country=user.user_country,
                user_postal_code=user.user_postal_code,
                is_verified=False
            )
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except Exception as e:
            self.db.rollback()
            raise e