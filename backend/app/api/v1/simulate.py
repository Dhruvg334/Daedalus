from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.config import settings
from ...schemas.simulation import SimulationRequest, SimulationResponse
from ...services.simulation_service import SimulationService
from ...repositories.simulation_repository import SimulationRepository

router = APIRouter()

@router.post("", response_model=SimulationResponse)
@router.post("/", response_model=SimulationResponse)
async def simulate_career(
    payload: SimulationRequest,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    user = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            from jose import jwt
            import uuid
            from ...models.user import User
            payload_data = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user_id = uuid.UUID(payload_data.get("sub"))
            user = db.query(User).filter(User.id == user_id).first()
        except Exception:
            pass

    service = SimulationService(db)
    try:
        res = await service.run_simulation_async(payload)
        if res.get("success") and res.get("simulation"):
            sim_data = res["simulation"]
            repo = SimulationRepository(db)
            if user:
                repo.create(user.id, payload.model_dump(), sim_data)
            else:
                repo.create_anonymous(sim_data["simulation_id"], payload.model_dump(), sim_data)
        return res
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": {
                    "code": "SIMULATION_FAILED",
                    "message": "Unable to generate simulation. Please try again or use a demo persona.",
                    "details": str(e),
                },
            },
        )
