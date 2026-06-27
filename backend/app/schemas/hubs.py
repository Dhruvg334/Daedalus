from typing import List, Optional, Literal
from pydantic import BaseModel, Field

# Opportunity Hub
class Opportunity(BaseModel):
    id: str
    title: str
    organization: str
    location: str
    type: Literal["internship", "job", "freelance", "open_source", "competition"]
    salary_stipend: Optional[str] = None
    deadline: Optional[str] = None
    requirements: List[str] = Field(default_factory=list)
    difficulty: Literal["beginner", "intermediate", "advanced"]
    source: str
    apply_url: str
    relevance_score: float

class OpportunityRequest(BaseModel):
    career_id: str
    simulation_id: str
    filters: Optional[dict] = None

class OpportunityResponse(BaseModel):
    opportunities: List[Opportunity]

# Learning Hub
class LearningResource(BaseModel):
    id: str
    title: str
    provider: str
    type: Literal["documentation", "tutorial", "video", "course", "book", "exercise"]
    difficulty: Literal["beginner", "intermediate", "advanced"]
    estimated_time: str
    prerequisites: List[str] = Field(default_factory=list)
    quality_score: float
    tags: List[str] = Field(default_factory=list)
    url: str
    is_free: bool = True

class LearningHubResponse(BaseModel):
    resources: List[LearningResource]
    progress: float
    streak: int
