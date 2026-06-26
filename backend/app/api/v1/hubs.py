from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.hubs import OpportunityResponse, OpportunityRequest, LearningHubResponse
from ...services.opportunity_service import OpportunityService
from ...services.learning_service import LearningService
from ...services.simulation_service import SimulationService

router = APIRouter()
opp_service = OpportunityService()
learn_service = LearningService()

@router.post("/opportunities", response_model=OpportunityResponse)
async def get_opportunities(
    payload: OpportunityRequest,
    db: Session = Depends(get_db)
):
    # Fetch profile for advanced filtering if needed
    sim_data = SimulationService.get_cached_simulation(payload.simulation_id)
    profile = sim_data.get("simulation", {}).get("student_summary", {}) if sim_data else None

    opps = opp_service.get_relevant_opportunities(payload.career_id, profile)
    return OpportunityResponse(opportunities=opps)

@router.get("/learning-path/{career_id}", response_model=LearningHubResponse)
async def get_learning_path(
    career_id: str,
    db: Session = Depends(get_db)
):
    resources = learn_service.get_learning_path(career_id)
    return LearningHubResponse(
        resources=resources,
        progress=25.0, # Mock progress
        streak=3       # Mock streak
    )
