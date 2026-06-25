# Daedalus — AI-Era Career Navigation

> Stop asking what job AI will take. Start discovering what future you can build.

Daedalus is a visual career decision cockpit for students. It generates three personalized career paths with AI exposure analysis, skill gap mapping, and a 7-day action sprint.

---

## Pages

| Route | Page |
|---|---|
| `/` | Landing page |
| `/demo-personas` | Demo persona selector (judge-friendly) |
| `/onboarding` | Multi-step student profile quiz |
| `/loading` | Simulation loading with animated pipeline steps |
| `/dashboard/[simulationId]` | Career comparison dashboard |
| `/career/[simulationId]/[careerId]` | Career detail page |
| `/skills/[simulationId]` | Skill gap matrix |
| `/sprint/[simulationId]` | 7-day action sprint checklist |
| `/share/[simulationId]` | Export/share career map |
| `/trace/[simulationId]` | AI pipeline trace (for judges) |
| `/error-page` | Error fallback page |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: DM Sans (display), Inter (body), JetBrains Mono (code)
- **Icons**: Lucide React
- **Theme**: Frosty white glassmorphism with silver/blue accents

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Backend Integration

Set in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

All API calls should go through `src/services/api.ts`.

Core endpoint: `POST /api/v1/simulate`

---

## Design System

- **Base**: Frosty white glassmorphism (`rgba(255,255,255,0.55)` + `backdrop-filter: blur`)
- **Accent**: Electric blue `#7b9ef8` / Indigo `#4f6ef7`
- **Success**: Emerald `#10b981`
- **Warning**: Amber `#f59e0b`
- **Background**: Soft blue-white gradient with floating orbs

---

## Team

- **Dhruv** — Integration & Deployment
- **Akshhaya** — Frontend
- **Pavit** — Backend
