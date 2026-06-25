from fastapi import APIRouter
from ...schemas.persona import DemoPersonasResponse
from ...services.simulation_service import DEMO_PERSONAS

router = APIRouter()

@router.get("", response_model=DemoPersonasResponse)
@router.get("/", response_model=DemoPersonasResponse)
async def get_demo_personas():
    return {"success": True, "personas": DEMO_PERSONAS}
