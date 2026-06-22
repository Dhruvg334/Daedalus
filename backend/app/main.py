from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import auth, health, demo_personas, simulate, simulations, feedback
from .core.config import settings
from .core.database import Base, engine
from .models import user, simulation, persona, feedback as feedback_model

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
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
    return {"message": "Welcome to Daedalus API. Visit /docs for documentation."}
