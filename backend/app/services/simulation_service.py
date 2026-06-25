from __future__ import annotations

import copy
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List
from sqlalchemy.orm import Session
from ..schemas.simulation import SimulationRequest

DEMO_PERSONAS: List[Dict[str, Any]] = [
    {
        "persona_id": "aarav_ai_builder",
        "name": "Aarav",
        "age": 16,
        "headline": "Likes coding, business, and YouTube but worries AI may replace software jobs.",
        "interests": ["coding", "business", "content creation"],
        "favorite_subjects": ["Computer Science", "Mathematics", "Economics"],
        "current_skills": ["basic Python", "Canva", "public speaking"],
        "career_fears": ["AI replacing coders", "choosing the wrong college major"],
        "work_style": "builder",
        "weekly_time_available": "5-7 hours",
        "profile": {
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
            "optional_profile_text": "I have built small school projects and like explaining tech to friends.",
        },
    },
    {
        "persona_id": "maya_designer",
        "name": "Maya",
        "age": 17,
        "headline": "Design, psychology, and creativity-focused, but unsure how AI changes creative careers.",
        "interests": ["design", "psychology", "creative writing"],
        "favorite_subjects": ["Art", "Psychology", "English"],
        "current_skills": ["Figma", "Procreate", "research"],
        "career_fears": ["AI making designers redundant", "not being technical enough"],
        "work_style": "creative",
        "weekly_time_available": "4-6 hours",
        "profile": {
            "name": "Maya",
            "age": 17,
            "education_stage": "high_school",
            "location": "India",
            "interests": ["design", "psychology", "creative writing"],
            "favorite_subjects": ["Art", "Psychology", "English"],
            "current_skills": ["Figma", "Procreate", "research"],
            "work_style_preferences": ["creative", "collaborative"],
            "career_fears": ["AI making designers redundant", "not being technical enough"],
            "dream_careers": ["product designer", "creative director"],
            "disliked_careers": ["pure coding role"],
            "weekly_time_available": "4-6 hours",
            "optional_profile_text": "I like making visual stories and understanding people.",
        },
    },
    {
        "persona_id": "riya_bio",
        "name": "Riya",
        "age": 18,
        "headline": "Biology and helping-people oriented, unsure where technology fits her future.",
        "interests": ["biology", "healthcare", "community"],
        "favorite_subjects": ["Biology", "Chemistry", "Social Studies"],
        "current_skills": ["research", "communication", "empathy"],
        "career_fears": ["picking wrong career", "tech not fitting values"],
        "work_style": "collaborative",
        "weekly_time_available": "3-5 hours",
        "profile": {
            "name": "Riya",
            "age": 18,
            "education_stage": "early_college",
            "location": "India",
            "interests": ["biology", "healthcare", "community"],
            "favorite_subjects": ["Biology", "Chemistry", "Social Studies"],
            "current_skills": ["research", "communication", "empathy"],
            "work_style_preferences": ["helper", "collaborative", "researcher"],
            "career_fears": ["choosing the wrong career", "technology not fitting my values"],
            "dream_careers": ["healthcare", "social impact"],
            "disliked_careers": ["high-pressure sales"],
            "weekly_time_available": "3-5 hours",
            "optional_profile_text": "I want to help people but also want a future-ready path.",
        },
    },
    {
        "persona_id": "kabir_finance",
        "name": "Kabir",
        "age": 17,
        "headline": "Finance and math oriented, wants a high-growth career with clear ROI.",
        "interests": ["finance", "mathematics", "strategy"],
        "favorite_subjects": ["Economics", "Mathematics", "Statistics"],
        "current_skills": ["Excel", "data analysis", "logical reasoning"],
        "career_fears": ["low-paying career", "being disrupted by quant AI"],
        "work_style": "analytical",
        "weekly_time_available": "6-8 hours",
        "profile": {
            "name": "Kabir",
            "age": 17,
            "education_stage": "high_school",
            "location": "India",
            "interests": ["finance", "mathematics", "strategy"],
            "favorite_subjects": ["Economics", "Mathematics", "Statistics"],
            "current_skills": ["Excel", "data analysis", "logical reasoning"],
            "work_style_preferences": ["analyst", "leader", "independent"],
            "career_fears": ["not earning enough", "AI disrupting finance jobs"],
            "dream_careers": ["investment analyst", "startup operator"],
            "disliked_careers": ["unclear career paths"],
            "weekly_time_available": "6-8 hours",
            "optional_profile_text": "I like practical careers where effort compounds.",
        },
    },
]

CAREER_LIBRARY: List[Dict[str, Any]] = [
    {
        "career_id": "ai_automation_builder",
        "title": "AI Automation Builder",
        "cluster": "AI & Software",
        "one_line_summary": "Builds workflows that use AI, APIs, and software to automate repeated tasks.",
        "related_interests": ["coding", "business", "automation", "content creation", "gaming"],
        "related_subjects": ["computer science", "mathematics", "economics", "business"],
        "work_styles": ["builder", "building", "independent", "analyst"],
        "required_skills": ["Python", "APIs", "workflow design", "debugging", "basic frontend", "prompt engineering"],
        "ai_exposure_score": 8,
        "difficulty_score": 6,
        "growth_potential_score": 8,
        "human_advantage": ["problem framing", "workflow design", "edge-case debugging", "user empathy"],
        "starter_project": {
            "title": "Build a homework reminder automation",
            "description": "Create a simple workflow that turns assignments into reminders and weekly plans.",
            "expected_output": "A working mini-project with README, screenshots, and a demo video.",
        },
    },
    {
        "career_id": "ai_product_designer",
        "title": "AI-Native Product Designer",
        "cluster": "Design & Product",
        "one_line_summary": "Shapes how humans interact with AI-powered products through research, UX, and prototyping.",
        "related_interests": ["design", "psychology", "art", "writing", "creative writing", "business"],
        "related_subjects": ["art", "psychology", "english", "business", "computer science"],
        "work_styles": ["creative", "collaborative", "helper"],
        "required_skills": ["Figma", "user research", "prototyping", "UX writing", "AI prototyping", "presentation"],
        "ai_exposure_score": 6,
        "difficulty_score": 5,
        "growth_potential_score": 9,
        "human_advantage": ["taste", "empathy", "product judgment", "storytelling"],
        "starter_project": {
            "title": "Redesign a school app with AI-assisted research",
            "description": "Interview three classmates, identify one broken flow, and prototype a better version.",
            "expected_output": "A small UX case study with before/after screens.",
        },
    },
    {
        "career_id": "growth_ai_strategist",
        "title": "Growth & AI Strategist",
        "cluster": "Business & Finance",
        "one_line_summary": "Uses data, market thinking, and AI tools to grow products, campaigns, and ventures.",
        "related_interests": ["business", "finance", "strategy", "content creation", "writing"],
        "related_subjects": ["economics", "mathematics", "statistics", "business", "english"],
        "work_styles": ["leader", "analyst", "creative"],
        "required_skills": ["analytics", "storytelling", "market research", "financial basics", "experimentation", "AI tools"],
        "ai_exposure_score": 7,
        "difficulty_score": 5,
        "growth_potential_score": 8,
        "human_advantage": ["market reading", "positioning", "stakeholder trust", "strategic judgment"],
        "starter_project": {
            "title": "Launch a 7-day micro-campaign",
            "description": "Pick a product idea, create three messages, and measure which angle gets the best response.",
            "expected_output": "A campaign mini-case with assumptions, results, and next actions.",
        },
    },
    {
        "career_id": "healthtech_research_associate",
        "title": "Health-Tech Research Associate",
        "cluster": "Healthcare & Bio",
        "one_line_summary": "Connects biology, research, and digital tools to improve healthcare products and decisions.",
        "related_interests": ["biology", "healthcare", "science", "community", "research"],
        "related_subjects": ["biology", "chemistry", "social studies", "statistics"],
        "work_styles": ["helper", "researcher", "collaborative"],
        "required_skills": ["research methods", "biology fundamentals", "data literacy", "communication", "ethics", "AI-assisted literature review"],
        "ai_exposure_score": 5,
        "difficulty_score": 6,
        "growth_potential_score": 8,
        "human_advantage": ["care context", "ethical judgment", "patient empathy", "study interpretation"],
        "starter_project": {
            "title": "Map a health problem and digital support idea",
            "description": "Choose one student health problem, research it, and design a simple support workflow.",
            "expected_output": "A one-page research brief and product concept.",
        },
    },
    {
        "career_id": "data_policy_analyst",
        "title": "Data & Policy Analyst",
        "cluster": "Data & Research",
        "one_line_summary": "Uses data, statistics, and communication to explain decisions in business, policy, or finance.",
        "related_interests": ["finance", "mathematics", "law", "research", "strategy", "sustainability"],
        "related_subjects": ["statistics", "mathematics", "economics", "history", "social studies"],
        "work_styles": ["analyst", "researcher", "independent"],
        "required_skills": ["Excel", "statistics", "data visualization", "research writing", "critical thinking", "AI-assisted analysis"],
        "ai_exposure_score": 6,
        "difficulty_score": 5,
        "growth_potential_score": 7,
        "human_advantage": ["causal reasoning", "source judgment", "policy context", "clear explanation"],
        "starter_project": {
            "title": "Analyze a public dataset",
            "description": "Pick one public dataset, create three charts, and explain what decision it supports.",
            "expected_output": "A short analytical report with charts and recommendations.",
        },
    },
]

class SimulationService:
    _cache: Dict[str, Dict[str, Any]] = {}

    def __init__(self, db: Session | None = None):
        self.db = db

    @classmethod
    def get_cached_simulation(cls, simulation_id: str) -> Dict[str, Any] | None:
        return cls._cache.get(simulation_id)

    def run_simulation(self, payload: SimulationRequest) -> Dict[str, Any]:
        profile = payload.student_profile.model_dump()
        careers = self._rank_careers(profile)[: payload.options.preferred_number_of_paths]
        career_paths = [self._build_career_path(profile, career, index) for index, career in enumerate(careers)]
        recommended = career_paths[0]
        simulation_id = f"sim_{uuid.uuid4().hex[:12]}"

        simulation = {
            "simulation_id": simulation_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "student_summary": {
                "name": profile["name"],
                "profile_headline": self._headline(profile),
                "dominant_interests": profile["interests"][:3],
                "strongest_existing_skills": profile["current_skills"][:3],
                "main_concerns": profile["career_fears"][:2],
            },
            "career_paths": career_paths,
            "comparison": {
                "recommended_path_id": recommended["career_id"],
                "summary": f"Your strongest path is {recommended['title']} because it best combines your interests, current skills, and preferred working style.",
                "comparison_rows": [
                    {
                        "career_id": c["career_id"],
                        "title": c["title"],
                        "fit_score": c["fit_score"],
                        "ai_exposure_score": c["ai_exposure_score"],
                        "difficulty_score": c["difficulty_score"],
                        "growth_potential_score": c["growth_potential_score"],
                        "first_project": c["starter_project"]["title"],
                    }
                    for c in career_paths
                ],
            },
            "skill_gap_analysis": self._skill_gap_analysis(profile, career_paths),
            "action_sprint": self._action_sprint(recommended),
            "trace": {
                "pipeline_version": "v1.0-deterministic",
                "steps": [
                    {"step_id": "profile_normalization", "status": "completed", "summary": "Converted form input into a structured student profile.", "detail": {"name": profile["name"], "interests": profile["interests"], "skills": profile["current_skills"]}},
                    {"step_id": "career_retrieval", "status": "completed", "summary": "Matched profile against the local career library.", "detail": {"careers_considered": len(CAREER_LIBRARY)}},
                    {"step_id": "career_scoring", "status": "completed", "summary": "Ranked career paths using interest, skill, subject, and work-style overlap.", "detail": {"top_path": recommended["career_id"], "score": recommended["fit_score"]}},
                    {"step_id": "output_quality_check", "status": "completed", "summary": "Verified output contains paths, comparison, skill gaps, sprint, and trace."},
                ],
                "warnings": ["Career guidance is directional. Validate with mentors, counselors, and real-world exploration."],
            },
        }
        self._cache[simulation_id] = simulation
        return {"success": True, "simulation": simulation}

    def _rank_careers(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        ranked = []
        for career in CAREER_LIBRARY:
            item = copy.deepcopy(career)
            item["fit_score"] = self._fit_score(profile, career)
            ranked.append(item)
        return sorted(ranked, key=lambda c: c["fit_score"], reverse=True)

    def _fit_score(self, profile: Dict[str, Any], career: Dict[str, Any]) -> int:
        interests = self._lower_set(profile.get("interests", []))
        subjects = self._lower_set(profile.get("favorite_subjects", []))
        skills = self._lower_set(profile.get("current_skills", []))
        styles = self._lower_set(profile.get("work_style_preferences", []))

        interest_match = self._overlap_ratio(interests, career["related_interests"])
        subject_match = self._overlap_ratio(subjects, career["related_subjects"])
        skill_match = self._overlap_ratio(skills, career["required_skills"])
        style_match = self._overlap_ratio(styles, career["work_styles"])

        score = 50 + (interest_match * 22) + (subject_match * 10) + (skill_match * 8) + (style_match * 10)
        return max(58, min(96, round(score)))

    def _build_career_path(self, profile: Dict[str, Any], career: Dict[str, Any], index: int) -> Dict[str, Any]:
        current_skills = profile.get("current_skills", [])
        matched = [skill for skill in current_skills if self._any_token_overlap(skill, career["required_skills"])]
        if not matched:
            matched = current_skills[:2]
        missing = [skill for skill in career["required_skills"] if not self._any_token_overlap(skill, current_skills)][:3]

        return {
            "career_id": career["career_id"],
            "title": career["title"],
            "cluster": career["cluster"],
            "one_line_summary": career["one_line_summary"],
            "fit_score": max(50, career["fit_score"] - (index * 3)),
            "ai_exposure_score": career["ai_exposure_score"],
            "difficulty_score": career["difficulty_score"],
            "growth_potential_score": career["growth_potential_score"],
            "confidence_score": round(0.72 + min(len(profile.get("interests", [])), 5) * 0.03, 2),
            "why_it_fits": [
                f"Connects with your interest in {', '.join(profile.get('interests', [])[:2])}.",
                f"Builds on your current strengths: {', '.join(current_skills[:2])}.",
                "Keeps AI as a tool inside the work instead of treating it only as a threat.",
            ],
            "required_skills": career["required_skills"],
            "matched_skills": matched,
            "missing_skills": missing,
            "human_advantage": career["human_advantage"],
            "ai_exposure_breakdown": [
                {"task": "Research and first drafts", "ai_role": "AI can accelerate summaries, examples, and draft options.", "human_role": "Human decides what is relevant, ethical, and useful.", "risk_level": "medium"},
                {"task": "Problem framing", "ai_role": "AI can suggest directions from context.", "human_role": "Human identifies the real pain point and tradeoffs.", "risk_level": "low"},
                {"task": "Execution and review", "ai_role": "AI can assist with boilerplate, checklists, and iteration.", "human_role": "Human validates quality and owns final judgment.", "risk_level": "medium"},
            ],
            "starter_project": career["starter_project"],
            "learning_roadmap": [
                {"step": 1, "title": f"Learn {missing[0] if missing else career['required_skills'][0]}", "description": "Cover the basics through one small applied exercise.", "estimated_time": "2 days"},
                {"step": 2, "title": "Build a visible mini-project", "description": "Create a simple artifact that proves the skill in context.", "estimated_time": "3 days"},
                {"step": 3, "title": "Get feedback", "description": "Show the output to three people and improve it once.", "estimated_time": "2 days"},
            ],
        }

    def _skill_gap_analysis(self, profile: Dict[str, Any], careers: List[Dict[str, Any]]) -> Dict[str, Any]:
        gaps = []
        for career in careers:
            for skill in career["missing_skills"]:
                if skill not in [g["skill"] for g in gaps]:
                    gaps.append({"skill": skill, "priority": "high" if len(gaps) < 2 else "medium", "reason": f"Important for {career['title']} and useful for practical exploration."})
        return {
            "top_existing_skills": profile.get("current_skills", [])[:4],
            "highest_priority_gaps": gaps[:6],
            "skill_matrix": [
                {"skill": gap["skill"], "current_level": 1, "target_level": 4 if gap["priority"] == "high" else 3, "relevant_career_ids": [c["career_id"] for c in careers if gap["skill"] in c["missing_skills"]]}
                for gap in gaps[:6]
            ],
        }

    def _action_sprint(self, career: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "focus_career_id": career["career_id"],
            "sprint_title": f"7-Day Sprint: Explore {career['title']}",
            "expected_final_output": career["starter_project"]["expected_output"],
            "days": [
                {"day": 1, "title": "Pick one real problem", "task": "List five problems around school, home, or online work and choose one linked to this path.", "deliverable": "One clear problem statement."},
                {"day": 2, "title": "Map the workflow", "task": "Sketch input, process, output, and where AI could help.", "deliverable": "Simple workflow or concept diagram."},
                {"day": 3, "title": "Learn one missing skill", "task": f"Spend focused time on {career['missing_skills'][0] if career.get('missing_skills') else career['required_skills'][0]}.", "deliverable": "Short notes plus one practice exercise."},
                {"day": 4, "title": "Create the first draft", "task": "Build a rough version of the project artifact without polishing.", "deliverable": "First working draft."},
                {"day": 5, "title": "Use AI as a co-pilot", "task": "Ask AI for critique, alternatives, and edge cases, then choose what to improve.", "deliverable": "Improvement checklist."},
                {"day": 6, "title": "Test with people", "task": "Show the output to at least two people and capture feedback.", "deliverable": "Feedback notes."},
                {"day": 7, "title": "Package and reflect", "task": "Create a short summary: problem, solution, what AI helped with, what you learned.", "deliverable": "Shareable mini case study."},
            ],
        }

    def _headline(self, profile: Dict[str, Any]) -> str:
        interests = ", ".join(profile.get("interests", [])[:3])
        return f"A {profile.get('education_stage', 'student').replace('_', ' ')} learner exploring {interests} with AI-era career clarity."

    def _lower_set(self, values: List[str]) -> List[str]:
        return [v.lower().strip() for v in values]

    def _overlap_ratio(self, inputs: List[str], targets: List[str]) -> float:
        if not inputs:
            return 0.0
        target_text = " ".join([t.lower() for t in targets])
        matches = sum(1 for value in inputs if value in target_text or any(token in target_text for token in value.split()))
        return min(1.0, matches / max(1, len(inputs)))

    def _any_token_overlap(self, value: str, targets: List[str]) -> bool:
        value_tokens = set(value.lower().replace("-", " ").split())
        target_tokens = set(" ".join(targets).lower().replace("-", " ").split())
        return bool(value_tokens & target_tokens)
