from typing import List, Optional
from pydantic import BaseModel
from .simulation import StudentProfile

class DemoPersona(BaseModel):
    persona_id: str
    name: str
    age: Optional[int] = None
    headline: str
    interests: List[str]
    favorite_subjects: List[str]
    current_skills: List[str]
    career_fears: List[str]
    work_style: str
    weekly_time_available: str
    profile: StudentProfile

class DemoPersonasResponse(BaseModel):
    success: bool
    personas: List[DemoPersona]
