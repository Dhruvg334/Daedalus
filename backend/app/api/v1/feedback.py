from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.feedback import FeedbackCreate, FeedbackResponse
from ...repositories.feedback_repository import FeedbackRepository
from ..deps import get_current_user
from ...models.user import User

router = APIRouter()

@router.post("/", response_model=FeedbackResponse)
async def create_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = FeedbackRepository(db)
    repo.create(
        simulation_id=feedback_in.simulation_id,
        rating=feedback_in.rating,
        comment=feedback_in.comment
    )
    return {"success": True, "message": "Feedback submitted successfully"}
