from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..models.simulation import Simulation

class SimulationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, raw_input: dict, result: dict) -> Simulation:
        db_obj = Simulation(
            user_id=user_id,
            raw_input_json=raw_input,
            result_json=result,
            status="completed"
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get(self, simulation_id: UUID) -> Optional[Simulation]:
        return self.db.query(Simulation).filter(Simulation.id == simulation_id).first()

    def get_multi_by_user(self, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Simulation]:
        return self.db.query(Simulation)\
            .filter(Simulation.user_id == user_id)\
            .offset(skip)\
            .limit(limit)\
            .all()
