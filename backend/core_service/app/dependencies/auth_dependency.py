
from passlib.context import CryptContext

SECRET_KEY = "VIwCsS2THYOM0qvWYWszyAFbvnVPerJi8qGFYdrYbowINR7bM8Gd4/Gh/HgAKE/TL6k="
ALGORITHM = "HS256"

bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated="auto")
