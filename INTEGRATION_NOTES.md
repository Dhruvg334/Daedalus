# Daedalus Integration Notes

## What changed in this patch

- Added root `.gitignore` to keep dependencies, build output, local databases, caches, and secrets out of Git.
- Made the MVP backend API public for simulation/demo flows. Auth files remain in the repo, but core product routes no longer require a bearer token.
- Standardized core API responses around the frozen frontend/backend contract.
- Added deterministic backend career simulation with 3 ranked career paths, skill gaps, action sprint, and trace output.
- Added frontend API client and shared TypeScript types.
- Connected onboarding and demo persona flows to the backend `/api/v1/simulate` endpoint.
- Replaced static dashboard/skills/sprint/share/trace output with local-storage-backed simulation rendering.
- Added the missing career detail route: `/career/[simulationId]/[careerId]`.

## Local run

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open frontend at `http://localhost:3000` and backend docs at `http://localhost:8000/docs`.

## Critical product decision

For the MVP, the product now depends on one main backend contract: `POST /api/v1/simulate`.
This keeps integration stable and reduces frontend/backend breakage risk.
