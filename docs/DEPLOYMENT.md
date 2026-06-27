# Daedalus Deployment Guide

## Recommended Deployment Shape

Deploy frontend and backend as two separate projects.

| Service | Recommended host | Root directory |
|---|---|---|
| Frontend | Vercel | `frontend` |
| Backend | Vercel Python / Render / Railway | `backend` |

Deploy backend first, then frontend.

---

## Backend Deployment

### Vercel Backend Settings

Import the same GitHub repo and use:

| Setting | Value |
|---|---|
| Project name | `daedalus-backend` |
| Root Directory | `backend` |
| Framework Preset | Other / Python |
| Build Command | leave empty unless Vercel requires default |
| Install Command | `pip install -r requirements.txt` |
| Output Directory | leave empty |

The backend includes:

```text
backend/index.py
backend/vercel.json
```

These expose the FastAPI app for Vercel's Python runtime.

### Backend Environment Variables

```env
PROJECT_NAME=Daedalus API
VERSION=1.0.0
API_V1_STR=/api/v1
ENVIRONMENT=production
ALLOWED_ORIGINS=https://<frontend-domain>.vercel.app
LOG_LEVEL=info
```

Optional:

```env
GOOGLE_API_KEY=<your-key>
```

First health test:

```text
https://<backend-domain>.vercel.app/api/v1/health
```

Expected:

```json
{
  "success": true,
  "status": "ok"
}
```

---

## Frontend Deployment

### Vercel Frontend Settings

Import the same GitHub repo again and use:

| Setting | Value |
|---|---|
| Project name | `daedalus` |
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | leave empty/default |

For Next.js, do not set Output Directory to `out` unless static export has explicitly been configured. This app should use Vercel's default `.next` output.

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://<backend-domain>.vercel.app
```

Redeploy the frontend after adding this variable.

---

## Deployment Test Order

1. Open backend health URL.
2. Open frontend URL.
3. Run demo persona flow.
4. Confirm dashboard loads.
5. Open Career Detail.
6. Open Skills.
7. Open Learning.
8. Open Opportunities.
9. Open Sprint.
10. Open Trace.
11. Open Share.
12. Return home and confirm Continue Dashboard appears.

---

## Known Deployment Notes

- Current backend uses SQLite; in production/serverless, database path falls back to `/tmp/daedalus.db`.
- Serverless `/tmp` is ephemeral. Do not treat it as durable persistence.
- Frontend localStorage restores the user's latest simulation for the current browser.
- Durable multi-user persistence should be added with Postgres/Supabase/Neon later.
