from fastapi import APIRouter, HTTPException
from ...services.simulation_service import SimulationService
from ...schemas.simulation import SimulationResponse

router = APIRouter()

@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(simulation_id: str):
    simulation = SimulationService.get_cached_simulation(simulation_id)
    if not simulation:
        raise HTTPException(status_code=404, detail={
            "success": False,
            "error": {
                "code": "SIMULATION_NOT_FOUND",
                "message": "Simulation not found. Please run a new career simulation.",
                "details": None,
            },
        })
    return {"success": True, "simulation": simulation}
