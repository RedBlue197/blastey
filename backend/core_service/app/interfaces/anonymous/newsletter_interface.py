# app/interfaces/user.py
from datetime import datetime
from fastapi import HTTPException, status

from sqlalchemy.orm import Session
from sqlalchemy import func

from models.newsletter_model import Newsletter

from interfaces.base_interface import BaseInterface

from backend.core_service.app.schemas.anonymous.newsletter_schema import CreateNewsletterEmailRequest

from dependencies.auth_dependency import bcrypt_context

from utils.send_verification_email import send_verification_email,generate_verification_code,expiration_time 


class NewsletterInterface(BaseInterface[Newsletter]):
    
    def __init__(self, db: Session):
        super().__init__(db, Newsletter, 'newsletter_id')

#---------------------------------GET Functions----------------------------------------

#---------------------------------CREATE Functions----------------------------------------

    def create_newsletter_email(self, email_data: CreateNewsletterEmailRequest):
        """Create a new newsletter email and save it to the database."""
        is_created = False
        try:
            db_newsletter = Newsletter(
                newsletter_email=email_data.newsletter_email
            )
            self.db.add(db_newsletter)
            self.db.commit()
            self.db.refresh(db_newsletter)
            is_created = True
            return is_created
        except Exception as e:
            self.db.rollback()
            raise e
#---------------------------------PUT Functions----------------------------------------




