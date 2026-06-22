import json
import os
from typing import Dict, Any
from sqlalchemy.orm import Session
from ..repositories.simulation_repository import SimulationRepository
from ..schemas.simulation import SimulationRequest

class SimulationService:
    def __init__(self, db: Session):
        self.simulation_repo = SimulationRepository(db)
        self.mock_data_path = os.path.join(
            os.path.dirname(__file__), "../../contracts/simulate.mock.json"
        )

    def run_simulation(self, user_id: str, payload: SimulationRequest) -> Dict[str, Any]:
        """
        Runs the simulation.
        Day 1 logic: Fetches mock, persists it, and returns it with a valid DB ID.
        """
        if not os.path.exists(self.mock_data_path):
            raise FileNotFoundError(f"Mock data not found at {self.mock_data_path}")

        with open(self.mock_data_path, "r") as f:
            full_response = json.load(f)

        # Create the simulation record in DB
        db_simulation = self.simulation_repo.create(
            user_id=user_id,
            raw_input=payload.model_dump(),
            result=full_response["simulation"]
        )

        # Inject the actual database UUID into the response so frontend can link to it
        full_response["simulation"]["simulation_id"] = str(db_simulation.id)

        return full_response
