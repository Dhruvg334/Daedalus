from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.persona import DemoPersona
from ...models.persona import DemoPersona as PersonaModel

router = APIRouter()

@router.get("/", response_model=List[DemoPersona])
async def get_demo_personas(db: Session = Depends(get_db)):
    """
    Fetches all preset demo personas from the database.
    """
    return db.query(PersonaModel).all()
