# Daedalus API Contracts

The frontend communicates with the backend through `NEXT_PUBLIC_API_BASE_URL`. The deployed backend URL is intentionally not documented publicly.

## Standard Error Shape

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Daedalus backend encountered a temporary issue. Please retry in a few seconds.",
    "details": null
  }
}
```

Validation errors may return FastAPI `detail`; the frontend normalizes those into readable messages.

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/demo-personas` | Preset user profiles |
| POST | `/api/v1/simulate` | Generate complete career simulation |
| GET | `/api/v1/simulations/{simulation_id}` | Retrieve cached simulation where available |
| POST | `/api/v1/hubs/opportunities` | Opportunity recommendations |
| GET | `/api/v1/hubs/learning-path/{career_id}` | Learning resources |
| GET | `/api/v1/progress/{simulation_id}` | Progress state |
| POST | `/api/v1/progress/update` | Progress update |
| POST | `/api/v1/assistant/chat` | Optional assistant chat |
| POST | `/api/v1/assistant/automate` | Optional generated assets |
| POST | `/api/v1/feedback` | Feedback capture |

## Main Simulation Request

```json
{
  "student_profile": {
    "name": "Aarav",
    "age": 16,
    "education_stage": "high_school",
    "location": "India",
    "interests": ["coding", "business"],
    "favorite_subjects": ["Computer Science"],
    "current_skills": ["basic Python"],
    "work_style_preferences": ["building"],
    "career_fears": ["AI replacing routine coding work"],
    "dream_careers": ["software engineer"],
    "disliked_careers": [],
    "weekly_time_available": "5-7 hours",
    "optional_profile_text": "I like building projects."
  },
  "options": {
    "include_trace": true,
    "include_demo_fallback": true,
    "preferred_number_of_paths": 3
  }
}
```

## Main Simulation Response Shape

```json
{
  "success": true,
  "simulation": {
    "simulation_id": "sim_123",
    "created_at": "2026-06-27T08:00:00Z",
    "student_summary": {},
    "career_paths": [],
    "comparison": {},
    "skill_gap_analysis": {},
    "action_sprint": {},
    "trace": {}
  }
}
```

Frontend pages depend on these stable fields:

```text
simulation.simulation_id
simulation.student_summary
simulation.career_paths
simulation.comparison.recommended_path_id
simulation.skill_gap_analysis
simulation.action_sprint
simulation.trace
```
