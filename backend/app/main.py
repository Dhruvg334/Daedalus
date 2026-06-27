import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.v1 import assistant, demo_personas, feedback, health, hubs, progress, simulate, simulations
from .core.config import settings
from .core.database import Base, engine

# Explicit model imports keep SQLite table creation deterministic.
from .models.feedback import Feedback  # noqa: F401
from .models.persona import DemoPersona  # noqa: F401
from .models.progress import UserProgress  # noqa: F401
from .models.simulation import Simulation  # noqa: F401
from .models.user import User  # noqa: F401


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.exception("Unhandled backend error")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "Daedalus encountered a temporary backend issue. Please retry in a few seconds.",
                "details": None if settings.ENVIRONMENT == "production" else str(exc),
            },
        },
    )


# CORS notes:
# - Exact origins are normalized in config.py, including removal of trailing slashes.
# - Vercel preview/custom app URLs are allowed through regex so production does not
#   need ALLOWED_ORIGINS='*'.
# - allow_credentials stays False so wildcard/regex behavior remains valid.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=(
        r"^https://([a-zA-Z0-9-]+\.)*vercel\.app$|"
        r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"
    ),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)


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
    Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"success": True, "message": "Daedalus API is online", "docs": "/docs"}
