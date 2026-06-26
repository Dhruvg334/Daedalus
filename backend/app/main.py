import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import health, demo_personas, simulate, simulations, feedback, assistant, hubs, progress
from .core.config import settings
from .core.database import Base, engine

# THE LOGICAL END: Explicitly import models to guarantee SQLite table creation
from .models.user import User
from .models.simulation import Simulation
from .models.persona import DemoPersona
from .models.feedback import Feedback
from .models.progress import UserProgress

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Global error handler: keep responses stable for the frontend and avoid leaking internals.
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.exception("Unhandled backend error")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "Unexpected server error. Please try again.",
                "details": str(exc),
            },
        },
    )

# CORS is environment-driven so local and deployed frontends can be configured safely.
import re as _re

def _is_dev_origin(origin: str) -> bool:
    """Accept any localhost/127.0.0.1 origin in development."""
    return bool(_re.match(r"https?://(localhost|127\.0\.0\.1)(:\d+)?$", origin or ""))

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(demo_personas.router, prefix=f"{settings.API_V1_STR}/demo-personas", tags=["demo-personas"])
app.include_router(simulate.router, prefix=f"{settings.API_V1_STR}/simulate", tags=["simulate"])
app.include_router(simulations.router, prefix=f"{settings.API_V1_STR}/simulations", tags=["simulations"])
app.include_router(feedback.router, prefix=f"{settings.API_V1_STR}/feedback", tags=["feedback"])
app.include_router(assistant.router, prefix=f"{settings.API_V1_STR}/assistant", tags=["assistant"])
app.include_router(hubs.router, prefix=f"{settings.API_V1_STR}/hubs", tags=["hubs"])
app.include_router(progress.router, prefix=f"{settings.API_V1_STR}/progress", tags=["progress"])


@app.on_event("startup")
def create_tables_on_startup():
    # Create SQLite tables after the app object is built so import/startup remains lighter.
    Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"success": True, "message": "Daedalus API is online", "docs": "/docs"}
