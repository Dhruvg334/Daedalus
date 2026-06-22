import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import auth, health, demo_personas, simulate, simulations, feedback
from .core.config import settings
from .core.database import Base, engine

# THE LOGICAL END: Explicitly import models to guarantee SQLite table creation
from .models.user import User
from .models.simulation import Simulation
from .models.persona import DemoPersona
from .models.feedback import Feedback

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Global Error Handler: Reveals the actual error message if a 500 occurs
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"FATAL ERROR: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "error_type": type(exc).__name__}
    )

# Broad CORS for Hackathon: Ensures frontend integration is seamless
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(demo_personas.router, prefix=f"{settings.API_V1_STR}/demo-personas", tags=["demo-personas"])
app.include_router(simulate.router, prefix=f"{settings.API_V1_STR}/simulate", tags=["simulate"])
app.include_router(simulations.router, prefix=f"{settings.API_V1_STR}/simulations", tags=["simulations"])
app.include_router(feedback.router, prefix=f"{settings.API_V1_STR}/feedback", tags=["feedback"])

@app.get("/")
async def root():
    return {"message": "Daedalus API is Online. Go to /docs for testing."}
