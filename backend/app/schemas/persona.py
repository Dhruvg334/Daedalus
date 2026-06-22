from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from uuid import UUID

class DemoPersonaBase(BaseModel):
    name: str
    description: Optional[str] = None
    profile_json: Dict[str, Any]

class DemoPersonaCreate(DemoPersonaBase):
    pass

class DemoPersona(DemoPersonaBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
