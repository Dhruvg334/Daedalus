import uuid
from sqlalchemy import Column, Integer, String, Uuid
from ..core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    # simulation_id is the string sim_xxx from the simulation engine (no FK constraint
    # since simulations are stored with their own string ID, not the UUID primary key)
    simulation_id = Column(String, nullable=True, index=True)
    rating = Column(Integer, nullable=False)
    comment = Column(String)
