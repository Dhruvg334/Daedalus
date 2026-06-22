from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from ...core.database import get_db
from ...schemas.simulation import SimulationResponse, SimulationResult
from ...repositories.simulation_repository import SimulationRepository
from ..deps import get_current_user
from ...models.user import User

router = APIRouter()

@router.get("/", response_model=List[SimulationResult])
async def list_simulations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = SimulationRepository(db)
    sims = repo.get_multi_by_user(current_user.id)
    return [s.result_json for s in sims]

@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(
    simulation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = SimulationRepository(db)
    simulation = repo.get(simulation_id)

    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")

    if simulation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this simulation")

    return {
        "success": True,
        "simulation": simulation.result_json
    }
