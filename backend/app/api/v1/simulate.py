from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.simulation import SimulationRequest, SimulationResponse
from ...services.simulation_service import SimulationService

router = APIRouter()

@router.post("", response_model=SimulationResponse)
@router.post("/", response_model=SimulationResponse)
async def simulate_career(
    payload: SimulationRequest,
    db: Session = Depends(get_db),
):
    service = SimulationService(db)
    try:
        return service.run_simulation(payload)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": {
                    "code": "SIMULATION_FAILED",
                    "message": "Unable to generate simulation. Please try again or use a demo persona.",
                    "details": str(e),
                },
            },
        )
