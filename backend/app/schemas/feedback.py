from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class FeedbackCreate(BaseModel):
    simulation_id: UUID
    rating: int  # 1-5
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    success: bool
    message: str
