from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64
import json
from config import settings
# Load AES key from settings (should be 32 bytes for AES-256)
AES_SECRET_KEY = settings.AES_SECRET_KEY

# Utility to remove padding
def unpad(data: bytes) -> bytes:
    pad_length = data[-1]
    return data[:-pad_length]

# AES decryption function
def decrypt_data(iv: str, encrypted_data: str) -> str:
    iv_bytes = bytes.fromhex(iv)
    encrypted_data_bytes = base64.b64decode(encrypted_data)
    cipher = Cipher(algorithms.AES(AES_SECRET_KEY), modes.CBC(iv_bytes), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_bytes = decryptor.update(encrypted_data_bytes) + decryptor.finalize()
    return unpad(decrypted_bytes).decode("utf-8")

# Middleware to handle decryption for both JSON and multipart form data
class DecryptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            # Handle JSON payloads with 'application/json' content-type
            if request.method in ["POST", "PUT"] and request.headers.get("Content-Type") == "application/json":
                body_json = await request.json()  # Load JSON body
                if "iv" in body_json and "data" in body_json:
                    decrypted_data = decrypt_data(body_json["iv"], body_json["data"])
                    decrypted_json = json.loads(decrypted_data)
                    request._json = decrypted_json
                    request._body = json.dumps(decrypted_json).encode("utf-8")
            
            # Handle multipart form data with 'multipart/form-data' content-type
            elif request.method in ["POST", "PUT"] and "multipart/form-data" in request.headers.get("Content-Type", ""):
                # form_data = await request.form()  # Parse form data
                # iv = form_data.get("iv")
                # encrypted_data = form_data.get("data")

                # if iv and encrypted_data:
                #     decrypted_data = decrypt_data(iv, encrypted_data)
                #     decrypted_json = json.loads(decrypted_data)

                #     # Create a dictionary combining decrypted data and other form fields
                #     combined_form_data = {**decrypted_json, **{key: value for key, value in form_data.items() if key not in ["iv", "data"]}}

                #     # Replace the request._form with combined data (note: we can't actually assign to request._form directly)
                #     request.state.decrypted_form_data = combined_form_data
                    
                # else:
                #     print("IV or encrypted data missing in form data")
                print("Multipart form data decryption not implemented yet")
            # Proceed to the next middleware or route handler
            response = await call_next(request)

        except Exception as e:
            print("Decryption error:", e)
            return JSONResponse(content={"error": "Decryption failed", "details": str(e)}, status_code=400)

        return response
