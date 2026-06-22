from sqlalchemy.orm import Session
from ..models.feedback import Feedback

class FeedbackRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, simulation_id: str, rating: int, comment: str = None) -> Feedback:
        db_obj = Feedback(
            simulation_id=simulation_id,
            rating=rating,
            comment=comment
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
