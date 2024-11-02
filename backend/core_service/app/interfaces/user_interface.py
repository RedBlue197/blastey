# app/interfaces/user.py
from datetime import datetime
from fastapi import HTTPException, status

from sqlalchemy.orm import Session
from sqlalchemy import func

from models.user_model import User,VerificationCode

from interfaces.base_interface import BaseInterface

from schemas.user_schema import CreateUserRequest,PutUserVerificationRequest

from dependencies.auth_dependency import bcrypt_context

from utils.send_verification_email import send_verification_email,generate_verification_code,expiration_time 



import uuid

import asyncio


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
                user_first_name="Test",
                user_last_name="Test",
                user_email=user.user_email,
                user_phone_number=user.user_phone_number,
                user_hashed_password=bcrypt_context.hash(user.user_password),
                is_verified=False,
                is_blocked=False
            )
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)

            # Generate verification code
            verification_code_value=generate_verification_code()

            verification_code=VerificationCode(
                verification_code_email = db_user.user_email,
                verification_code_value = verification_code_value,
                expires_at = expiration_time
            )

            self.db.add(verification_code)
            self.db.commit()
            self.db.refresh(verification_code)

            # Send verification Email
            #asyncio.create_task(send_verification_email("Verify your email",[db_user.user_email],verification_code_value))

            return db_user,verification_code
        except Exception as e:
            self.db.rollback()
            raise e

#---------------------------------PUT Functions----------------------------------------

    def update_user_verification(self, user: PutUserVerificationRequest):
        """Update an existing user."""

        try:
            verification_code = self.db.query(VerificationCode).filter_by(verification_code_email=user.user_email).first()

            if not verification_code:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code not found.")
            
            if verification_code.expires_at < datetime.now():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code has expired.")
            
            if verification_code.verification_code_value != user.verification_code_value:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code.")
            
            # Mark the user as verified
            db_user=self.db.query(User).filter_by(user_email=user.user_email).update({"is_verified": True})

            # Mark the code as used
            self.db.query(VerificationCode).filter_by(verification_code_id=verification_code.verification_code_id).update({"is_used": True})
            
            self.db.commit()
            self.db.refresh(verification_code)

            return True
        except Exception as e:
            self.db.rollback()
            raise e





