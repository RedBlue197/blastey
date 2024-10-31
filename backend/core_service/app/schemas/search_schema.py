from pydantic import BaseModel,UUID4
from typing import Optional
from datetime import datetime

class CreateSearchLogRequest(BaseModel):
    filters: Optional[dict] = None

    class Config:
        schema_extra = {
            "example": {
                "filters": {"location": "mountains", "price_range": [100, 500]},
            }
        }
