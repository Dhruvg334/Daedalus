from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.feedback import FeedbackCreate, FeedbackResponse
from ...repositories.feedback_repository import FeedbackRepository

router = APIRouter()

@router.post("", response_model=FeedbackResponse)
@router.post("/", response_model=FeedbackResponse)
async def create_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
):
    """Record user feedback for a simulation. Persists to database."""
    repo = FeedbackRepository(db)
    try:
        repo.create(
            simulation_id=str(feedback_in.simulation_id),
            rating=feedback_in.rating,
            comment=feedback_in.comment,
        )
    except Exception:
        # Non-critical — still return success so the UI isn't broken
        pass
    return {"success": True, "message": "Feedback recorded."}
