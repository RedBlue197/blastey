from models.user_model import User
from dependencies.auth_dependency import bcrypt_context



def authenticate_user(user_email:str, user_password:str,db):
    user =db.query(User).filter(
        User.user_email==user_email,
        User.is_deleted==False,
        User.is_active==True,
        User.status==True
        ).first()
    if not user:
        return False
    if not bcrypt_context.verify(user_password, user.user_hashed_password):
        return False
    return user