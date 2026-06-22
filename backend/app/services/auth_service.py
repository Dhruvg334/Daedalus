from typing import Optional
from sqlalchemy.orm import Session
from ..repositories.user_repository import UserRepository
from ..core import security
from ..models.user import User

class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def authenticate(self, email: str, password: str) -> Optional[User]:
        user = self.user_repo.get_by_email(email)
        if not user:
            return None
        if not security.verify_password(password, user.hashed_password):
            return None
        return user

    def register_user(self, email: str, password: str, full_name: Optional[str] = None) -> User:
        return self.user_repo.create(email, password, full_name)
