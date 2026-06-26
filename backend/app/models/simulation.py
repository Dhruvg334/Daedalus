import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Uuid
from sqlalchemy.sql import func
from ..core.database import Base

class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    simulation_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="completed")
    raw_input_json = Column(JSON)
    result_json = Column(JSON)
