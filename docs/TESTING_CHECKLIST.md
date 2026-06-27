# Daedalus Testing Checklist

## Local Startup

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Backend Smoke Tests

| Test | Expected |
|---|---|
| `GET /api/v1/health` | 200, success true |
| `GET /api/v1/demo-personas` | 200, personas array |
| `POST /api/v1/simulate` with valid profile | 200, 3 career paths |
| `GET /api/v1/simulations/{id}` after simulation | 200, same simulation |
| `GET /api/v1/progress/{id}` | 200, progress object |
| `POST /api/v1/progress/update` | 200, updated progress |
| `GET /api/v1/hubs/learning-path/{career_id}` | 200, resources array |
| `POST /api/v1/hubs/opportunities` | 200, opportunities array |
| `POST /api/v1/assistant/chat` | 200 fallback or live AI response |

## Frontend Flow Tests

### Demo Persona Flow

1. Open home page.
2. Click Demo Personas.
3. Select a persona.
4. Confirm Loading page appears.
5. Confirm Dashboard appears.
6. Open all linked modules from Dashboard.

Expected modules:

- Career Detail
- Comparison
- Skills
- Learning
- Opportunities
- Sprint
- Trace
- Share
- Decision Lab / Simulations if visible

### Manual Onboarding Flow

Use minimum valid input:

```text
Name: Dhruv
Interest: AI
Subject: Computer Science
Skill: Python
Work style: Building
Fear: Automation
Weekly time: 5-7 hours
```

Expected: user reaches dashboard.

### Validation Edge Cases

| Input | Expected |
|---|---|
| Name `n` | blocked |
| No interest | blocked |
| Interest typed but not pressed Enter | auto-captured on Continue |
| Comma-separated interests | converted into tags |
| No skill | blocked |
| No career concern | blocked |
| Backend offline | readable error, no white-screen crash |

### Dashboard Resume Flow

1. Complete one simulation.
2. Go back to home page.
3. Confirm Continue Dashboard appears.
4. Click it.
5. Confirm previous dashboard opens.

### Hydration / Runtime Checks

Open browser console and confirm there are no errors for:

- Nested `<div>` inside `<p>`
- Direct `params.simulationId` access
- Missing Radix dependencies
- Missing Tailwind animation plugin
- Google font build failure

## Production Build Checks

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
python -m compileall app
python scripts/test_api_flow.py
```
