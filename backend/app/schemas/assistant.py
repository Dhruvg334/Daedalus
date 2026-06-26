from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class AssistantMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class AssistantChatRequest(BaseModel):
    messages: List[AssistantMessage]
    simulation_id: Optional[str] = None
    context_overrides: Optional[Dict[str, Any]] = None

class AssistantChatResponse(BaseModel):
    content: str
    suggested_actions: List[str] = Field(default_factory=list)
    relevant_resources: List[str] = Field(default_factory=list) # IDs of resources or opportunities

class AutomationRequest(BaseModel):
    automation_type: str # "resume", "cover_letter", "linkedin", "readme", "learning_plan"
    simulation_id: str
    additional_instructions: Optional[str] = None

class AutomationResponse(BaseModel):
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
