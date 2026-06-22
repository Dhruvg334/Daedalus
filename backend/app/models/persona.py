import uuid
from sqlalchemy import Column, String, JSON, Uuid
from ..core.database import Base

class DemoPersona(Base):
    __tablename__ = "demo_personas"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    profile_json = Column(JSON)
