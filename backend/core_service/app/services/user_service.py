from models.user_model import User
from dependencies.auth_dependency import bcrypt_context



def authenticate_user(user_email:str, user_password:str,db):
    user =db.query(User).filter(User.user_email==user_email).first()
    if not user:
        return False
    if not bcrypt_context.verify(user_password, user.user_hashed_password):
        return False
    return user

def authenticate_app_user(user_phone_number:str,db):
    user =db.query(User).filter(User.user_phone_number==user_phone_number).first()
    if not user:
        return False
    return user