# Daedalus Architecture

## High-Level Flow

```text
User profile input
  ↓
Next.js onboarding / demo persona flow
  ↓
FastAPI simulation endpoint
  ↓
Profile normalization
  ↓
Career dataset + scoring logic
  ↓
Structured simulation response
  ↓
Dashboard, comparison, skills, sprint, learning, opportunities, trace, share
```

## Frontend Architecture

The frontend is a Next.js App Router application.

Key areas:

| Area | Location | Purpose |
|---|---|---|
| Landing | `frontend/app/page.tsx` | Product entry and resume-dashboard CTA |
| Onboarding | `frontend/app/onboarding/page.tsx` | Profile collection and validation |
| Loading | `frontend/app/loading/page.tsx` | Runs simulation request and saves result |
| Dashboard | `frontend/app/dashboard/[simulationId]/page.tsx` | Main career operating system view |
| Detail pages | `frontend/app/*/[simulationId]/page.tsx` | Skills, sprint, learning, opportunities, trace, share |
| API client | `frontend/lib/api.ts` | Centralized backend communication |
| Local state | `frontend/lib/simulation-store.ts` | Stores active simulations in localStorage |
| Shared types | `frontend/lib/types.ts` | Frontend-side API/data contracts |

## Backend Architecture

The backend is a FastAPI service.

Key areas:

| Area | Location | Purpose |
|---|---|---|
| App entry | `backend/app/main.py` | FastAPI app, CORS, routers, error handling |
| Vercel entry | `backend/index.py` | Exposes FastAPI app for Vercel Python runtime |
| Schemas | `backend/app/schemas/` | Pydantic request/response contracts |
| Services | `backend/app/services/` | Simulation, assistant, learning, opportunities |
| Models | `backend/app/models/` | SQLAlchemy tables |
| Database | `backend/app/core/database.py` | SQLite engine and session management |
| API routes | `backend/app/api/v1/` | Versioned HTTP endpoints |

## Critical Integration Decision

The main product is centered on one primary endpoint:

```http
POST /api/v1/simulate
```

This endpoint returns the simulation object used by most frontend pages. That keeps the frontend/backend contract stable and avoids feature fragmentation.

## Persistence Strategy

Current version:

- Frontend stores the active simulation in localStorage.
- Backend can cache/fetch simulations during active runtime.
- SQLite is used for supporting data such as progress/feedback where applicable.

Production-grade future version:

- Replace local SQLite with Postgres/Supabase/Neon.
- Store simulations durably by user/session.
- Add auth only after the core product flow remains stable.

## Performance Notes

The landing animation is lazy-loaded and uses a CSS fallback first. This avoids blocking the first page render on WebGL-heavy visual effects.

The dashboard renders the simulation first and hydrates optional learning/opportunity modules afterward. This avoids blocking the main user result on secondary modules.
