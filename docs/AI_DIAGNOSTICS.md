# Daedalus AI Diagnostics

Daedalus is designed to remain usable even when live Gemini generation is unavailable.

## How the recommendation system works

1. The backend normalizes the onboarding profile.
2. The deterministic scoring engine ranks the approved career library.
3. If `GOOGLE_API_KEY` is configured and the Gemini package is available, Gemini reranks the top approved career IDs only.
4. The backend returns a structured simulation object with trace metadata.
5. If Gemini fails, times out, or is not configured, the deterministic ranking remains the fallback.

## Check Gemini status

Use this endpoint on the backend service:

```text
GET /api/v1/assistant/status
```

Expected shape:

```json
{
  "success": true,
  "assistant": {
    "provider": "gemini",
    "package_available": true,
    "api_key_configured": true,
    "model_ready": true,
    "status_reason": "ready"
  },
  "message": "Gemini is ready."
}
```

If `model_ready` is false, check:

- `GOOGLE_API_KEY` exists on Render.
- `google-generativeai` is installed from `backend/requirements.txt`.
- Render was redeployed after adding the key.
- Render logs contain `daedalus.ai` messages.

## Render logging

Backend logs now emit messages under:

```text
daedalus.ai
daedalus.simulation
```

Useful signals:

- `Gemini configured successfully`
- `Gemini rerank completed`
- `Gemini rerank skipped`
- `Gemini rerank failed`
- `Gemini assistant response failed`

## User-facing fallback

Users should not see raw Gemini or stack-trace failures. If Gemini is unavailable, Daedalus continues with deterministic simulation, offline assistant responses, and generated fallback assets.
