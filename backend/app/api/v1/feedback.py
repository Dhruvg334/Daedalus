from fastapi import APIRouter
from ...schemas.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter()

@router.post("", response_model=FeedbackResponse)
@router.post("/", response_model=FeedbackResponse)
async def create_feedback(feedback_in: FeedbackCreate):
    return {"success": True, "message": "Feedback recorded."}
