from __future__ import annotations

import re
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Set

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
        "persona_id": "riya_health_impact",
        "name": "Riya",
        "age": 18,
        "headline": "Biology-focused helper who wants a meaningful career with technology exposure.",
        "interests": ["biology", "healthcare", "helping people"],
        "favorite_subjects": ["Biology", "Chemistry", "Psychology"],
        "current_skills": ["research", "communication", "basic data analysis"],
        "career_fears": ["choosing between medicine and technology", "not having enough technical skills"],
        "work_style": "helper",
        "weekly_time_available": "3-5 hours",
        "profile": {
            "name": "Riya",
            "age": 18,
            "education_stage": "early_college",
            "location": "India",
            "interests": ["biology", "healthcare", "helping people"],
            "favorite_subjects": ["Biology", "Chemistry", "Psychology"],
            "current_skills": ["research", "communication", "basic data analysis"],
            "work_style_preferences": ["helping", "research", "collaborative"],
            "career_fears": ["choosing between medicine and technology", "not having enough technical skills"],
            "dream_careers": ["doctor", "health tech founder", "researcher"],
            "disliked_careers": ["sales-only roles"],
            "weekly_time_available": "3-5 hours",
            "optional_profile_text": "I enjoy explaining health topics and want to work on real problems.",
        },
    },
    {
        "persona_id": "kabir_finance_data",
        "name": "Kabir",
        "age": 17,
        "headline": "Math and finance-oriented student interested in markets, data, and decision-making.",
        "interests": ["finance", "mathematics", "data"],
        "favorite_subjects": ["Mathematics", "Economics", "Statistics"],
        "current_skills": ["Excel", "basic Python", "presentation"],
        "career_fears": ["finance jobs becoming automated", "not knowing which skills matter"],
        "work_style": "analyst",
        "weekly_time_available": "5-7 hours",
        "profile": {
            "name": "Kabir",
            "age": 17,
            "education_stage": "high_school",
            "location": "India",
            "interests": ["finance", "mathematics", "data"],
            "favorite_subjects": ["Mathematics", "Economics", "Statistics"],
            "current_skills": ["Excel", "basic Python", "presentation"],
            "work_style_preferences": ["analyst", "structured", "independent"],
            "career_fears": ["finance jobs becoming automated", "not knowing which skills matter"],
            "dream_careers": ["investment analyst", "data analyst", "fintech founder"],
            "disliked_careers": ["pure creative writing"],
            "weekly_time_available": "5-7 hours",
            "optional_profile_text": "I like interpreting numbers and explaining what they mean.",
        },
    },
]


CAREER_LIBRARY: List[Dict[str, Any]] = [
    {
        "career_id": "ai_automation_builder",
        "title": "AI Automation Builder",
        "cluster": "AI & Software",
        "one_line_summary": "Builds AI-assisted workflows that connect tools, APIs, data, and user problems.",
        "mission_statement": "Turn repetitive work into reliable AI-assisted systems.",
        "related_interests": ["coding", "automation", "ai", "business", "productivity", "systems"],
        "related_subjects": ["computer science", "mathematics", "business", "economics"],
        "work_styles": ["builder", "building", "independent", "systems", "structured"],
        "required_skills": ["Python", "APIs", "workflow design", "debugging", "prompt engineering", "deployment basics"],
        "ai_exposure_score": 8,
        "difficulty_score": 6,
        "growth_potential_score": 8,
        "human_advantage": ["problem framing", "workflow design", "edge-case debugging", "user empathy"],
        "starter_project": {
            "title": "Build a task-to-plan AI workflow",
            "description": "Create a small workflow that turns messy tasks into structured reminders, priorities, and next actions.",
            "expected_output": "A working automation with screenshots, README, and a short demo.",
        },
    },
    {
        "career_id": "software_product_engineer",
        "title": "Software Product Engineer",
        "cluster": "Software & Product",
        "one_line_summary": "Builds useful digital products by combining frontend, backend, APIs, and product judgment.",
        "mission_statement": "Ship reliable software that solves clear user problems.",
        "related_interests": ["coding", "apps", "software", "startup", "building", "technology", "web"],
        "related_subjects": ["computer science", "mathematics", "physics"],
        "work_styles": ["builder", "independent", "structured", "problem solving"],
        "required_skills": ["JavaScript", "React", "backend APIs", "databases", "testing", "deployment"],
        "ai_exposure_score": 7,
        "difficulty_score": 7,
        "growth_potential_score": 9,
        "human_advantage": ["system design", "product sense", "debugging", "ownership"],
        "starter_project": {
            "title": "Ship a small full-stack app",
            "description": "Build a simple product with one real user flow, database persistence, and deployed URL.",
            "expected_output": "A deployed product with GitHub repo, README, and working demo link.",
        },
    },
    {
        "career_id": "ai_product_designer",
        "title": "AI-Native Product Designer",
        "cluster": "Design & Product",
        "one_line_summary": "Designs human-friendly AI products using research, prototyping, and interaction design.",
        "mission_statement": "Make AI products understandable, useful, and trustworthy.",
        "related_interests": ["design", "psychology", "art", "writing", "creative writing", "product", "ux"],
        "related_subjects": ["art", "psychology", "english", "business", "computer science"],
        "work_styles": ["creative", "collaborative", "helper", "visual"],
        "required_skills": ["Figma", "user research", "prototyping", "UX writing", "AI prototyping", "presentation"],
        "ai_exposure_score": 6,
        "difficulty_score": 5,
        "growth_potential_score": 9,
        "human_advantage": ["taste", "empathy", "product judgment", "storytelling"],
        "starter_project": {
            "title": "Redesign a confusing app with AI support",
            "description": "Interview users, identify one broken flow, and prototype a clearer version.",
            "expected_output": "A concise UX case study with before/after screens.",
        },
    },
    {
        "career_id": "growth_ai_strategist",
        "title": "Growth & AI Strategist",
        "cluster": "Business & Growth",
        "one_line_summary": "Uses market thinking, analytics, experiments, and AI tools to grow products and campaigns.",
        "mission_statement": "Convert market signals into measurable growth systems.",
        "related_interests": ["business", "marketing", "finance", "strategy", "content creation", "startup", "sales"],
        "related_subjects": ["economics", "mathematics", "statistics", "business", "english"],
        "work_styles": ["leader", "analyst", "creative", "collaborative"],
        "required_skills": ["analytics", "storytelling", "market research", "experimentation", "AI tools", "presentation"],
        "ai_exposure_score": 7,
        "difficulty_score": 5,
        "growth_potential_score": 8,
        "human_advantage": ["positioning", "customer insight", "stakeholder trust", "strategic judgment"],
        "starter_project": {
            "title": "Launch a 7-day micro-campaign",
            "description": "Pick a product idea, test three messages, and measure which angle gets the best response.",
            "expected_output": "A campaign mini-case with assumptions, results, and next actions.",
        },
    },
    {
        "career_id": "data_insight_analyst",
        "title": "Data Insight Analyst",
        "cluster": "Data & Analytics",
        "one_line_summary": "Turns data into decisions through analysis, visualization, and business context.",
        "mission_statement": "Make complex data useful for real-world decisions.",
        "related_interests": ["data", "statistics", "finance", "research", "analytics", "mathematics", "markets"],
        "related_subjects": ["statistics", "mathematics", "economics", "computer science"],
        "work_styles": ["analyst", "structured", "research", "independent"],
        "required_skills": ["Excel", "SQL", "Python", "statistics", "dashboarding", "data storytelling"],
        "ai_exposure_score": 6,
        "difficulty_score": 6,
        "growth_potential_score": 8,
        "human_advantage": ["asking the right question", "data judgment", "business interpretation", "communication"],
        "starter_project": {
            "title": "Analyze a real public dataset",
            "description": "Pick a dataset, find three insights, and present a dashboard with recommendations.",
            "expected_output": "A dashboard screenshot plus a one-page insight memo.",
        },
    },
    {
        "career_id": "fintech_product_analyst",
        "title": "FinTech Product Analyst",
        "cluster": "Finance & Technology",
        "one_line_summary": "Connects finance, data, and product thinking to improve digital financial services.",
        "mission_statement": "Build better financial decisions through technology and clear analysis.",
        "related_interests": ["finance", "markets", "business", "data", "economics", "banking", "investment"],
        "related_subjects": ["economics", "mathematics", "statistics", "business"],
        "work_styles": ["analyst", "structured", "leader"],
        "required_skills": ["financial basics", "Excel", "SQL", "product metrics", "risk analysis", "presentation"],
        "ai_exposure_score": 7,
        "difficulty_score": 6,
        "growth_potential_score": 8,
        "human_advantage": ["risk judgment", "trust", "regulatory awareness", "commercial reasoning"],
        "starter_project": {
            "title": "Compare three budgeting apps",
            "description": "Analyze onboarding, monetization, user risks, and AI opportunities in financial products.",
            "expected_output": "A product teardown with recommendations.",
        },
    },
    {
        "career_id": "health_tech_researcher",
        "title": "Health-Tech Researcher",
        "cluster": "Healthcare & Bio",
        "one_line_summary": "Uses biology, research, and technology to improve health communication, products, or care systems.",
        "mission_statement": "Apply science and technology to improve health outcomes responsibly.",
        "related_interests": ["biology", "healthcare", "medicine", "research", "psychology", "helping people", "science"],
        "related_subjects": ["biology", "chemistry", "psychology", "statistics", "computer science"],
        "work_styles": ["helper", "research", "collaborative", "structured"],
        "required_skills": ["research methods", "biology fundamentals", "data literacy", "ethics", "communication", "documentation"],
        "ai_exposure_score": 5,
        "difficulty_score": 7,
        "growth_potential_score": 8,
        "human_advantage": ["ethics", "patient empathy", "domain judgment", "care context"],
        "starter_project": {
            "title": "Create a health explainer from research",
            "description": "Convert a complex health topic into a clear evidence-aware explainer for students.",
            "expected_output": "A short article or slide deck with sources and plain-language explanation.",
        },
    },
    {
        "career_id": "learning_experience_designer",
        "title": "Learning Experience Designer",
        "cluster": "Education & Learning",
        "one_line_summary": "Designs courses, learning products, and AI-assisted study experiences.",
        "mission_statement": "Make learning clearer, more engaging, and more adaptive.",
        "related_interests": ["teaching", "education", "writing", "psychology", "content creation", "community", "mentoring"],
        "related_subjects": ["english", "psychology", "education", "computer science", "art"],
        "work_styles": ["helper", "creative", "collaborative", "structured"],
        "required_skills": ["instructional design", "writing", "user research", "assessment design", "AI tutoring tools", "presentation"],
        "ai_exposure_score": 6,
        "difficulty_score": 5,
        "growth_potential_score": 7,
        "human_advantage": ["empathy", "motivation design", "feedback quality", "context"],
        "starter_project": {
            "title": "Build a 20-minute mini-course",
            "description": "Teach one topic with examples, quiz questions, and a feedback loop.",
            "expected_output": "A mini-course page or slide deck with learner feedback.",
        },
    },
    {
        "career_id": "cybersecurity_analyst",
        "title": "Cybersecurity Analyst",
        "cluster": "Security & Trust",
        "one_line_summary": "Protects systems by identifying risks, monitoring threats, and improving security practices.",
        "mission_statement": "Keep digital systems trustworthy under pressure.",
        "related_interests": ["cybersecurity", "security", "hacking", "coding", "networks", "privacy", "systems"],
        "related_subjects": ["computer science", "mathematics", "physics"],
        "work_styles": ["analyst", "structured", "independent", "problem solving"],
        "required_skills": ["network basics", "Linux", "Python", "threat modeling", "log analysis", "security fundamentals"],
        "ai_exposure_score": 6,
        "difficulty_score": 7,
        "growth_potential_score": 9,
        "human_advantage": ["threat judgment", "adversarial thinking", "incident response", "trust decisions"],
        "starter_project": {
            "title": "Build a simple phishing detector checklist",
            "description": "Analyze common phishing examples and create a practical detection guide or mini-tool.",
            "expected_output": "A security checklist/tool with example cases.",
        },
    },
    {
        "career_id": "climate_data_builder",
        "title": "Climate Data Builder",
        "cluster": "Climate & Sustainability",
        "one_line_summary": "Uses data, systems thinking, and sustainability knowledge to support climate decisions.",
        "mission_statement": "Turn environmental data into better sustainability action.",
        "related_interests": ["climate", "sustainability", "environment", "data", "science", "policy", "energy"],
        "related_subjects": ["geography", "environmental science", "statistics", "economics", "computer science"],
        "work_styles": ["research", "analyst", "helper", "structured"],
        "required_skills": ["data analysis", "climate basics", "GIS basics", "dashboarding", "policy literacy", "communication"],
        "ai_exposure_score": 5,
        "difficulty_score": 6,
        "growth_potential_score": 8,
        "human_advantage": ["systems thinking", "policy context", "stakeholder alignment", "ethical judgment"],
        "starter_project": {
            "title": "Map a local sustainability problem",
            "description": "Use public data or manual observation to analyze a local waste, energy, or water issue.",
            "expected_output": "A simple dashboard or report with recommended actions.",
        },
    },
    {
        "career_id": "creator_ai_producer",
        "title": "AI-Assisted Creator Producer",
        "cluster": "Creator Economy",
        "one_line_summary": "Uses storytelling, production, analytics, and AI tools to build consistent creative output.",
        "mission_statement": "Scale creative expression without losing voice or audience trust.",
        "related_interests": ["content creation", "youtube", "music", "film", "writing", "social media", "storytelling", "art"],
        "related_subjects": ["english", "art", "music", "media", "business"],
        "work_styles": ["creative", "independent", "collaborative", "visual"],
        "required_skills": ["storytelling", "editing", "audience research", "content strategy", "AI tools", "analytics"],
        "ai_exposure_score": 8,
        "difficulty_score": 5,
        "growth_potential_score": 7,
        "human_advantage": ["voice", "taste", "community trust", "cultural timing"],
        "starter_project": {
            "title": "Create a 7-day content experiment",
            "description": "Produce seven short posts around one theme and measure which angle resonates.",
            "expected_output": "A content calendar, published samples, and response analysis.",
        },
    },
    {
        "career_id": "robotics_iot_engineer",
        "title": "Robotics & IoT Engineer",
        "cluster": "Engineering & Robotics",
        "one_line_summary": "Builds connected physical systems using sensors, hardware, software, and automation.",
        "mission_statement": "Bring intelligence into the physical world through reliable engineering.",
        "related_interests": ["robotics", "hardware", "engineering", "electronics", "iot", "automation", "physics"],
        "related_subjects": ["physics", "mathematics", "computer science", "electronics"],
        "work_styles": ["builder", "hands-on", "structured", "problem solving"],
        "required_skills": ["electronics basics", "Python", "Arduino", "sensors", "mechanical reasoning", "debugging"],
        "ai_exposure_score": 6,
        "difficulty_score": 8,
        "growth_potential_score": 8,
        "human_advantage": ["physical debugging", "safety judgment", "systems integration", "hardware intuition"],
        "starter_project": {
            "title": "Build a sensor-based mini-system",
            "description": "Use a sensor or simulated data to trigger a visible action or dashboard.",
            "expected_output": "A working prototype video and wiring/system diagram.",
        },
    },
    {
        "career_id": "ai_policy_governance_analyst",
        "title": "AI Policy & Governance Analyst",
        "cluster": "Policy & Governance",
        "one_line_summary": "Studies how AI affects society, rules, ethics, organizations, and public decision-making.",
        "mission_statement": "Help institutions use AI responsibly and transparently.",
        "related_interests": ["law", "policy", "ethics", "society", "debate", "writing", "government", "ai safety"],
        "related_subjects": ["political science", "english", "history", "economics", "computer science"],
        "work_styles": ["research", "writing", "analyst", "collaborative"],
        "required_skills": ["policy research", "writing", "AI literacy", "risk analysis", "stakeholder communication", "ethics"],
        "ai_exposure_score": 5,
        "difficulty_score": 6,
        "growth_potential_score": 8,
        "human_advantage": ["judgment", "public reasoning", "ethical framing", "institutional trust"],
        "starter_project": {
            "title": "Write an AI policy brief",
            "description": "Pick one AI risk in schools or workplaces and propose a practical governance approach.",
            "expected_output": "A two-page policy brief with recommendation and tradeoffs.",
        },
    },
]


ALIASES: Dict[str, Set[str]] = {
    "ai": {"ai", "artificial", "intelligence", "genai", "generative", "llm", "machine", "learning", "ml"},
    "coding": {"coding", "code", "programming", "python", "javascript", "js", "software", "web", "app", "developer"},
    "design": {"design", "figma", "ux", "ui", "visual", "prototype", "art", "creative"},
    "business": {"business", "startup", "entrepreneurship", "sales", "marketing", "strategy", "growth"},
    "finance": {"finance", "investment", "markets", "stocks", "banking", "fintech", "economics"},
    "data": {"data", "analytics", "statistics", "excel", "sql", "dashboard", "research"},
    "healthcare": {"health", "healthcare", "medicine", "biology", "bio", "medical", "chemistry"},
    "education": {"education", "teaching", "learning", "mentor", "course", "tutor"},
    "security": {"security", "cybersecurity", "hacking", "privacy", "network"},
    "climate": {"climate", "sustainability", "environment", "energy", "green"},
    "creator": {"creator", "content", "youtube", "music", "film", "social", "storytelling", "writing"},
    "robotics": {"robotics", "hardware", "electronics", "iot", "arduino", "sensor", "physics"},
    "policy": {"policy", "law", "ethics", "governance", "government", "debate", "society"},
}


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
        top_n = max(1, min(payload.options.preferred_number_of_paths, 5))

        rank_start = time.time()
        ranked_results = self._rank_careers_with_logic(profile)
        rank_end = time.time()

        career_paths = [self._build_career_path(profile, item["career"], index, item) for index, item in enumerate(ranked_results[:top_n])]
        recommended = career_paths[0]
        simulation_id = f"sim_{uuid.uuid4().hex[:12]}"

        simulation = {
            "simulation_id": simulation_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "student_summary": {
                "name": profile["name"],
                "profile_headline": self._headline(profile, recommended),
                "dominant_interests": profile.get("interests", [])[:3],
                "strongest_existing_skills": profile.get("current_skills", [])[:3],
                "main_concerns": profile.get("career_fears", [])[:2],
            },
            "career_dna": self._generate_dna(profile),
            "career_paths": career_paths,
            "comparison": {
                "recommended_path_id": recommended["career_id"],
                "summary": self._comparison_summary(profile, recommended, career_paths),
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
            "action_sprint": self._action_sprint(recommended, profile),
            "trace": {
                "pipeline_version": "v2.0-profile-sensitive",
                "steps": [
                    {
                        "step_id": "profile_normalization",
                        "status": "completed",
                        "summary": "Normalized interests, subjects, skills, goals, fears, and free-text profile notes.",
                        "detail": {"input_signals": len(self._profile_tokens(profile)), "career_library_size": len(CAREER_LIBRARY)},
                    },
                    {
                        "step_id": "career_ranking",
                        "status": "completed",
                        "summary": "Ranked the expanded career library using weighted overlap and semantic aliases.",
                        "detail": {
                            "latency_ms": round((rank_end - rank_start) * 1000, 2),
                            "top_matches": [
                                {
                                    "career_id": r["career"]["career_id"],
                                    "fit_score": r["fit_score"],
                                    "signals": r["logic"]["matched_signals"][:8],
                                }
                                for r in ranked_results[:top_n]
                            ],
                        },
                    },
                    {
                        "step_id": "roadmap_generation",
                        "status": "completed",
                        "summary": "Generated career-specific projects, skill gaps, AI exposure notes, and sprint actions.",
                        "detail": {"paths_returned": len(career_paths)},
                    },
                ],
                "warnings": [
                    "Career recommendations are directional and meant for exploration, not final life decisions.",
                    "Core simulation is deterministic for reliability; live Gemini is used only for assistant/automation features when configured.",
                ],
            },
        }
        self._cache[simulation_id] = simulation
        simulation["trace"]["steps"].append(
            {
                "step_id": "response_assembly",
                "status": "completed",
                "summary": "Assembled response for dashboard, comparison, skill map, sprint, trace, and share pages.",
                "detail": {"total_latency_ms": round((time.time() - start_time) * 1000, 2)},
            }
        )
        return {"success": True, "simulation": simulation}

    def _build_career_path(self, profile: Dict[str, Any], career: Dict[str, Any], index: int, ranked_item: Dict[str, Any]) -> Dict[str, Any]:
        fit_score = int(ranked_item["fit_score"])
        matched_skills = self._matched_skills(profile.get("current_skills", []), career["required_skills"])
        missing_skills = [skill for skill in career["required_skills"] if skill not in matched_skills][:4]
        signals = ranked_item["logic"]["matched_signals"]

        return {
            "career_id": career["career_id"],
            "title": career["title"],
            "cluster": career["cluster"],
            "one_line_summary": career["one_line_summary"],
            "mission_statement": career["mission_statement"],
            "fit_score": fit_score,
            "ai_exposure_score": career["ai_exposure_score"],
            "difficulty_score": career["difficulty_score"],
            "growth_potential_score": career["growth_potential_score"],
            "confidence_score": round(min(0.95, 0.62 + (fit_score / 100) * 0.26 + len(signals) * 0.01 - index * 0.03), 2),
            "why_it_fits": self._why_it_fits(profile, career, signals),
            "required_skills": career["required_skills"],
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "human_advantage": career["human_advantage"],
            "ai_exposure_breakdown": self._ai_exposure_breakdown(career),
            "starter_project": career["starter_project"],
            "learning_roadmap": self._learning_roadmap(career, missing_skills),
            "evolution_timeline": self._generate_timeline(career),
            "future_self": self._generate_future_self(profile, career),
            "risk_heatmap": self._generate_risk_heatmap(career),
        }

    def _rank_careers_with_logic(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        profile_tokens = self._profile_tokens(profile)
        dream_tokens = self._tokens_from(profile.get("dream_careers", [])) | self._tokens_from([profile.get("optional_profile_text") or ""])
        disliked_tokens = self._tokens_from(profile.get("disliked_careers", []))
        results = []

        for career in CAREER_LIBRARY:
            interest_tokens = self._expand_tokens(self._tokens_from(career["related_interests"]))
            subject_tokens = self._expand_tokens(self._tokens_from(career["related_subjects"]))
            skill_tokens = self._expand_tokens(self._tokens_from(career["required_skills"]))
            style_tokens = self._expand_tokens(self._tokens_from(career["work_styles"]))
            career_tokens = interest_tokens | subject_tokens | skill_tokens | style_tokens | self._expand_tokens(self._tokens_from([career["title"], career["cluster"]]))

            interest_match = self._score_overlap(self._tokens_from(profile.get("interests", [])), interest_tokens)
            subject_match = self._score_overlap(self._tokens_from(profile.get("favorite_subjects", [])), subject_tokens)
            skill_match = self._score_overlap(self._tokens_from(profile.get("current_skills", [])), skill_tokens)
            style_match = self._score_overlap(self._tokens_from(profile.get("work_style_preferences", [])), style_tokens)
            dream_match = self._score_overlap(dream_tokens, career_tokens)
            broad_match = self._score_overlap(profile_tokens, career_tokens)
            dislike_penalty = min(14, len(disliked_tokens & career_tokens) * 5)

            weighted = (
                34 * interest_match
                + 18 * subject_match
                + 18 * skill_match
                + 12 * style_match
                + 12 * dream_match
                + 6 * broad_match
            )
            # Keep the score responsive instead of saturating every decent match at 98.
            # Strong profile-career matches now land in the 82-96 range; weak matches stay lower.
            score = int(round(38 + (weighted * 0.58) - dislike_penalty))
            score = max(36, min(96, score))
            matched_signals = sorted(profile_tokens & career_tokens)
            results.append(
                {
                    "career": career,
                    "fit_score": score,
                    "logic": {
                        "matched_signals": matched_signals,
                        "component_scores": {
                            "interest": round(interest_match, 2),
                            "subject": round(subject_match, 2),
                            "skill": round(skill_match, 2),
                            "work_style": round(style_match, 2),
                            "dream_text": round(dream_match, 2),
                            "broad": round(broad_match, 2),
                            "dislike_penalty": dislike_penalty,
                        },
                        "algorithm": "weighted_semantic_overlap_v2.0",
                    },
                }
            )
        return sorted(results, key=lambda item: item["fit_score"], reverse=True)

    def _profile_tokens(self, profile: Dict[str, Any]) -> Set[str]:
        values: List[str] = []
        for key in [
            "interests",
            "favorite_subjects",
            "current_skills",
            "work_style_preferences",
            "career_fears",
            "dream_careers",
            "disliked_careers",
        ]:
            raw = profile.get(key, [])
            if isinstance(raw, list):
                values.extend(raw)
        if profile.get("optional_profile_text"):
            values.append(profile["optional_profile_text"])
        return self._expand_tokens(self._tokens_from(values))

    def _tokens_from(self, values: List[str]) -> Set[str]:
        tokens: Set[str] = set()
        for value in values:
            if value is None:
                continue
            text = str(value).lower()
            for token in re.findall(r"[a-z0-9+#.]+", text):
                if len(token) > 1:
                    tokens.add(token)
            compact = text.strip().replace(" ", "_")
            if compact and len(compact) > 1:
                tokens.add(compact)
        return tokens

    def _expand_tokens(self, tokens: Set[str]) -> Set[str]:
        expanded = set(tokens)
        for canonical, aliases in ALIASES.items():
            if tokens & aliases or canonical in tokens:
                # Add the canonical concept, but do not add every alias back into the set.
                # Adding all aliases polluted unrelated careers and caused the same top roles
                # to appear for many different profiles.
                expanded.add(canonical)
        return expanded

    def _score_overlap(self, user_tokens: Set[str], target_tokens: Set[str]) -> float:
        if not user_tokens or not target_tokens:
            return 0.0
        user_expanded = self._expand_tokens(user_tokens)
        overlap = user_expanded & target_tokens
        return min(1.0, len(overlap) / max(2, len(user_expanded)) * 1.25)

    def _matched_skills(self, current_skills: List[str], required_skills: List[str]) -> List[str]:
        current_tokens = self._expand_tokens(self._tokens_from(current_skills))
        matched = []
        for skill in required_skills:
            if self._expand_tokens(self._tokens_from([skill])) & current_tokens:
                matched.append(skill)
        return matched

    def _why_it_fits(self, profile: Dict[str, Any], career: Dict[str, Any], signals: List[str]) -> List[str]:
        interest_text = ", ".join(profile.get("interests", [])[:2]) or "your stated interests"
        skill_text = ", ".join(profile.get("current_skills", [])[:2]) or "your current skills"
        signal_text = ", ".join(signals[:4]) if signals else career["cluster"].lower()
        return [
            f"Connects your interest in {interest_text} with the {career['cluster']} space.",
            f"Builds from your current strengths in {skill_text} instead of assuming a blank slate.",
            f"Matched profile signals include {signal_text}.",
        ]

    def _ai_exposure_breakdown(self, career: Dict[str, Any]) -> List[Dict[str, Any]]:
        high = career["ai_exposure_score"] >= 7
        return [
            {
                "task": "Routine research and first drafts",
                "ai_role": "AI can speed up summarization, ideation, and first-pass output.",
                "human_role": "Human verifies accuracy, context, and usefulness.",
                "risk_level": "medium" if high else "low",
            },
            {
                "task": "Decision-making and tradeoffs",
                "ai_role": "AI can compare options and surface blind spots.",
                "human_role": "Human owns judgment, ethics, taste, and responsibility.",
                "risk_level": "low",
            },
            {
                "task": "Execution at scale",
                "ai_role": "AI can automate repetitive execution loops.",
                "human_role": "Human designs the system, handles edge cases, and earns trust.",
                "risk_level": "high" if career["ai_exposure_score"] >= 8 else "medium",
            },
        ]

    def _learning_roadmap(self, career: Dict[str, Any], gaps: List[str]) -> List[Dict[str, Any]]:
        first_gap = gaps[0] if gaps else career["required_skills"][0]
        second_gap = gaps[1] if len(gaps) > 1 else career["required_skills"][1]
        return [
            {
                "step": 1,
                "title": f"Build the foundation: {first_gap}",
                "description": f"Learn the minimum usable level of {first_gap} through one focused tutorial and one small exercise.",
                "estimated_time": "3-5 hours",
            },
            {
                "step": 2,
                "title": f"Apply it in context: {second_gap}",
                "description": f"Use {second_gap} inside a mini-project connected to {career['title']}.",
                "estimated_time": "5-8 hours",
            },
            {
                "step": 3,
                "title": "Package the proof",
                "description": "Write a short case study explaining the problem, approach, result, and what AI helped with.",
                "estimated_time": "2-3 hours",
            },
        ]

    def _generate_dna(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        signals = self._profile_tokens(profile)
        return [
            {"label": "Creation", "value": self._trait(signals, {"coding", "art", "design", "writing", "building", "creator"})},
            {"label": "Analysis", "value": self._trait(signals, {"mathematics", "statistics", "economics", "research", "finance", "data"})},
            {"label": "Empathy", "value": self._trait(signals, {"psychology", "teaching", "healthcare", "communication", "community", "social"})},
            {"label": "Strategy", "value": self._trait(signals, {"business", "management", "planning", "entrepreneurship", "leadership", "marketing"})},
            {"label": "Technical", "value": self._trait(signals, {"python", "engineering", "hardware", "software", "ai", "apis"})},
        ]

    def _trait(self, signals: Set[str], target_tokens: Set[str]) -> float:
        overlap = len(signals & self._expand_tokens(target_tokens))
        return round(min(0.95, 0.18 + overlap * 0.16), 2)

    def _generate_timeline(self, career: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {
                "period": "0-3 months",
                "title": "Exploration phase",
                "description": f"Build one small project that proves interest in {career['cluster']}.",
                "unlocked_capabilities": ["Domain vocabulary", "first portfolio proof"],
                "risk_factor": 0.12,
            },
            {
                "period": "6-12 months",
                "title": f"Junior {career['title']} signal",
                "description": "Add more depth through internships, open-source, volunteering, or applied case studies.",
                "unlocked_capabilities": ["execution confidence", "feedback loops"],
                "risk_factor": 0.28,
            },
            {
                "period": "2-3 years",
                "title": "Specialized operator",
                "description": "Develop a visible niche by combining domain skill, AI literacy, and communication.",
                "unlocked_capabilities": ["specialization", "career narrative"],
                "risk_factor": 0.42,
            },
        ]

    def _generate_future_self(self, profile: Dict[str, Any], career: Dict[str, Any]) -> Dict[str, Any]:
        name = profile.get("name", "The user")
        interest = (profile.get("interests") or [career["cluster"]])[0]
        return {
            "headline": f"Emerging {career['title']}",
            "narrative": f"{name} can start by connecting {interest} with practical proof in {career['cluster']}. The goal is not to predict one fixed future, but to build evidence through small projects and feedback.",
            "future_resume_highlights": [
                f"Built a starter project related to {career['title']}.",
                "Documented skills, decisions, and measurable learning progress.",
                "Used AI tools responsibly while retaining human judgment and ownership.",
            ],
        }

    def _generate_risk_heatmap(self, career: Dict[str, Any]) -> List[Dict[str, Any]]:
        ai_score = career["ai_exposure_score"] / 10
        return [
            {"category": "Automation", "score": ai_score, "description": "How much routine work may be AI-assisted or automated."},
            {"category": "Skill Half-life", "score": max(0.25, ai_score - 0.18), "description": "How quickly tools and practices may change."},
            {"category": "Entry Competition", "score": 0.42 if career["growth_potential_score"] >= 8 else 0.34, "description": "How crowded the beginner path may feel."},
            {"category": "Trust Requirement", "score": 0.55 if career["cluster"] in {"Healthcare & Bio", "Security & Trust", "Policy & Governance"} else 0.32, "description": "How much credibility and responsibility the role requires."},
        ]

    def _skill_gap_analysis(self, profile: Dict[str, Any], careers: List[Dict[str, Any]]) -> Dict[str, Any]:
        gap_map: Dict[str, Dict[str, Any]] = {}
        for career in careers:
            for skill in career["missing_skills"]:
                if skill not in gap_map:
                    gap_map[skill] = {"skill": skill, "priority": "high", "reason": f"Common requirement for the {career['title']} path.", "career_ids": []}
                gap_map[skill]["career_ids"].append(career["career_id"])

        gaps = list(gap_map.values())[:5]
        return {
            "top_existing_skills": profile.get("current_skills", [])[:4],
            "highest_priority_gaps": [{"skill": g["skill"], "priority": g["priority"], "reason": g["reason"]} for g in gaps],
            "skill_matrix": [
                {"skill": g["skill"], "current_level": 1, "target_level": 4, "relevant_career_ids": g["career_ids"]}
                for g in gaps
            ],
            "skill_tree": [
                {
                    "id": "root",
                    "label": "Career Readiness",
                    "status": "mastered",
                    "children": [
                        {"id": "current-strengths", "label": "Current strengths", "status": "mastered", "children": []},
                        {"id": "priority-gap", "label": gaps[0]["skill"] if gaps else "Next skill", "status": "learning", "children": []},
                        {"id": "portfolio-proof", "label": "Portfolio proof", "status": "locked", "children": []},
                    ],
                }
            ],
        }

    def _action_sprint(self, career: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
        first_interest = (profile.get("interests") or [career["cluster"]])[0]
        project = career["starter_project"]
        return {
            "focus_career_id": career["career_id"],
            "sprint_title": f"7-Day {career['title']} Exploration Sprint",
            "expected_final_output": project["expected_output"],
            "days": [
                {"day": 1, "title": "Define the problem", "task": f"List 5 real problems around {first_interest} and choose one worth exploring.", "deliverable": "One clear problem statement."},
                {"day": 2, "title": "Study the role", "task": f"Research what a {career['title']} actually does and note 5 daily tasks.", "deliverable": "Role notes with task examples."},
                {"day": 3, "title": "Map required skills", "task": f"Compare your current skills with {', '.join(career['required_skills'][:3])}.", "deliverable": "Skill gap checklist."},
                {"day": 4, "title": "Build the smallest proof", "task": project["description"], "deliverable": "Rough prototype, outline, dashboard, or case draft."},
                {"day": 5, "title": "Use AI responsibly", "task": "Use AI to accelerate research or drafting, then manually verify and improve the result.", "deliverable": "Before/after note showing what AI helped with."},
                {"day": 6, "title": "Get feedback", "task": "Show the output to 2-3 people and capture what confused or interested them.", "deliverable": "Feedback notes."},
                {"day": 7, "title": "Package the learning", "task": "Write a short case study: problem, approach, result, skill gaps, next step.", "deliverable": project["expected_output"]},
            ],
        }

    def _headline(self, profile: Dict[str, Any], recommended: Dict[str, Any]) -> str:
        interest = (profile.get("interests") or ["career exploration"])[0]
        return f"A {recommended['cluster']} leaning profile connecting {interest} with practical next steps."

    def _comparison_summary(self, profile: Dict[str, Any], recommended: Dict[str, Any], careers: List[Dict[str, Any]]) -> str:
        return (
            f"Your strongest current path is {recommended['title']}. "
            f"The recommendation is based on your interests, subjects, skills, work style, and stated concerns. "
            f"The other paths are included as alternatives, not weaker identities."
        )
