
import requests
from config import settings

def forward_request(service: str, path: str, method: str = "GET", data: dict = None, headers: dict = None):
    url = f"{settings.SERVICES[service]['url']}{path}"
    response = requests.request(method, url, json=data, headers=headers)
    return response.json()
