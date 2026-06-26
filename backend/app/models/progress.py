import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, JSON, Uuid, Integer, Boolean
from sqlalchemy.sql import func
from ..core.database import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=True)
    simulation_id = Column(String, index=True)

    # Tracking
    completed_resource_ids = Column(JSON, default=list) # List of learning resource IDs
    completed_task_ids = Column(JSON, default=list)     # List of sprint task IDs
    verified_skills = Column(JSON, default=list)        # List of skills proven via projects

    streak_count = Column(Integer, default=0)
    last_activity_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Metadata
    total_learning_hours = Column(Float, default=0.0)
    achievements = Column(JSON, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
