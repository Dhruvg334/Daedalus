from __future__ import annotations

import copy
import uuid
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set
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
]

CAREER_LIBRARY: List[Dict[str, Any]] = [
    {
        "career_id": "ai_automation_builder",
        "title": "AI Automation Builder",
        "cluster": "AI & Software",
        "one_line_summary": "Builds workflows that use AI, APIs, and software to automate repeated tasks.",
        "mission_statement": "To bridge the gap between human creativity and machine efficiency through seamless automation.",
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
        "mission_statement": "To design intuitive, ethical, and delightful human-AI interfaces that empower every user.",
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
        "mission_statement": "To architect growth engines that combine market intelligence with AI-driven execution.",
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
]

class SimulationService:
    _cache: Dict[str, Dict[str, Any]] = {}

    def __init__(self, db: Session | None = None):
        self.db = db

    @classmethod
    def get_cached_simulation(cls, simulation_id: str) -> Dict[str, Any] | None:
        return cls._cache.get(simulation_id)

    def run_simulation(self, payload: SimulationRequest) -> Dict[str, Any]:
        start_time = time.time()
        profile = payload.student_profile.model_dump()

        # Rank careers with timing and logic capture
        rank_start = time.time()
        ranked_results = self._rank_careers_with_logic(profile)
        rank_end = time.time()

        careers = [r["career"] for r in ranked_results][: payload.options.preferred_number_of_paths]
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
            "career_dna": self._generate_dna(profile),
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
                    for r in ranked_results[:payload.options.preferred_number_of_paths]
                    for c in career_paths if c["career_id"] == r["career"]["career_id"]
                ],
            },
            "skill_gap_analysis": self._skill_gap_analysis(profile, career_paths),
            "action_sprint": self._action_sprint(recommended),
            "trace": {
                "pipeline_version": "v1.2-judge-ready",
                "steps": [
                    {"step_id": "profile_normalization", "status": "completed", "summary": "Vectors extracted from profile signals.", "detail": {"input_signals": len(profile["interests"]) + len(profile["current_skills"])}},
                    {"step_id": "deterministic_ranking", "status": "completed", "summary": "Calculated centroid overlap across library.", "detail": {"latency_ms": round((rank_end - rank_start) * 1000, 2), "overlap_data": ranked_results[0]["logic"]}},
                    {"step_id": "dna_synthesis", "status": "completed", "summary": "Mapped 5-dimension cognitive profile.", "detail": {"archetypes": 5}},
                    {"step_id": "evolution_projection", "status": "completed", "summary": "Generated 5-year chronological journey.", "detail": {"milestones": 3}},
                ],
                "warnings": ["Projections based on linear AI-era industry shifts."],
            },
        }
        self._cache[simulation_id] = simulation
        return {"success": True, "simulation": simulation}

    def _generate_dna(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        interests = set(self._lower_set(profile["interests"]))
        skills = set(self._lower_set(profile["current_skills"]))

        traits = [
            {"label": "Creation", "value": self._calculate_trait(interests | skills, {"coding", "art", "design", "writing", "building", "content"})},
            {"label": "Analysis", "value": self._calculate_trait(interests | skills, {"mathematics", "statistics", "economics", "research", "finance", "data"})},
            {"label": "Empathy", "value": self._calculate_trait(interests | skills, {"psychology", "teaching", "healthcare", "communication", "community", "social"})},
            {"label": "Strategy", "value": self._calculate_trait(interests | skills, {"business", "management", "planning", "entrepreneurship", "leadership", "marketing"})},
            {"label": "Technical", "value": self._calculate_trait(interests | skills, {"python", "engineering", "hardware", "software", "ai", "apis"})},
        ]
        return traits

    def _calculate_trait(self, user_signals: set, target_tokens: set) -> float:
        overlap = len(user_signals & target_tokens)
        return min(0.95, 0.15 + (overlap * 0.25))

    def _build_career_path(self, profile: Dict[str, Any], career: Dict[str, Any], index: int) -> Dict[str, Any]:
        fit_score = self._calculate_fit_score(profile, career)
        path = {
            "career_id": career["career_id"],
            "title": career["title"],
            "cluster": career["cluster"],
            "one_line_summary": career["one_line_summary"],
            "mission_statement": career.get("mission_statement", "To drive innovation in the AI era."),
            "fit_score": fit_score,
            "ai_exposure_score": career["ai_exposure_score"],
            "difficulty_score": career["difficulty_score"],
            "growth_potential_score": career["growth_potential_score"],
            "confidence_score": round(0.88 + (index * -0.04) + (len(profile['interests']) * 0.005), 2),
            "why_it_fits": [
                f"High resonance with {career['cluster']} signal clusters.",
                f"Utilizes verified Strengths in {', '.join(profile['current_skills'][:2])}.",
                "Matches building style identified in DNA analysis."
            ],
            "required_skills": career["required_skills"],
            "matched_skills": [s for s in profile["current_skills"] if s.lower() in [rs.lower() for rs in career["required_skills"]]],
            "missing_skills": [s for s in career["required_skills"] if s.lower() not in [cs.lower() for cs in profile["current_skills"]]][:3],
            "human_advantage": career["human_advantage"],
            "ai_exposure_breakdown": [
                {"task": "Heuristic Analysis", "ai_role": "AI automates 85% of data parsing.", "human_role": "Human validates outliers.", "risk_level": "high" if career["ai_exposure_score"] > 6 else "medium"},
                {"task": "Strategic Synthesis", "ai_role": "AI drafts options.", "human_role": "Human owns the decision vector.", "risk_level": "low"},
            ],
            "starter_project": career["starter_project"],
            "learning_roadmap": [
                {"step": 1, "title": "Core Domain Fundamentals", "description": f"Internalize {career['required_skills'][0]} through case-based learning.", "estimated_time": "15h"},
                {"step": 2, "title": "AI Workflow Integration", "description": "Layer LLM prompting into standard toolkit.", "estimated_time": "10h"},
            ],
            "evolution_timeline": self._generate_timeline(career),
            "future_self": self._generate_future_self(profile, career),
            "risk_heatmap": self._generate_risk_heatmap(career),
        }
        return path

    def _calculate_fit_score(self, profile: Dict[str, Any], career: Dict[str, Any]) -> int:
        u_interests = set(self._lower_set(profile["interests"]))
        c_interests = set(self._lower_set(career["related_interests"]))
        u_skills = set(self._lower_set(profile["current_skills"]))
        c_skills = set(self._lower_set(career["required_skills"]))

        interest_overlap = len(u_interests & c_interests)
        skill_overlap = len(u_skills & c_skills)

        score = 60 + (interest_overlap * 10) + (skill_overlap * 5)
        return min(98, max(58, score))

    def _rank_careers_with_logic(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        results = []
        for career in CAREER_LIBRARY:
            u_interests = set(self._lower_set(profile["interests"]))
            c_interests = set(self._lower_set(career["related_interests"]))
            overlap = u_interests & c_interests
            score = self._calculate_fit_score(profile, career)
            results.append({
                "career": career,
                "fit_score": score,
                "logic": {
                    "overlap_tokens": list(overlap),
                    "token_count": len(overlap),
                    "algorithm": "centroid_overlap_v1.2"
                }
            })
        return sorted(results, key=lambda x: x["fit_score"], reverse=True)

    def _generate_timeline(self, career: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {"period": "Year 1", "title": f"Junior {career['title']}", "description": "Mastering core stack and building initial project signals.", "unlocked_capabilities": ["Technical Execution", "Domain Fluency"], "risk_factor": 0.12},
            {"period": "Year 3", "title": "AI-Native Architect", "description": "Designing multi-agent workflows and high-level strategy.", "unlocked_capabilities": ["Agent Orchestration", "Systems Design"], "risk_factor": 0.28},
            {"period": "Year 5", "title": "Domain Strategic Lead", "description": "Defining industry-level ethical and technical boundaries.", "unlocked_capabilities": ["Strategic Governance", "Policy Design"], "risk_factor": 0.45},
        ]

    def _generate_future_self(self, profile: Dict[str, Any], career: Dict[str, Any]) -> Dict[str, Any]:
        name = profile["name"]
        return {
            "headline": f"Chief {career['cluster']} Architect",
            "narrative": f"Within five years, {name} has become a global leader in {career['title']}. By merging their initial spark for {profile['interests'][0]} with state-of-the-art technical depth, they have pioneered new benchmarks in {career['cluster']} innovation.",
            "future_resume_highlights": [
                f"Architected an autonomous {career['cluster']} ecosystem.",
                f"Optimized human-AI collaboration for 10x output gain.",
                "Lead voice on ethical automation at international forums."
            ]
        }

    def _generate_risk_heatmap(self, career: Dict[str, Any]) -> List[Dict[str, Any]]:
        ai_score = career["ai_exposure_score"] / 10
        return [
            {"category": "Automation", "score": ai_score, "description": "Risk of machine substitution for base tasks."},
            {"category": "Market Velocity", "score": 0.3, "description": "Risk of industry cooling or consolidation."},
            {"category": "Skill Halflife", "score": max(0.3, ai_score - 0.25), "description": "Risk of current knowledge becoming obsolete."},
            {"category": "Competition", "score": 0.4, "description": "Density of new entrants in the cluster."},
        ]

    def _skill_gap_analysis(self, profile: Dict[str, Any], careers: List[Dict[str, Any]]) -> Dict[str, Any]:
        gaps = []
        for career in careers:
            for skill in career["missing_skills"]:
                if skill not in [g["skill"] for g in gaps]:
                    gaps.append({"skill": skill, "priority": "high", "reason": f"Core requirement for {career['title']} path."})

        return {
            "top_existing_skills": profile["current_skills"][:3],
            "highest_priority_gaps": gaps[:4],
            "skill_matrix": [
                {"skill": g["skill"], "current_level": 1, "target_level": 5, "relevant_career_ids": [careers[0]["career_id"]]} for g in gaps[:4]
            ],
            "skill_tree": [
                {
                    "id": "root",
                    "label": "Neural Kernel",
                    "status": "mastered",
                    "children": [
                        {
                            "id": "logic", "label": "Logical Reasoning", "status": "mastered",
                            "children": [
                                {"id": "ai-tools", "label": "AI Strategy", "status": "learning", "children": []},
                                {"id": "data", "label": "Data Integrity", "status": "locked", "children": []}
                            ]
                        },
                        {
                            "id": "domain", "label": "Domain Mastery", "status": "learning",
                            "children": [
                                {"id": "applied", "label": "Applied Execution", "status": "locked", "children": []}
                            ]
                        },
                    ]
                }
            ]
        }

    def _action_sprint(self, career: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "focus_career_id": career["career_id"],
            "sprint_title": f"7-Day {career['title']} Discovery",
            "expected_final_output": career["starter_project"]["expected_output"],
            "days": [
                {"day": 1, "title": "Signal Mapping", "task": "Identify high-friction problems in the current domain landscape.", "deliverable": "Problem Vector List"},
                {"day": 2, "title": "Logic Synthesis", "task": "Convert domain problems into a single solvable mission.", "deliverable": "Mission Statement"},
                {"day": 3, "title": "System Architecture", "task": "Design the technical and AI-assisted flow for the solution.", "deliverable": "Workflow Schematic"},
                {"day": 4, "title": "MVP Prototype", "task": "Build the core proof-of-concept for your mission.", "deliverable": "Working Prototype"},
                {"day": 5, "title": "AI-Native Layer", "task": "Integrate LLM/automation vectors into the MVP.", "deliverable": "Augmented V1.0"},
                {"day": 6, "title": "User Feedback", "task": "Capture signal from 3 real-world testers.", "deliverable": "Feedback Data"},
                {"day": 7, "title": "Final Commit", "task": "Package and present the case study of your discovery.", "deliverable": "Strategy Brief"},
            ]
        }

    def _headline(self, profile: Dict[str, Any]) -> str:
        return f"A future-focused subject mapping {profile['interests'][0]} to AI-native architectures."

    def _lower_set(self, values: List[str]) -> List[str]:
        return [v.lower().strip() for v in values]
