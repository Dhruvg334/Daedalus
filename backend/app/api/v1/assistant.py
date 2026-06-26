from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.assistant import AssistantChatRequest, AssistantChatResponse, AutomationRequest, AutomationResponse
from ...services.ai_service import AIService
from ...services.simulation_service import SimulationService

router = APIRouter()
ai_service = AIService()

@router.post("/chat", response_model=AssistantChatResponse)
async def chat_with_assistant(
    payload: AssistantChatRequest,
    db: Session = Depends(get_db)
):
    context = {}
    if payload.simulation_id:
        # Try to get from service cache first
        sim_data = SimulationService.get_cached_simulation(payload.simulation_id)
        if sim_data:
            context = sim_data.get("simulation", {})
        else:
            # Fallback to DB (would need to implement find_by_id in SimulationService or use repo)
            # For now, we'll rely on the service cache or context_overrides
            pass

    if payload.context_overrides:
        context.update(payload.context_overrides)

    try:
        response_text = await ai_service.get_chat_response(payload.messages, context)
        return AssistantChatResponse(
            content=response_text,
            suggested_actions=["Improve Resume", "View Skill Tree", "Start Sprint"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/automate", response_model=AutomationResponse)
async def run_automation(
    payload: AutomationRequest,
    db: Session = Depends(get_db)
):
    sim_data = SimulationService.get_cached_simulation(payload.simulation_id)
    if not sim_data:
        raise HTTPException(status_code=404, detail="Simulation not found")

    context = sim_data.get("simulation", {})

    try:
        content = await ai_service.generate_automation(
            payload.automation_type,
            context,
            payload.additional_instructions
        )
        return AutomationResponse(content=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
