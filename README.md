# Daedalus

**Daedalus** is an AI-powered career navigation platform that helps users make clearer, more informed career decisions in an AI-driven world.

Instead of giving generic career advice, Daedalus analyzes a user’s interests, skills, goals, work preferences, and career concerns to generate personalized career paths, compare future options, identify skill gaps, explain AI exposure, and recommend practical next steps.

The product is designed as a structured career decision system, not a chatbot. It combines profile analysis, career-path scoring, AI-generated explanations, skill-gap mapping, and action planning into a visual decision dashboard.

---

## Core Problem

Career planning is fragmented.

Most users rely on separate tools for:

* Career guidance
* Resume feedback
* Skill-gap analysis
* Interview preparation
* Learning roadmaps
* Job or internship discovery

This creates confusion, especially for users trying to understand how AI changes the future of work.

Daedalus addresses this by giving users a single structured view of:

* Which career paths fit them
* Why those paths fit
* What skills they already have
* What skills they need to build
* How AI affects each path
* What they should do next

---

## Product Vision

Daedalus helps users move from uncertainty to action.

The platform does not claim to choose a user’s future for them. Instead, it gives them a practical decision framework: multiple possible paths, visible tradeoffs, skill gaps, AI-readiness signals, and an actionable short-term plan.

The goal is to help users understand not only what careers they can pursue, but how those careers are changing because of AI.

---

## Key Features

### Career Profile Builder

Collects structured input about the user’s:

* Interests
* Favorite subjects
* Current skills
* Work style preferences
* Career concerns
* Goals
* Weekly time availability
* Optional profile text

This creates the foundation for personalized career recommendations.

---

### Personalized Career Path Simulation

Generates multiple career paths based on the user profile.

Each path includes:

* Career title
* Career cluster
* Fit score
* Difficulty score
* Growth potential score
* AI exposure score
* Why the path fits
* Required skills
* Matched skills
* Missing skills
* Starter project recommendation

---

### Career Comparison Dashboard

Provides a visual comparison of recommended career paths.

The dashboard helps users evaluate each option based on:

* Fit
* Difficulty
* AI exposure
* Growth potential
* Skill readiness
* First recommended project

This is the central decision-making view of the platform.

---

### AI Exposure Analysis

Explains how AI affects each career path.

For each path, Daedalus breaks down:

* Tasks where AI can assist heavily
* Tasks where humans still lead
* Areas of automation pressure
* Human advantages that remain valuable

This helps users understand how to adapt instead of simply fearing AI disruption.

---

### Skill Gap Mapping

Compares the user’s current skills against the skills required for each recommended career path.

The skill-gap module highlights:

* Existing strengths
* Highest-priority missing skills
* Skill relevance across career paths
* Recommended learning direction

---

### 7-Day Action Sprint

Turns career guidance into immediate execution.

Each user receives a short action plan with:

* Daily tasks
* Deliverables
* Expected final output
* Exploration-focused next steps

The aim is to move users from passive advice to practical experimentation.

---

### Demo Persona Flow

Includes preset user profiles for fast product demonstration and testing.

This allows the platform to show complete output flows without requiring manual onboarding every time.

---

### AI Pipeline Trace

Provides a transparent view of how the system processes a user profile.

The trace view can show:

* Profile normalization
* Career cluster selection
* Scoring logic
* AI generation steps
* Output checks
* Confidence labels

This helps make the system more explainable and less like a black-box AI assistant.

---

## System Architecture

Daedalus follows a frontend-backend architecture with a structured AI layer.

```text
User Input
   ↓
Frontend Onboarding Flow
   ↓
Backend API
   ↓
Profile Normalization
   ↓
Career Dataset / Knowledge Base
   ↓
Scoring Engine
   ↓
LLM Generation Layer
   ↓
Output Quality Checks
   ↓
Career Dashboard Response
```

---

## Tech Stack

### Frontend

* React / Next.js
* Tailwind CSS
* Responsive dashboard UI
* Client-side state handling
* API service layer

### Backend

* Python
* FastAPI
* Pydantic schemas
* Career scoring logic
* Structured JSON APIs
* LLM integration

### AI Layer

* Large Language Model for personalized explanations
* Structured prompt pipeline
* Career-path reasoning
* Skill-gap generation
* Action sprint generation
* Output validation and fallback handling

### Deployment

* Frontend deployment handled separately
* Backend deployment handled separately
* Environment-based API configuration
* Production API base URL support

---

## Core Pages

### Landing Page

Introduces Daedalus and explains the value proposition.

Main functions:

* Product introduction
* Call to action
* Career simulation entry point
* Demo persona entry point

---

### Demo Persona Page

Allows users or reviewers to select a predefined profile and instantly generate a complete career simulation.

Main functions:

* Display preset profiles
* Trigger simulation API
* Navigate to dashboard

---

### Onboarding Page

Collects the user’s career profile.

Main functions:

* Multi-step profile form
* Input validation
* Local form state
* Submit profile to backend

---

### Loading Page

Displays the simulation process while the backend generates recommendations.

Main functions:

* Show progress states
* Handle pending API response
* Handle errors and retries

---

### Career Dashboard

Displays the main recommendation output.

Main functions:

* Show personalized career paths
* Compare paths visually
* Display fit scores
* Display AI exposure
* Display skill gaps
* Navigate to detailed pages

---

### Career Detail Page

Provides a deep dive into one career path.

Main functions:

* Explain why the path fits
* Show day-in-the-life summary
* Show required skills
* Show AI exposure breakdown
* Show starter project
* Show learning roadmap

---

### Skill Gap Page

Shows current skills, missing skills, and roadmap priorities.

Main functions:

* Skill matrix
* Priority gaps
* Career-specific skill relevance
* Learning roadmap display

---

### 7-Day Sprint Page

Provides a short action plan.

Main functions:

* Day-by-day tasks
* Deliverables
* Checklist-style progression
* Final expected output

---

### Share Summary Page

Creates a clean summary of the user’s career map.

Main functions:

* Printable/shareable career summary
* Top career recommendation
* Skill gaps
* Action sprint summary

---

### Trace Page

Shows the AI pipeline and recommendation logic.

Main functions:

* Display pipeline steps
* Show scoring explanation
* Show quality checks
* Show structured response preview

---

## API Overview

The frontend and backend communicate through a small set of stable API contracts.

### Health Check

```http
GET /api/v1/health
```

Checks backend availability.

---

### Demo Personas

```http
GET /api/v1/demo-personas
```

Returns preset user profiles.

---

### Career Simulation

```http
POST /api/v1/simulate
```

Main endpoint for generating the complete career simulation.

The response includes:

* Student summary
* Career paths
* Comparison dashboard data
* Skill-gap analysis
* 7-day action sprint
* AI pipeline trace

---

### Optional Simulation Fetch

```http
GET /api/v1/simulations/{simulation_id}
```

Fetches a previously generated simulation if persistence is enabled.

---

### Optional Feedback

```http
POST /api/v1/feedback
```

Collects user feedback on recommendation quality.

---

## Example Simulation Request

```json
{
  "student_profile": {
    "name": "Aarav",
    "age": 16,
    "education_stage": "high_school",
    "location": "India",
    "interests": ["coding", "business", "content creation"],
    "favorite_subjects": ["Computer Science", "Mathematics", "Economics"],
    "current_skills": ["basic Python", "Canva", "public speaking"],
    "work_style_preferences": ["building", "creative", "independent"],
    "career_fears": ["AI replacing coders", "choosing the wrong career"],
    "dream_careers": ["software engineer", "startup founder"],
    "disliked_careers": ["pure theory research"],
    "weekly_time_available": "5-7 hours",
    "optional_profile_text": "I have built small school projects and like explaining tech to friends."
  },
  "options": {
    "include_trace": true,
    "include_demo_fallback": true,
    "preferred_number_of_paths": 3
  }
}
```

---

## Example Simulation Response Shape

```json
{
  "success": true,
  "simulation": {
    "simulation_id": "sim_001",
    "created_at": "2026-06-22T18:30:00Z",
    "student_summary": {
      "name": "Aarav",
      "profile_headline": "A builder-oriented student interested in coding, business, and content creation.",
      "dominant_interests": ["coding", "business", "content creation"],
      "strongest_existing_skills": ["basic Python", "public speaking"],
      "main_concerns": ["AI replacing coders", "choosing the wrong career"]
    },
    "career_paths": [],
    "comparison": {},
    "skill_gap_analysis": {},
    "action_sprint": {},
    "trace": {}
  }
}
```

---

## Team

### Akshhaya Isa

**Frontend**

Responsible for the user interface, page flows, dashboard components, responsive layout, and frontend API integration.

### Pavit Agrawal

**Backend**

Responsible for backend APIs, data models, scoring logic, LLM integration, structured responses, and backend reliability.

### Dhruv Gupta

**Integration, Deployment, and Testing**

Responsible for API contract coordination, frontend-backend integration, deployment, testing, demo readiness, documentation, and final product packaging.

---

## Development Philosophy

Daedalus is built around a simple principle:

**AI should not replace decision-making. It should make decision-making clearer.**

The system is designed to provide structure, comparison, explanation, and action. It avoids presenting career guidance as a final answer and instead helps users explore realistic paths with better context.

---

## Current Status

Core product design and API contracts are defined.

Planned implementation modules:

* Frontend page structure
* Backend API implementation
* Career dataset
* Career scoring engine
* LLM generation pipeline
* Dashboard integration
* Deployment
* Testing and polish

---

## Future Scope

Potential future additions:

* Resume analysis
* Portfolio analysis
* GitHub profile parsing
* Interview preparation
* Opportunity matching
* User accounts
* Saved simulations
* Mentor review mode
* Deeper career knowledge base
* Long-term learning progress tracking

These are intentionally excluded from the first product version to keep the core experience focused and reliable.

---

## License

License to be decided.