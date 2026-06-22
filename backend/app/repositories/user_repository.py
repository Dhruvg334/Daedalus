from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..models.user import User
from ..core.security import get_password_hash

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create(self, email: str, password: str, full_name: Optional[str] = None) -> User:
        db_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
