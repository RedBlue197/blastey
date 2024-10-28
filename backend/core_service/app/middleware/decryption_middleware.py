from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64
import json
from config import settings  # Make sure this matches with frontend

AES_SECRET_KEY = settings.AES_SECRET_KEY

# Padding and unpadding for AES
def pad(data: str) -> bytes:
    pad_length = 16 - (len(data) % 16)
    return data.encode('utf-8') + bytes([pad_length] * pad_length)

def unpad(data: bytes) -> bytes:
    pad_length = data[-1]
    return data[:-pad_length]

# AES Decryption function
def decrypt_data(iv: str, encrypted_data: str) -> str:
    key = AES_SECRET_KEY
    iv_bytes = bytes.fromhex(iv)  # Convert IV from hex to bytes
    encrypted_data_bytes = base64.b64decode(encrypted_data)  # Decode base64

    # Initialize the cipher for decryption using CBC mode
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv_bytes), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_bytes = decryptor.update(encrypted_data_bytes) + decryptor.finalize()

    return unpad(decrypted_bytes).decode('utf-8')

# Custom decryption middleware
class DecryptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Try to parse the JSON body if the request method is POST
        if request.method == 'POST' or request.method == 'PUT':
            try:
                body_json = await request.json()  # Get JSON body
                # Check if 'iv' and 'data' are in the request body
                if 'iv' in body_json and 'data' in body_json:
                    iv = body_json['iv']
                    encrypted_data = body_json['data']
                    # Decrypt the data
                    decrypted_data = decrypt_data(iv, encrypted_data)
                    decrypted_json = json.loads(decrypted_data)
                    # Replace request body with decrypted data directly
                    request._json = decrypted_json  # Modify request object
                    # Set the body for FastAPI to read
                    request._body = json.dumps(decrypted_json).encode('utf-8')  # Ensure it's in bytes
                    
                    # Log the entire decrypted request
                    # print("Full Decrypted Request:", decrypted_json)  # Log the decrypted JSON
                else:
                    print("Required fields 'iv' and 'data' are missing.")
            except Exception as e:
                print("Decryption error:", e)
                return JSONResponse(
                    content={"error": "Decryption failed", "details": str(e)},
                    status_code=400,
                )

        # Continue processing request
        try:

            response = await call_next(request)
        except Exception as e:
            print("Error processing request:", e)
            return JSONResponse(
                content={"error": "Internal server error", "details": str(e)},
                status_code=500,
            )

        return response
