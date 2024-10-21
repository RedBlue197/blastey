from typing import Annotated
from database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import Depends
from passlib.context import CryptContext

def get_db():
    db= SessionLocal()
    try:
        yield db
        db.commit()  # Commit the transaction if all went well
    except:
        db.rollback()  # Rollback the transaction in case of an error
        raise
    finally:
        db.close()  # Close the session


db_dependency = Annotated[Session,Depends(get_db)]

bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated="auto")
