from fastapi import APIRouter, Depends
from utils.request_forwarder import forward_request
from dependencies.auth import get_current_user

router = APIRouter()

@router.get("/users/me")
def get_user_profile(current_user: dict = Depends(get_current_user)):
    # Forward request to Users Service
    response = forward_request(service="users", path="/users/me", method="GET", user=current_user)
    return response
