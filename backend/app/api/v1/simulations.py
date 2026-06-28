from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.simulation_service import SimulationService
from ...schemas.simulation import SimulationResponse
from ...repositories.simulation_repository import SimulationRepository

router = APIRouter()

@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(simulation_id: str, db: Session = Depends(get_db)):
    # 1. Check in-memory cache first (fastest)
    simulation = SimulationService.get_cached_simulation(simulation_id)
    if simulation:
        return {"success": True, "simulation": simulation}

    # 2. Fall back to database for simulations from previous sessions
    repo = SimulationRepository(db)
    db_sim = repo.get_by_simulation_id(simulation_id)
    if db_sim and db_sim.result_json:
        # Warm the cache so subsequent requests are fast
        SimulationService._cache[simulation_id] = db_sim.result_json
        return {"success": True, "simulation": db_sim.result_json}

    raise HTTPException(status_code=404, detail={
        "success": False,
        "error": {
            "code": "SIMULATION_NOT_FOUND",
            "message": "Simulation not found. Please run a new career simulation.",
            "details": None,
        },
    })
