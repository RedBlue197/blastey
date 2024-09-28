import os

AES_SECRET_KEY = os.urandom(32)  # Generates a random 32-byte key
print(AES_SECRET_KEY.hex())  # Display the key in hexadecimal format