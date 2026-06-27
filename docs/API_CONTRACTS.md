# Daedalus API Contracts

Base URL in local development:

```text
http://localhost:8000
```

Frontend environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Standard Error Shape

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Unexpected server error. Please try again.",
    "details": null
  }
}
```

Some FastAPI validation errors may return `detail`; the frontend API client normalizes these into readable messages.

---

## GET `/api/v1/health`

Purpose: verify backend availability.

Response:

```json
{
  "success": true,
  "status": "ok",
  "service": "daedalus-backend",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## GET `/api/v1/demo-personas`

Purpose: return preset user profiles for instant product exploration.

Response shape:

```json
{
  "success": true,
  "personas": [
    {
      "persona_id": "aarav_ai_builder",
      "name": "Aarav",
      "age": 16,
      "headline": "Likes coding, business, and YouTube but worries AI may replace software jobs.",
      "interests": ["coding", "business"],
      "favorite_subjects": ["Computer Science", "Mathematics"],
      "current_skills": ["basic Python", "public speaking"],
      "career_fears": ["AI replacing coders"],
      "work_style": "builder",
      "weekly_time_available": "5-7 hours"
    }
  ]
}
```

---

## POST `/api/v1/simulate`

Purpose: generate the complete career simulation.

Request:

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
    "career_fears": ["AI replacing coders"],
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

Response top-level shape:

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

Frontend pages depend on the following stable fields:

```text
simulation.simulation_id
simulation.student_summary
simulation.career_paths
simulation.comparison.recommended_path_id
simulation.skill_gap_analysis
simulation.action_sprint
simulation.trace
```

---

## GET `/api/v1/simulations/{simulation_id}`

Purpose: fetch a generated simulation by ID when backend runtime cache/persistence is available.

Note: frontend localStorage remains the primary UX fallback for dashboard restoration.

---

## POST `/api/v1/hubs/opportunities`

Request:

```json
{
  "career_id": "ai_product_designer",
  "simulation_id": "sim_123"
}
```

Purpose: return opportunities relevant to the recommended career path.

---

## GET `/api/v1/hubs/learning-path/{career_id}`

Purpose: return resources and learning recommendations for a career path.

---

## GET `/api/v1/progress/{simulation_id}`

Purpose: return sprint/resource progress state.

---

## POST `/api/v1/progress/update`

Request:

```json
{
  "simulation_id": "sim_123",
  "task_id": "day_1",
  "hours": 1
}
```

Purpose: update sprint, learning, or skill progress.

---

## POST `/api/v1/assistant/chat`

Request:

```json
{
  "simulation_id": "sim_123",
  "messages": [
    { "role": "user", "content": "What should I do first?" }
  ]
}
```

Purpose: optional assistant chat. If no live Gemini configuration exists, backend returns a safe fallback response instead of crashing.

---

## POST `/api/v1/assistant/automate`

Request:

```json
{
  "simulation_id": "sim_123",
  "automation_type": "resume",
  "additional_instructions": "Make it concise."
}
```

Purpose: optional generation of career artifacts.

---

## POST `/api/v1/feedback`

Purpose: collect product feedback.

Request:

```json
{
  "simulation_id": "sim_123",
  "rating": 5,
  "felt_accurate": true,
  "comment": "Useful path breakdown.",
  "selected_career_id": "ai_product_designer"
}
```
