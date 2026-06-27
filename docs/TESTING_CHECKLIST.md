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
| `GET /api/v1/health` | 200, `success: true` |
| `GET /api/v1/demo-personas` | 200, personas array |
| `POST /api/v1/simulate` with valid profile | 200, 3 career paths |
| `GET /api/v1/simulations/{id}` after simulation | 200, same simulation where cache is available |
| `GET /api/v1/progress/{id}` | 200, progress object |
| `POST /api/v1/progress/update` | 200, updated progress |
| `GET /api/v1/hubs/learning-path/{career_id}` | 200, resources array |
| `POST /api/v1/hubs/opportunities` | 200, opportunities array |
| `POST /api/v1/assistant/chat` | 200 fallback or live assistant response |

## Frontend Flow Tests

### Demo Persona Flow

```text
Home → Demo Personas → Select Persona → Loading → Dashboard
```

Open these modules from Dashboard:

- Career Detail
- Comparison
- Skills
- Learning
- Opportunities
- Sprint
- Trace
- Share

### Manual Onboarding Flow

Minimum valid input:

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

### Validation and Recovery

| Case | Expected |
|---|---|
| Name `n` | blocked |
| No interest | blocked |
| Interest typed but not submitted | captured on Continue |
| Comma-separated interests | converted into tags |
| No skill | blocked |
| No career concern | blocked |
| Backend slow or waking up | readable recovery message with Retry button |
| Assistant unavailable | graceful fallback response |

### Dashboard Resume Flow

1. Complete one simulation.
2. Return to home page.
3. Confirm Continue appears.
4. Click Continue.
5. Confirm previous dashboard opens.

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
