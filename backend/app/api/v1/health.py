from fastapi import APIRouter
from ...core.config import settings

router = APIRouter()

@router.get("")
@router.get("/")
@router.get("/health")
async def health_check():
    return {
        "success": True,
        "status": "ok",
        "service": "daedalus-backend",
        "version": settings.VERSION,
        "environment": "development",
    }
