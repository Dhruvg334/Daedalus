import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, Uuid
from ..core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    simulation_id = Column(Uuid, ForeignKey("simulations.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(String)
