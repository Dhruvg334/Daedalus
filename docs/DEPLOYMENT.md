# Daedalus Deployment Guide

## Current Deployment Shape

| Service | Platform | Root Directory |
|---|---|---|
| Frontend | Vercel | `frontend` |
| Backend | Render | `backend` |

The public product is accessed through the frontend. The backend is consumed by the frontend and is not listed publicly in the README.

## Backend on Render

Recommended settings:

| Setting | Value |
|---|---|
| Runtime | Python 3 |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/api/v1/health` |

Environment variables:

```env
PYTHON_VERSION=3.12.8
ENVIRONMENT=production
ALLOWED_ORIGINS=https://daedalus-iota.vercel.app
LOG_LEVEL=info
```

Optional:

```env
GOOGLE_API_KEY=<your-key>
```

If the backend appears unavailable after a quiet period, open the health endpoint once to wake the service, then retry the frontend flow.

## Frontend on Vercel

Recommended settings:

| Setting | Value |
|---|---|
| Framework | Next.js |
| Root Directory | `frontend` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | Leave empty |

Environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=<private-render-backend-url>
```

Do not add a trailing slash to the backend URL.

## Production Verification

Test in this order:

```text
Home → Demo Personas → Loading → Dashboard → Career Detail → Skills → Learning → Opportunities → Sprint → Trace → Share → Home → Continue
```

Then test manual onboarding with a minimal valid profile.
