# Daedalus Backend API

Production-grade FastAPI skeleton for AI-powered Career Simulation.

## Tech Stack
- **FastAPI** (Async API)
- **SQLAlchemy 2.0** (ORM)
- **PostgreSQL** (Database)
- **Pydantic v2** (Validation)
- **JWT** (Authentication)
- **Docker** (Containerization)

## Project Structure
```text
backend/
├── app/
│   ├── api/            # API Route handlers
│   ├── core/           # Config, Security, Database setup
│   ├── models/         # SQLAlchemy Models
│   ├── schemas/        # Pydantic Schemas
│   └── main.py         # App entry point
├── contracts/          # API Contract Mocks
├── Dockerfile          # Container config
└── docker-compose.yml  # Local dev environment
```

## Quick Start (Docker - Recommended)
1. **Clone and Navigate**:
   ```bash
   cd backend
   ```
2. **Launch with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   The API will be available at `http://localhost:8000`.
   Interactive docs: `http://localhost:8000/docs`.

## Local Setup (Without Docker)
1. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Update DATABASE_URL if using local Postgres or SQLite
   ```
4. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Alembic Migrations
To initialize and run migrations:
```bash
alembic init alembic
# Update alembic.ini with your DATABASE_URL
# In alembic/env.py, import Base from app.core.database and set target_metadata = Base.metadata

alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## API Endpoints
- **Health**: `GET /api/v1/health`
- **Auth**:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me` (Protected)
- **Demos**: `GET /api/v1/demo-personas`
- **Simulate**: `POST /api/v1/simulate` (Protected)
