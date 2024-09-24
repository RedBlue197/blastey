from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from Crypto.Cipher import AES
import base64
import json
from config import settings  # Must match with frontend


SECRET_KEY=settings.SECRET_KEY
# Padding and unpadding for AES
def pad(data: str):
    return data + (16 - len(data) % 16) * chr(16 - len(data) % 16)

def unpad(data: bytes):
    return data[:-data[-1]]

# AES Decryption function
def decrypt_data(encrypted_data: str):
    key = SECRET_KEY.encode('utf-8')
    encrypted_data_bytes = base64.b64decode(encrypted_data)
    cipher = AES.new(key, AES.MODE_ECB)
    decrypted_bytes = unpad(cipher.decrypt(encrypted_data_bytes))
    return decrypted_bytes.decode('utf-8')

# Custom decryption middleware
class DecryptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == 'POST':
            body = await request.json()

            # Check if 'data' is in the request body (assuming this structure)
            if 'data' in body:
                encrypted_data = body['data']

                # Decrypt the data
                try:
                    decrypted_data = decrypt_data(encrypted_data)
                    decrypted_json = json.loads(decrypted_data)

                    # Replace request body with decrypted data
                    request._json = decrypted_json  # Modify request object
                except Exception as e:
                    return JSONResponse(
                        content={"error": "Decryption failed", "details": str(e)},
                        status_code=400,
                    )

        # Continue processing request
        response = await call_next(request)
        return response
