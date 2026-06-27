from __future__ import annotations

import asyncio
import logging
import re
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Set

from sqlalchemy.orm import Session

from ..schemas.simulation import SimulationRequest

logger = logging.getLogger("daedalus.simulation")


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
        "career_id": "startup_venture_builder",
        "title": "Startup Venture Builder",
        "cluster": "Entrepreneurship & Product",
        "one_line_summary": "Builds, validates, and launches new ventures by combining customer insight, product thinking, finance, and execution.",
        "mission_statement": "Turn ambitious ideas into validated businesses with disciplined experiments.",
        "related_interests": ["startup", "founder", "entrepreneur", "business", "strategy", "finance", "product", "sales", "marketing", "innovation"],
        "related_subjects": ["business", "economics", "entrepreneurship", "mathematics", "computer science"],
        "work_styles": ["builder", "leader", "creative", "independent", "risk-taking", "operator"],
        "required_skills": ["customer discovery", "business modeling", "financial basics", "pitching", "product validation", "market research"],
        "ai_exposure_score": 7,
        "difficulty_score": 8,
        "growth_potential_score": 10,
        "human_advantage": ["vision", "taste", "risk judgment", "selling", "leadership", "resilience"],
        "starter_project": {
            "title": "Validate a micro-startup idea",
            "description": "Interview 10 target users, define one painful problem, create a landing page, and measure interest.",
            "expected_output": "A validation memo with user quotes, problem statement, landing page, and next decision.",
        },
    },
    {
        "career_id": "investment_research_analyst",
        "title": "Investment Research Analyst",
        "cluster": "Finance & Markets",
        "one_line_summary": "Studies companies, markets, and financial data to form evidence-backed investment views.",
        "mission_statement": "Convert market noise into disciplined financial judgment.",
        "related_interests": ["finance", "stocks", "markets", "investment", "trading", "economics", "business", "valuation", "founder"],
        "related_subjects": ["economics", "mathematics", "statistics", "accounts", "commerce", "business"],
        "work_styles": ["analyst", "structured", "research", "independent", "decision-making"],
        "required_skills": ["financial modeling", "Excel", "market research", "valuation", "business analysis", "risk assessment"],
        "ai_exposure_score": 6,
        "difficulty_score": 7,
        "growth_potential_score": 8,
        "human_advantage": ["judgment under uncertainty", "business intuition", "risk framing", "source skepticism"],
        "starter_project": {
            "title": "Build a company research note",
            "description": "Pick one public company, study its business model, competitors, risks, and financial signals.",
            "expected_output": "A 2-page investment-style memo with thesis, risks, and key metrics.",
        },
    },
    {
        "career_id": "fintech_founder_operator",
        "title": "FinTech Founder-Operator",
        "cluster": "Finance & Entrepreneurship",
        "one_line_summary": "Builds financial products by combining market understanding, user trust, regulation awareness, and product execution.",
        "mission_statement": "Create useful financial tools that improve decisions, access, or trust.",
        "related_interests": ["finance", "fintech", "startup", "founder", "entrepreneur", "business", "payments", "wealth", "markets", "product"],
        "related_subjects": ["economics", "business", "mathematics", "statistics", "computer science"],
        "work_styles": ["builder", "leader", "analyst", "operator", "structured"],
        "required_skills": ["financial literacy", "product discovery", "regulatory awareness", "user research", "analytics", "pitching"],
        "ai_exposure_score": 7,
        "difficulty_score": 8,
        "growth_potential_score": 9,
        "human_advantage": ["trust building", "business model design", "regulatory judgment", "user empathy"],
        "starter_project": {
            "title": "Prototype a personal finance product",
            "description": "Design a small tool that helps a specific user group make one better financial decision.",
            "expected_output": "A clickable prototype, target user notes, and one-page product thesis.",
        },
    },
    {
        "career_id": "product_manager_ai_era",
        "title": "AI-Era Product Manager",
        "cluster": "Product & Strategy",
        "one_line_summary": "Chooses what to build, why it matters, and how teams should validate and ship useful products.",
        "mission_statement": "Turn user problems, business strategy, and technology capability into focused product decisions.",
        "related_interests": ["product", "business", "startup", "strategy", "design", "technology", "founder", "users", "leadership"],
        "related_subjects": ["business", "economics", "computer science", "psychology", "design"],
        "work_styles": ["collaborative", "leader", "structured", "creative", "operator"],
        "required_skills": ["user research", "prioritization", "roadmapping", "analytics", "communication", "AI literacy"],
        "ai_exposure_score": 6,
        "difficulty_score": 7,
        "growth_potential_score": 9,
        "human_advantage": ["problem framing", "prioritization", "stakeholder alignment", "taste"],
        "starter_project": {
            "title": "Write a product one-pager",
            "description": "Choose one user problem and define the target user, insight, solution, success metric, and product scope.",
            "expected_output": "A clear product brief with tradeoffs and validation plan.",
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
    "business": {"business", "startup", "entrepreneurship", "entrepreneur", "founder", "venture", "sales", "marketing", "strategy", "growth", "operator", "leadership"},
    "finance": {"finance", "investment", "investing", "markets", "market", "stocks", "stock", "trading", "banking", "fintech", "economics", "valuation", "wealth", "portfolio"},
    "data": {"data", "analytics", "statistics", "excel", "sql", "dashboard", "research"},
    "healthcare": {"health", "healthcare", "medicine", "biology", "bio", "medical", "chemistry"},
    "education": {"education", "teaching", "learning", "mentor", "course", "tutor"},
    "security": {"security", "cybersecurity", "hacking", "privacy", "network"},
    "climate": {"climate", "sustainability", "environment", "energy", "green"},
    "creator": {"creator", "content", "youtube", "music", "film", "social", "storytelling", "writing", "instagram", "reels", "editing"},
    "music": {"music", "singing", "singer", "guitar", "guitarist", "piano", "vocals", "vocal", "song", "songs", "songwriting", "dj", "djs", "producer", "artist", "band", "stage", "performance"},
    "sports": {"sports", "fitness", "athlete", "training", "gym", "coach", "coaching", "nutrition"},
    "robotics": {"robotics", "hardware", "electronics", "iot", "arduino", "sensor", "physics"},
    "policy": {"policy", "law", "ethics", "governance", "government", "debate", "society"},

}


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")


def _generated_career(
    title: str,
    cluster: str,
    interests: List[str],
    subjects: List[str],
    work_styles: List[str],
    skills: List[str],
    summary: str,
    starter_title: str,
    ai_exposure: int = 6,
    difficulty: int = 6,
    growth: int = 7,
) -> Dict[str, Any]:
    career_id = _slug(f"{cluster}_{title}")
    return {
        "career_id": career_id,
        "title": title,
        "cluster": cluster,
        "one_line_summary": summary,
        "mission_statement": f"Build a credible path in {cluster.lower()} through focused practice, feedback, and visible proof of work.",
        "related_interests": interests,
        "related_subjects": subjects,
        "work_styles": work_styles,
        "required_skills": skills,
        "ai_exposure_score": ai_exposure,
        "difficulty_score": difficulty,
        "growth_potential_score": growth,
        "human_advantage": ["taste", "judgment", "communication", "trust", "domain intuition"],
        "starter_project": {
            "title": starter_title,
            "description": f"Create one small public artifact that demonstrates interest and early ability in {title.lower()}.",
            "expected_output": "A portfolio-ready mini-project with a short reflection, feedback notes, and next-step decision.",
        },
    }


def _generate_broad_career_library() -> List[Dict[str, Any]]:
    """Create a broad fallback catalog so Daedalus can respond beyond a tiny demo set.

    Gemini can refine the final recommendations when available, but the product must
    still have enough deterministic coverage for music, arts, finance, science,
    humanities, trades, sports, and entrepreneurship profiles.
    """
    clusters = [
        ("Music & Performing Arts", ["music", "singing", "guitar", "piano", "performance", "stage", "songwriting", "vocals"], ["music", "english", "performing arts", "media"], ["creative", "performer", "independent", "collaborative"], [
            ("Singer-Songwriter", "Writes, performs, and releases original music while developing a distinctive artistic identity.", ["vocal training", "songwriting", "stage performance", "music theory", "recording basics", "audience building"], "Record and publish one original song demo", 5, 7, 8),
            ("Session Guitarist", "Performs guitar parts for live shows, recordings, creators, and bands.", ["guitar technique", "ear training", "music theory", "collaboration", "recording workflow", "live performance"], "Record three guitar covers in different styles", 4, 6, 7),
            ("Music Producer", "Shapes songs through arrangement, recording, mixing, and digital production tools.", ["DAW basics", "arrangement", "mixing", "sound design", "collaboration", "music business"], "Produce a one-minute track from scratch", 7, 6, 8),
            ("Live Performer", "Builds a performance career through stage presence, repertoire, and audience connection.", ["stage presence", "repertoire building", "vocal/instrument practice", "audience engagement", "event pitching", "discipline"], "Perform and record a three-song set", 4, 6, 7),
            ("Artist Manager", "Helps artists plan releases, bookings, positioning, partnerships, and growth.", ["artist positioning", "negotiation", "music marketing", "release planning", "networking", "analytics"], "Build a release plan for an emerging artist", 6, 6, 8),
        ]),
        ("Creator Economy", ["content", "youtube", "instagram", "creator", "film", "editing", "storytelling", "social media"], ["english", "media", "art", "business"], ["creative", "independent", "visual", "collaborative"], [
            ("YouTube Creator", "Builds an audience through video ideas, scripting, filming, editing, and community feedback.", ["scripting", "video editing", "thumbnail design", "audience research", "analytics", "storytelling"], "Publish a 3-video test series", 8, 5, 8),
            ("Short-Form Video Producer", "Creates high-retention reels, shorts, and TikToks for brands or personal channels.", ["hook writing", "editing", "trend analysis", "visual pacing", "analytics", "brand voice"], "Create five short-form videos around one theme", 8, 5, 7),
            ("Podcast Producer", "Plans, records, edits, and distributes audio shows with a clear audience promise.", ["research", "audio editing", "interviewing", "story structure", "distribution", "community"], "Record a 10-minute pilot episode", 6, 5, 7),
            ("Digital Storyteller", "Uses writing, visuals, and media to explain ideas and build audience trust.", ["writing", "visual communication", "research", "editing", "narrative design", "publishing"], "Publish a visual story thread or article", 6, 5, 7),
            ("Brand Content Strategist", "Plans content systems that connect audience needs with business goals.", ["content strategy", "audience research", "copywriting", "analytics", "campaign planning", "AI tools"], "Create a 2-week content calendar for a real brand", 7, 5, 8),
        ]),
        ("Finance & Markets", ["finance", "stocks", "investment", "markets", "trading", "economics", "money", "wealth"], ["economics", "commerce", "accounts", "statistics", "mathematics", "business"], ["analyst", "structured", "research", "decision-making", "leader"], [
            ("Investment Research Analyst", "Studies companies and markets to form evidence-backed investment views.", ["financial statements", "valuation", "Excel", "market research", "risk analysis", "writing"], "Write a two-page company research note", 6, 7, 8),
            ("FinTech Founder-Operator", "Builds financial products by combining customer pain, compliance awareness, and technology.", ["customer discovery", "financial basics", "product metrics", "pitching", "risk thinking", "market research"], "Validate one fintech problem with 10 user interviews", 7, 8, 9),
            ("Personal Finance Educator", "Explains money, budgeting, investing, and financial behavior to an audience.", ["financial literacy", "teaching", "writing", "content creation", "source checking", "audience trust"], "Create a beginner finance explainer series", 5, 5, 8),
            ("Quantitative Finance Explorer", "Uses math, statistics, and code to test market hypotheses and models.", ["statistics", "Python", "probability", "backtesting", "data cleaning", "risk metrics"], "Backtest a simple investing rule", 8, 8, 8),
            ("Business Valuation Analyst", "Assesses companies using financial models, industry context, and investment logic.", ["accounting", "valuation", "Excel", "industry analysis", "presentation", "skepticism"], "Build a simple valuation model for one company", 5, 7, 8),
        ]),
        ("Entrepreneurship & Product", ["startup", "founder", "business", "entrepreneur", "venture", "innovation", "sales", "product"], ["business", "economics", "computer science", "mathematics", "english"], ["builder", "leader", "operator", "creative", "risk-taking"], [
            ("Startup Founder", "Finds painful problems, validates demand, and builds early products or services.", ["customer discovery", "selling", "product validation", "pitching", "financial basics", "resilience"], "Validate one startup idea with 10 interviews", 7, 9, 10),
            ("Product Manager", "Turns user needs, business goals, and technical constraints into product decisions.", ["user research", "prioritization", "product metrics", "communication", "market analysis", "roadmapping"], "Write a product one-pager for a problem", 7, 7, 9),
            ("Venture Builder", "Creates repeatable processes to test and launch new business ideas.", ["market research", "experimentation", "landing pages", "analytics", "operations", "pitching"], "Launch a one-page demand test", 7, 8, 9),
            ("Business Development Associate", "Builds partnerships, sales pipelines, and growth opportunities for products.", ["sales writing", "research", "negotiation", "CRM discipline", "presentation", "relationship building"], "Create a 20-lead outreach plan", 5, 5, 8),
            ("Social Enterprise Founder", "Builds mission-driven products or services that balance impact and sustainability.", ["community research", "impact measurement", "fundraising", "operations", "storytelling", "partnerships"], "Map one community problem and solution pilot", 6, 8, 8),
        ]),
        ("Software & AI", ["coding", "software", "ai", "apps", "automation", "developer", "programming", "technology"], ["computer science", "mathematics", "physics"], ["builder", "structured", "problem solving", "independent"], [
            ("Full-Stack Developer", "Builds web applications across frontend, backend, data, and deployment.", ["JavaScript", "React", "APIs", "databases", "testing", "deployment"], "Ship a small full-stack app", 7, 7, 9),
            ("AI Application Developer", "Builds practical applications using LLMs, APIs, retrieval, and workflow logic.", ["Python", "LLM APIs", "prompting", "RAG basics", "evaluation", "deployment"], "Build one AI workflow app", 9, 7, 9),
            ("Automation Engineer", "Connects tools and systems to reduce repetitive manual work.", ["APIs", "workflow design", "Python", "debugging", "logging", "business process"], "Automate a repeated task", 8, 6, 8),
            ("Game Developer", "Creates interactive games using programming, design, art, and player feedback.", ["game engine basics", "programming", "level design", "visual design", "testing", "storytelling"], "Build a tiny playable game", 6, 7, 8),
            ("Cloud Developer", "Deploys and operates reliable applications using cloud infrastructure and monitoring.", ["Linux", "Docker", "cloud basics", "APIs", "monitoring", "security basics"], "Deploy a small service with logs", 6, 7, 8),
        ]),
        ("Data & Research", ["data", "statistics", "analytics", "research", "math", "science", "experiments"], ["statistics", "mathematics", "economics", "computer science", "psychology"], ["analyst", "research", "structured", "independent"], [
            ("Data Analyst", "Turns messy data into useful insights, dashboards, and recommendations.", ["Excel", "SQL", "statistics", "dashboarding", "data cleaning", "communication"], "Analyze one public dataset", 6, 6, 8),
            ("Market Research Analyst", "Studies customers, competitors, and market shifts to support better decisions.", ["survey design", "interviews", "analysis", "writing", "presentation", "source checking"], "Create a competitor research report", 5, 5, 8),
            ("Behavioral Research Assistant", "Studies human behavior through experiments, interviews, and data interpretation.", ["research methods", "psychology", "statistics", "ethics", "documentation", "analysis"], "Design a small behavior survey", 5, 6, 7),
            ("Sports Data Analyst", "Uses performance and game data to support coaching, scouting, or fan insights.", ["sports knowledge", "statistics", "data visualization", "Excel/Python", "storytelling", "domain judgment"], "Analyze one team's performance data", 6, 6, 7),
            ("Policy Research Analyst", "Uses evidence and writing to support public policy or institutional decisions.", ["policy reading", "writing", "data literacy", "stakeholder analysis", "ethics", "presentation"], "Write a short policy brief", 5, 6, 8),
        ]),
        ("Healthcare & Life Sciences", ["biology", "healthcare", "medicine", "doctor", "health", "chemistry", "patients", "research"], ["biology", "chemistry", "psychology", "statistics"], ["helper", "research", "structured", "collaborative"], [
            ("Clinical Research Coordinator", "Supports studies that test health interventions and collect reliable clinical data.", ["research ethics", "biology", "documentation", "communication", "data accuracy", "protocols"], "Summarize one clinical study in plain language", 5, 7, 8),
            ("Health Communication Specialist", "Explains health topics clearly and responsibly for public audiences.", ["health literacy", "writing", "source checking", "visual communication", "empathy", "education"], "Create a health myth-busting explainer", 5, 5, 8),
            ("Biotech Product Analyst", "Connects life science problems with product, market, and technology decisions.", ["biology fundamentals", "market research", "product thinking", "data literacy", "ethics", "presentation"], "Analyze one biotech product category", 6, 7, 8),
            ("Mental Health Program Designer", "Designs structured wellbeing programs and support resources with care boundaries.", ["psychology basics", "program design", "communication", "ethics", "evaluation", "resource mapping"], "Design a school wellbeing resource map", 5, 6, 8),
            ("Public Health Data Analyst", "Uses data to understand health patterns and improve public health decisions.", ["statistics", "public health basics", "dashboarding", "data cleaning", "communication", "ethics"], "Visualize a public health dataset", 6, 7, 8),
        ]),
        ("Engineering & Robotics", ["robotics", "hardware", "electronics", "engineering", "iot", "machines", "physics", "building"], ["physics", "mathematics", "electronics", "computer science"], ["hands-on", "builder", "structured", "problem solving"], [
            ("Robotics Engineer", "Builds intelligent physical systems using mechanics, electronics, code, and sensors.", ["mechanics", "electronics", "Python/C++", "sensors", "control systems", "debugging"], "Build a simple sensor-controlled prototype", 6, 8, 8),
            ("IoT Product Builder", "Creates connected devices and dashboards for real-world monitoring or automation.", ["sensors", "microcontrollers", "APIs", "dashboarding", "electronics", "testing"], "Build a sensor-to-dashboard demo", 7, 7, 8),
            ("Mechanical Design Engineer", "Designs, tests, and improves physical components and systems.", ["CAD", "physics", "materials", "testing", "documentation", "problem solving"], "Model and explain one mechanical mechanism", 4, 7, 8),
            ("Automotive Systems Engineer", "Works on vehicle systems, diagnostics, efficiency, or mobility technologies.", ["mechanical basics", "electronics", "data analysis", "systems thinking", "safety", "testing"], "Analyze one vehicle subsystem", 5, 7, 8),
            ("Drone Systems Builder", "Builds and tests drone systems involving flight, sensors, control, and safety.", ["aerodynamics basics", "electronics", "control systems", "sensors", "safety", "debugging"], "Design a drone mission plan and subsystem map", 6, 8, 8),
        ]),
        ("Law, Policy & Society", ["law", "policy", "ethics", "debate", "society", "government", "justice", "writing"], ["political science", "history", "english", "economics", "law"], ["research", "writing", "analyst", "collaborative"], [
            ("Legal Researcher", "Studies laws, cases, and arguments to support legal reasoning and decisions.", ["legal reading", "writing", "argumentation", "research", "citation", "ethics"], "Write a case-summary brief", 4, 7, 7),
            ("AI Governance Analyst", "Helps organizations use AI responsibly through policies, risk checks, and accountability.", ["AI literacy", "policy research", "risk analysis", "writing", "stakeholder communication", "ethics"], "Draft an AI-use policy for a school club", 6, 6, 8),
            ("Public Policy Analyst", "Uses evidence, writing, and stakeholder understanding to improve institutional decisions.", ["policy analysis", "data literacy", "writing", "economics", "stakeholder mapping", "presentation"], "Write a two-page policy memo", 5, 6, 8),
            ("Journalist", "Investigates, verifies, and explains public-interest stories.", ["reporting", "interviewing", "writing", "fact-checking", "ethics", "audience trust"], "Report one local issue with three sources", 5, 6, 7),
            ("Diplomacy & International Relations Analyst", "Studies global issues, negotiation, policy, and cross-cultural strategy.", ["history", "political analysis", "writing", "languages", "negotiation", "research"], "Write a country-risk briefing", 5, 7, 7),
        ]),
        ("Education & Community", ["teaching", "education", "community", "mentoring", "children", "learning", "training"], ["english", "psychology", "education", "social science"], ["helper", "collaborative", "creative", "structured"], [
            ("Teacher", "Designs learning experiences, explains concepts, and supports student growth.", ["subject mastery", "lesson planning", "communication", "assessment", "patience", "feedback"], "Teach one concept and collect feedback", 4, 6, 7),
            ("Learning Experience Designer", "Creates courses, learning products, and interactive study systems.", ["instructional design", "writing", "assessment design", "UX basics", "AI tutoring tools", "feedback loops"], "Build a 20-minute mini-course", 6, 5, 8),
            ("Community Program Manager", "Runs programs that coordinate people, resources, events, and outcomes.", ["planning", "communication", "operations", "partnerships", "impact tracking", "facilitation"], "Plan a small community workshop", 5, 5, 8),
            ("Career Counselor", "Helps people understand options, constraints, strengths, and next steps.", ["listening", "career research", "coaching", "ethics", "resource mapping", "documentation"], "Create a mini career resource guide", 5, 6, 7),
            ("NGO Operations Coordinator", "Supports nonprofit projects, volunteers, reporting, and field coordination.", ["project coordination", "communication", "reporting", "volunteer management", "data collection", "empathy"], "Design a volunteer tracking sheet", 5, 5, 7),
        ]),
        ("Environment & Sustainability", ["climate", "environment", "sustainability", "green", "energy", "nature", "water"], ["environmental science", "geography", "biology", "statistics", "economics"], ["research", "helper", "analyst", "structured"], [
            ("Sustainability Analyst", "Measures environmental impact and recommends operational improvements.", ["sustainability basics", "data analysis", "reporting", "carbon literacy", "communication", "Excel"], "Analyze one household or campus footprint", 5, 6, 8),
            ("Renewable Energy Project Analyst", "Studies solar, wind, storage, and economics for clean energy projects.", ["energy basics", "Excel", "economics", "project analysis", "policy awareness", "data visualization"], "Compare two solar project scenarios", 5, 7, 8),
            ("Urban Planner", "Designs better cities through mobility, housing, environment, and public-space decisions.", ["geography", "policy", "design thinking", "data literacy", "community research", "presentation"], "Map one local urban problem", 5, 7, 7),
            ("Wildlife Conservation Communicator", "Uses science and storytelling to support biodiversity awareness and action.", ["biology", "storytelling", "field observation", "photography", "source checking", "community engagement"], "Create a local biodiversity field note", 4, 5, 7),
            ("Climate Policy Researcher", "Studies climate rules, incentives, and implementation tradeoffs.", ["policy research", "climate basics", "economics", "writing", "data literacy", "stakeholder analysis"], "Write a climate policy explainer", 5, 6, 8),
        ]),
        ("Sports, Fitness & Wellness", ["sports", "fitness", "athlete", "gym", "training", "nutrition", "coaching"], ["physical education", "biology", "psychology", "statistics"], ["hands-on", "helper", "competitive", "structured"], [
            ("Sports Coach", "Develops athletes through practice design, feedback, motivation, and performance tracking.", ["sport fundamentals", "coaching", "communication", "practice planning", "feedback", "safety"], "Design a 2-week training plan", 4, 6, 7),
            ("Fitness Trainer", "Helps clients improve fitness through safe training plans and habit support.", ["exercise basics", "communication", "programming", "nutrition literacy", "safety", "motivation"], "Create a beginner fitness plan", 4, 5, 7),
            ("Sports Media Analyst", "Explains sports through data, commentary, storytelling, and audience insight.", ["sports knowledge", "writing", "data literacy", "video/audio", "analysis", "presentation"], "Make a match analysis video/script", 6, 5, 7),
            ("Nutrition Educator", "Explains food, health habits, and evidence-aware nutrition basics.", ["nutrition literacy", "biology", "communication", "source checking", "empathy", "habit design"], "Create a nutrition myth explainer", 5, 6, 7),
            ("Sports Event Manager", "Plans sports events through logistics, sponsorship, teams, and operations.", ["event planning", "operations", "communication", "sponsorship", "coordination", "problem solving"], "Plan a small sports tournament", 5, 5, 7),
        ]),
        ("Visual Arts & Design", ["art", "drawing", "painting", "illustration", "design", "fashion", "photography", "animation"], ["art", "design", "english", "media"], ["creative", "visual", "independent", "collaborative"], [
            ("Illustrator", "Creates visual artwork for stories, brands, books, games, and digital products.", ["drawing", "composition", "visual storytelling", "portfolio building", "client communication", "digital tools"], "Create a 5-piece illustration mini-series", 5, 6, 7),
            ("Photographer", "Uses composition, lighting, editing, and storytelling to create visual records and campaigns.", ["composition", "lighting", "editing", "client briefs", "visual storytelling", "portfolio"], "Shoot and edit one themed photo essay", 5, 5, 7),
            ("Fashion Designer", "Creates apparel concepts by combining aesthetics, materials, culture, and market insight.", ["sketching", "textile basics", "trend research", "pattern basics", "branding", "presentation"], "Design a mini fashion capsule concept", 5, 7, 8),
            ("Animator", "Creates motion-based visual stories for media, education, games, and products.", ["storyboarding", "animation tools", "timing", "character design", "editing", "feedback"], "Animate a 15-second sequence", 6, 7, 8),
            ("Interior Experience Designer", "Designs spaces that balance aesthetics, function, mood, and user behavior.", ["space planning", "moodboards", "materials", "client research", "visual presentation", "budgeting"], "Redesign one room as a concept board", 4, 6, 7),
        ]),
        ("Media & Entertainment", ["film", "acting", "cinema", "media", "theatre", "entertainment", "script", "dance"], ["media", "english", "performing arts", "psychology"], ["creative", "performer", "collaborative", "visual"], [
            ("Actor", "Builds character, voice, movement, and performance range for screen or stage.", ["acting technique", "voice", "movement", "audition prep", "script analysis", "discipline"], "Record two contrasting monologues", 4, 7, 7),
            ("Film Director", "Shapes stories through vision, performance, camera language, editing, and team leadership.", ["storytelling", "shot planning", "team direction", "editing literacy", "visual taste", "production planning"], "Shoot a one-minute short film", 6, 8, 8),
            ("Screenwriter", "Writes scripts with structure, character, dialogue, and market awareness.", ["story structure", "dialogue", "character design", "drafting", "feedback", "pitching"], "Write a 5-page short film script", 6, 6, 7),
            ("Dance Performer", "Builds technical skill, expression, stage presence, and repertoire.", ["technique", "routine design", "performance", "discipline", "audience engagement", "collaboration"], "Record a polished 90-second routine", 4, 7, 7),
            ("Entertainment Event Producer", "Plans live experiences through talent, logistics, stage flow, and audience design.", ["event planning", "budgeting", "vendor coordination", "programming", "communication", "crisis handling"], "Plan a small live showcase", 5, 6, 8),
        ]),
        ("Architecture & Built Environment", ["architecture", "buildings", "design", "cities", "space", "construction", "urban"], ["mathematics", "physics", "art", "geography"], ["visual", "structured", "builder", "creative"], [
            ("Architect", "Designs buildings by balancing function, context, structure, and human experience.", ["spatial design", "drawing", "modeling", "building basics", "client research", "presentation"], "Design a small study-space concept", 5, 8, 8),
            ("Urban Mobility Planner", "Improves transport and city movement using data, design, and policy thinking.", ["mapping", "transport basics", "data literacy", "policy", "community research", "presentation"], "Map a local mobility problem", 5, 7, 7),
            ("Landscape Designer", "Designs outdoor spaces through ecology, aesthetics, materials, and user needs.", ["plant basics", "site analysis", "sketching", "materials", "sustainability", "client communication"], "Create a small garden redesign", 4, 6, 7),
            ("Construction Project Coordinator", "Coordinates timelines, people, material, safety, and execution on built projects.", ["planning", "site basics", "communication", "safety", "documentation", "problem solving"], "Create a project execution checklist", 4, 6, 8),
            ("Set Designer", "Creates physical worlds for theatre, film, events, or content production.", ["visual design", "materials", "story interpretation", "budgeting", "collaboration", "sketching"], "Design a set concept for a scene", 5, 6, 7),
        ]),
        ("Hospitality, Travel & Culinary", ["food", "cooking", "travel", "hotel", "hospitality", "tourism", "restaurant", "baking"], ["home science", "business", "geography", "english"], ["hands-on", "service", "creative", "collaborative"], [
            ("Chef", "Creates food experiences through technique, taste, operations, and consistency.", ["cooking technique", "menu planning", "hygiene", "taste development", "operations", "costing"], "Design and cook a 3-dish menu", 4, 7, 8),
            ("Food Content Creator", "Explains food, recipes, culture, and taste through digital media.", ["recipe testing", "video editing", "storytelling", "photography", "audience research", "source checking"], "Create a 3-recipe content series", 7, 5, 8),
            ("Hotel Experience Manager", "Improves guest experience through service design, operations, and feedback loops.", ["service design", "communication", "operations", "feedback analysis", "teamwork", "problem solving"], "Map one guest experience journey", 5, 6, 8),
            ("Travel Planner", "Designs useful itineraries based on constraints, budgets, interests, and local context.", ["research", "budgeting", "geography", "customer understanding", "planning", "communication"], "Create a 3-day itinerary with tradeoffs", 5, 5, 7),
            ("Restaurant Entrepreneur", "Builds food businesses through menu, operations, positioning, cost, and customer demand.", ["food costing", "customer research", "operations", "branding", "sales", "quality control"], "Validate one food-business concept", 5, 8, 9),
        ]),
        ("Trades, Operations & Public Services", ["operations", "logistics", "police", "army", "public service", "management", "safety", "transport"], ["business", "physical education", "civics", "mathematics"], ["structured", "hands-on", "leader", "service"], [
            ("Operations Manager", "Improves daily execution through planning, measurement, systems, and team coordination.", ["process mapping", "communication", "metrics", "coordination", "problem solving", "documentation"], "Map and improve one daily process", 5, 6, 8),
            ("Logistics Coordinator", "Moves goods and services reliably by planning routes, inventory, vendors, and timelines.", ["planning", "Excel", "communication", "vendor coordination", "problem solving", "tracking"], "Design a delivery route plan", 5, 5, 8),
            ("Public Service Officer", "Supports society through administration, public problem solving, and accountable decisions.", ["civics", "writing", "policy basics", "communication", "ethics", "decision-making"], "Write a local public-service improvement note", 4, 7, 8),
            ("Emergency Response Coordinator", "Plans and coordinates response under pressure across people, logistics, and safety.", ["crisis planning", "communication", "first-aid literacy", "coordination", "calm judgment", "documentation"], "Build an emergency response checklist", 4, 7, 8),
            ("Retail Business Operator", "Runs retail execution through customer experience, inventory, sales, and local demand.", ["sales", "inventory", "customer service", "visual merchandising", "cashflow basics", "operations"], "Analyze one local store experience", 4, 5, 8),
        ]),
        ("Psychology & Human Services", ["psychology", "people", "helping", "counselling", "social", "behavior", "therapy"], ["psychology", "biology", "english", "social science"], ["helper", "research", "collaborative", "empathetic"], [
            ("Counselling Psychologist", "Supports people through listening, assessment, ethical care, and evidence-informed intervention.", ["psychology basics", "listening", "ethics", "documentation", "research literacy", "boundaries"], "Create a mental wellbeing resource guide", 4, 9, 8),
            ("User Researcher", "Studies user behavior to help teams build better products and services.", ["interviewing", "synthesis", "psychology", "note-taking", "presentation", "research ethics"], "Run 5 user interviews on one product", 5, 6, 8),
            ("HR Talent Partner", "Helps organizations hire, support, and develop people responsibly.", ["communication", "interviewing", "people analytics", "policy", "empathy", "documentation"], "Design an internship hiring rubric", 5, 5, 8),
            ("Social Worker", "Connects people with support systems while managing sensitive human situations.", ["empathy", "case notes", "resource mapping", "communication", "ethics", "field coordination"], "Map local support resources for one issue", 4, 7, 8),
            ("Behavioral Design Consultant", "Uses behavioral science to improve decisions, habits, products, or public programs.", ["behavioral science", "experiment design", "writing", "data literacy", "ethics", "presentation"], "Design one behavior-change experiment", 6, 7, 8),
        ]),
        ("Agriculture, Food Systems & Animals", ["animals", "farming", "agriculture", "food", "nature", "veterinary", "plants"], ["biology", "environmental science", "chemistry", "geography"], ["hands-on", "helper", "research", "structured"], [
            ("Veterinary Assistant", "Supports animal care through observation, handling, communication, and medical support tasks.", ["animal care", "biology", "observation", "communication", "hygiene", "documentation"], "Create an animal-care observation journal", 4, 7, 7),
            ("Agritech Product Builder", "Solves farming and food-system problems through technology, data, and field insight.", ["field research", "agriculture basics", "data literacy", "product thinking", "communication", "operations"], "Map one farming pain point and solution", 6, 7, 8),
            ("Food Safety Analyst", "Monitors food quality, safety, hygiene, and compliance.", ["microbiology basics", "documentation", "quality checks", "hygiene", "process thinking", "communication"], "Build a food safety checklist", 4, 6, 8),
            ("Plant Science Researcher", "Studies crops, plants, soil, and growth conditions for better food and environment outcomes.", ["botany", "experiment design", "data recording", "chemistry", "observation", "research writing"], "Run a small plant-growth experiment", 4, 7, 7),
            ("Sustainable Farming Entrepreneur", "Builds local food ventures using sustainability, operations, and market demand.", ["sustainability", "farm operations", "customer research", "costing", "storytelling", "quality control"], "Validate one sustainable food product idea", 5, 8, 8),
        ]),
        ("Aerospace, Aviation & Space", ["space", "aerospace", "aviation", "aircraft", "planes", "astronomy", "rockets"], ["physics", "mathematics", "computer science", "geography"], ["structured", "builder", "research", "problem solving"], [
            ("Aerospace Engineer", "Works on flight systems, aerodynamics, structures, or propulsion problems.", ["physics", "mathematics", "CAD", "simulation", "systems thinking", "testing"], "Analyze one aircraft or rocket subsystem", 5, 9, 8),
            ("Pilot Pathway Explorer", "Builds the academic, medical, training, and discipline foundation for aviation careers.", ["navigation basics", "discipline", "communication", "weather literacy", "safety", "decision-making"], "Map a pilot training pathway and requirements", 4, 8, 7),
            ("Space Data Analyst", "Uses satellite, astronomy, or space-mission data for research and decisions.", ["Python", "data analysis", "physics", "visualization", "research", "source checking"], "Analyze one public space dataset", 6, 7, 8),
            ("Drone Operations Specialist", "Plans drone missions for mapping, inspection, media, or agriculture.", ["drone safety", "mapping", "regulations", "mission planning", "sensor basics", "reporting"], "Design one drone mission plan", 5, 6, 8),
            ("Astronomy Communicator", "Explains space science through writing, visuals, teaching, or media.", ["astronomy basics", "writing", "visual explanation", "source checking", "storytelling", "public speaking"], "Create a space explainer for beginners", 5, 5, 7),
        ]),
    ]

    careers: List[Dict[str, Any]] = []
    for cluster, interests, subjects, styles, roles in clusters:
        for title, summary, skills, starter, ai, diff, growth in roles:
            careers.append(_generated_career(title, cluster, interests, subjects, styles, skills, summary, starter, ai, diff, growth))
    return careers


_existing_ids = {career["career_id"] for career in CAREER_LIBRARY}
for _career in _generate_broad_career_library():
    if _career["career_id"] not in _existing_ids:
        CAREER_LIBRARY.append(_career)
        _existing_ids.add(_career["career_id"])

logger.info("Daedalus career library initialized", extra={"career_count": len(CAREER_LIBRARY)})


class SimulationService:
    _cache: Dict[str, Dict[str, Any]] = {}

    def __init__(self, db: Session | None = None):
        self.db = db

    @classmethod
    def get_cached_simulation(cls, simulation_id: str) -> Dict[str, Any] | None:
        return cls._cache.get(simulation_id)

    def run_simulation(self, payload: SimulationRequest) -> Dict[str, Any]:
        # Synchronous fallback retained for local smoke tests and older imports.
        return asyncio.run(self.run_simulation_async(payload))

    async def run_simulation_async(self, payload: SimulationRequest) -> Dict[str, Any]:
        start_time = time.time()
        profile = payload.student_profile.model_dump()
        top_n = max(1, min(payload.options.preferred_number_of_paths, 5))

        rank_start = time.time()
        ranked_results = self._rank_careers_with_logic(profile)
        deterministic_top = [r["career"]["career_id"] for r in ranked_results[:top_n]]
        ai_status = {"used": False, "reason": "not_configured_or_unavailable", "selected_ids": [], "generated_titles": []}
        try:
            from .ai_service import AIService

            ai_service = AIService()
            candidate_pool = [r["career"] for r in ranked_results[:60]]
            ai_careers = await ai_service.generate_career_paths(profile, candidate_pool, top_n=top_n)
            if ai_careers:
                ai_ranked = self._rank_careers_with_logic(profile, career_library=ai_careers)
                ai_ids = [item["career"]["career_id"] for item in ai_ranked]
                used_ids = set(ai_ids)
                remainder = [item for item in ranked_results if item["career"]["career_id"] not in used_ids]
                ranked_results = ai_ranked + remainder
                ai_status = {
                    "used": True,
                    "reason": "gemini_generated_or_selected_paths",
                    "selected_ids": ai_ids[:top_n],
                    "generated_titles": [item["career"].get("title") for item in ai_ranked[:top_n]],
                }
        except Exception as exc:
            logger.warning("Gemini simulation generation unavailable; deterministic ranking used", extra={"error": str(exc)})
            ai_status = {"used": False, "reason": str(exc)[:160], "selected_ids": [], "generated_titles": []}

        qualified_results = [item for item in ranked_results if int(item["fit_score"]) >= 50]
        if not qualified_results:
            logger.info("No career paths crossed display threshold; showing best available path at the minimum display threshold", extra={"top_score": ranked_results[0]["fit_score"] if ranked_results else None})
            qualified_results = ranked_results[:1]
            if qualified_results:
                qualified_results[0] = dict(qualified_results[0])
                qualified_results[0]["fit_score"] = 50
        rank_end = time.time()

        career_paths = [self._build_career_path(profile, item["career"], index, item) for index, item in enumerate(qualified_results[:top_n])]
        if not career_paths:
            raise RuntimeError("No career paths could be generated from the current profile.")
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
                        "detail": {"input_signals": len(self._profile_tokens(profile)), "career_library_size": len(CAREER_LIBRARY), "display_threshold": 50},
                    },
                    {
                        "step_id": "career_ranking",
                        "status": "completed",
                        "summary": "Ranked the expanded career library using weighted overlap and semantic aliases.",
                        "detail": {
                            "latency_ms": round((rank_end - rank_start) * 1000, 2),
                            "deterministic_top": deterministic_top,
                            "ai_rerank": ai_status,
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
                    "Gemini is used for career-path generation when configured; deterministic ranking remains the fallback for reliability.",
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

    def _rank_careers_with_logic(self, profile: Dict[str, Any], career_library: List[Dict[str, Any]] | None = None) -> List[Dict[str, Any]]:
        profile_tokens = self._profile_tokens(profile)
        library = career_library or CAREER_LIBRARY
        dream_tokens = self._tokens_from(profile.get("dream_careers", [])) | self._tokens_from([profile.get("optional_profile_text") or ""])
        disliked_tokens = self._tokens_from(profile.get("disliked_careers", []))
        results = []

        for career in library:
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
                32 * interest_match
                + 16 * subject_match
                + 16 * skill_match
                + 12 * style_match
                + 18 * dream_match
                + 6 * broad_match
            )
            matched_signals = sorted(profile_tokens & career_tokens)
            signal_bonus = min(10, len(matched_signals) * 1.4)
            score = int(round(30 + (weighted * 0.62) + signal_bonus - dislike_penalty))
            if career.get("gemini_generated"):
                score = max(score, int(career.get("fit_score", 72)))
            score = max(28, min(97, score))
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
