from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from passlib.context import CryptContext

bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/core/frontoffice/v1/token")

auth_dependency=Annotated[OAuth2PasswordRequestForm,Depends()]
auth_bearer= Annotated[str, Depends(oauth2_bearer)]