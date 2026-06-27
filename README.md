# Daedalus

Daedalus is an AI-powered career navigation platform that helps users compare future career paths, understand skill gaps, analyze AI exposure, and convert career uncertainty into a practical action plan.

It is built as a structured career decision system, not a generic chatbot. A user completes a guided profile, Daedalus generates a career simulation, and the product presents the result through a dashboard, comparison layer, learning roadmap, opportunity hub, 7-day sprint, and traceable recommendation pipeline.

## Product Snapshot

| Area | Details |
|---|---|
| Product type | AI career navigation and decision platform |
| Core user | Students and early professionals exploring AI-era career paths |
| Main outcome | Personalized career options, skill gaps, AI exposure, roadmap, and sprint plan |
| Frontend | Next.js, React, Tailwind CSS, Radix UI, Framer Motion |
| Backend | FastAPI, Pydantic, SQLAlchemy, SQLite, optional Gemini assistant |
| Deployment | Frontend on Vercel; backend deployable as a Python/FastAPI service |

## Key Features

- Guided career profile onboarding
- Demo persona flow for instant product exploration
- AI-era career simulation with three recommended paths
- Career dashboard with fit, confidence, growth, difficulty, and AI exposure signals
- Career detail pages with human advantage and AI exposure breakdowns
- Side-by-side comparison matrix
- Skill mapping and priority gap analysis
- Learning hub and opportunity recommendations
- 7-day action sprint with progress tracking
- Shareable report page
- Trace view explaining how the recommendation pipeline works
- Optional assistant drawer with offline fallback if no AI key is configured
- Local dashboard resume flow after a user returns to the home page

## Team

| Member | Responsibility |
|---|---|
| Akshhaya Isa | Frontend |
| Pavit Agrawal | Backend |
| Dhruv Gupta | Integration, deployment, testing, and final product packaging |

## Repository Structure

```text
Daedalus/
├── frontend/              # Next.js app
├── backend/               # FastAPI app
├── docs/                  # Architecture, API, deployment, and testing docs
├── README.md              # Product and setup overview
└── .gitignore
```

## Local Setup

### 1. Backend

Use Python 3.11 or 3.12. Avoid Python 3.14 for this backend because some compiled Python packages may not support it cleanly yet.

```bash
cd backend
python -m venv .venv
```

Windows CMD:

```cmd
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create env file:

```bash
cp .env.example .env
```

Windows CMD:

```cmd
copy .env.example .env
```

Run backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Health check:

```text
http://localhost:8000/api/v1/health
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create env file:

```bash
cp .env.example .env.local
```

Windows CMD:

```cmd
copy .env.example .env.local
```

Run frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Required Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Backend

```env
PROJECT_NAME=Daedalus API
VERSION=1.0.0
API_V1_STR=/api/v1
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Optional:

```env
GOOGLE_API_KEY=<your-key>
```

If `GOOGLE_API_KEY` is absent, the assistant uses safe fallback responses and the core product flow still works.

## Main User Flow

```text
Home
  → Onboarding or Demo Personas
  → Loading
  → Dashboard
  → Career Detail / Comparison / Skills / Learning / Opportunities / Sprint / Trace / Share
```

Recommended demo flow:

```text
Home → Demo Personas → Aarav / Maya → Loading → Dashboard → Sprint → Trace → Share
```

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Backend health check |
| GET | `/api/v1/demo-personas` | Preset profiles |
| POST | `/api/v1/simulate` | Main career simulation |
| GET | `/api/v1/simulations/{simulation_id}` | Fetch cached simulation |
| POST | `/api/v1/hubs/opportunities` | Opportunity recommendations |
| GET | `/api/v1/hubs/learning-path/{career_id}` | Learning resources |
| GET | `/api/v1/progress/{simulation_id}` | Progress state |
| POST | `/api/v1/progress/update` | Update progress |
| POST | `/api/v1/assistant/chat` | Optional assistant chat |
| POST | `/api/v1/assistant/automate` | Optional generated assets |
| POST | `/api/v1/feedback` | Feedback capture |

See [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md) for request/response details.

## Build and Verification

Frontend production build:

```bash
cd frontend
npm run build
```

Backend smoke test:

```bash
cd backend
python scripts/test_api_flow.py
```

Manual product test checklist is available in [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md).

## Deployment

Deployment instructions are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

Important deployment rule:

1. Deploy backend first.
2. Copy backend URL.
3. Set `NEXT_PUBLIC_API_BASE_URL` in frontend deployment.
4. Redeploy frontend.

## Current Status

Daedalus has a complete end-to-end MVP flow: onboarding, demo profiles, simulation, dashboard, detail pages, learning/opportunity modules, progress tracking, sprint, trace view, and share page.

The current backend uses SQLite and in-memory/cached simulation behavior where applicable. This is acceptable for the current product version but should be replaced with durable persistence before a production-grade multi-user release.

