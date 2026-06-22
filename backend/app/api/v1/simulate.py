from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.simulation import SimulationRequest, SimulationResponse
from ...services.simulation_service import SimulationService
from ..deps import get_current_user
from ...models.user import User

router = APIRouter()

@router.post("/", response_model=SimulationResponse)
async def simulate_career(
    payload: SimulationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Day 1: Returns a deterministic mock response from contracts/simulate.mock.json.
    Validates input and persists results.
    """
    service = SimulationService(db)
    try:
        result = service.run_simulation(current_user.id, payload)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")
