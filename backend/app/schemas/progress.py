from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class ProgressUpdate(BaseModel):
    simulation_id: str
    resource_id: Optional[str] = None
    task_id: Optional[str] = None
    skill: Optional[str] = None
    hours: Optional[float] = 0.0

class ProgressResponse(BaseModel):
    simulation_id: str
    completed_resource_ids: List[str]
    completed_task_ids: List[str]
    verified_skills: List[str]
    streak_count: int
    total_learning_hours: float
    achievements: List[str]
    last_activity_at: Optional[datetime]
