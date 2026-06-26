from pydantic import BaseModel
from typing import Optional

class FeedbackCreate(BaseModel):
    simulation_id: str  # The sim_xxx string ID from the simulation engine
    rating: int  # 1-5
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    success: bool
    message: str
