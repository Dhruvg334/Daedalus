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
    context = sim_data.get("simulation", {}) if sim_data else {}

    # Render/backend restarts can clear the in-memory simulation cache while the
    # frontend still has the simulation in localStorage. Accept the client-supplied
    # context as a resilience path instead of returning a hard 404.
    if payload.context_overrides:
        context.update(payload.context_overrides)

    try:
        content = await ai_service.generate_automation(
            payload.automation_type,
            context,
            payload.additional_instructions
        )
        metadata = {"context_source": "cache" if sim_data else "client_or_fallback"}
        return AutomationResponse(content=content, metadata=metadata)
    except Exception:
        return AutomationResponse(
            content="This generated asset is temporarily unavailable. Your dashboard, sprint, and roadmap remain available. Please retry in a few seconds.",
            metadata={"context_source": "fallback"},
        )
