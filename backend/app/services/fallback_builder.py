import os
import json
import logging
from typing import Any, Dict, List

logger = logging.getLogger("daedalus.fallback_builder")

TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fallback_templates")

def get_template_filename(cluster: str) -> str:
    """Maps a career cluster name to the corresponding template filename."""
    c_lower = cluster.lower()
    if "ai" in c_lower:
        return "ai_ml.json"
    elif any(term in c_lower for term in ["health", "bio", "medical", "clinical", "medicine", "life sciences"]):
        return "healthcare.json"
    elif any(term in c_lower for term in ["robotics", "hardware", "iot", "electronics"]):
        return "robotics.json"
    elif any(term in c_lower for term in ["music", "arts", "performing", "creator", "film", "acting"]):
        return "creative_arts.json"
    elif any(term in c_lower for term in ["software", "cloud", "developer", "engineering", "devops", "code"]):
        return "backend.json"
    elif any(term in c_lower for term in ["design", "ux", "ui", "visual"]):
        return "design.json"
    elif any(term in c_lower for term in ["business", "product", "growth", "finance", "markets", "entrepreneurship", "startup", "founder"]):
        return "business.json"
    return "general.json"

def load_template(cluster: str) -> Dict[str, Any]:
    """Loads fallback template JSON based on the career cluster."""
    filename = get_template_filename(cluster)
    path = os.path.join(TEMPLATE_DIR, filename)
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.warning(f"Failed to load fallback template {filename}: {e}")
    
    # Fallback to general.json if specific one fails
    general_path = os.path.join(TEMPLATE_DIR, "general.json")
    try:
        with open(general_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Critical failure: general.json fallback template missing or unreadable: {e}")
        # Return hardcoded fallback dictionary to prevent crashes
        return {
            "learning_roadmap": [],
            "ai_exposure_breakdown": [],
            "evolution_timeline": [],
            "future_self": {"headline": "Emerging Practitioner", "narrative": "", "future_resume_highlights": []},
            "risk_heatmap": []
        }

def build_career_path(profile: Dict[str, Any], career: Dict[str, Any], index: int, fit_score: int, signals: List[str]) -> Dict[str, Any]:
    """Dynamically composes a CareerPath response structure using templates and customizing values."""
    template = load_template(career["cluster"])
    
    # Process matched/missing skills
    current_skills = profile.get("current_skills", [])
    required_skills = career.get("required_skills", [])
    matched_skills = [s for s in required_skills if any(cs.lower().strip() == s.lower().strip() for cs in current_skills)]
    missing_skills = [s for s in required_skills if s not in matched_skills][:4]
    
    first_gap = missing_skills[0] if missing_skills else (required_skills or ["domain basics"])[0]
    second_gap = missing_skills[1] if len(missing_skills) > 1 else (required_skills or ["advanced applications", "domain basics"])[-1]
    
    # Formats the templates with specific placeholders
    title = career["title"]
    cluster = career["cluster"]
    name = profile.get("name", "The user")
    
    # 1. Format learning roadmap
    learning_roadmap = []
    for step in template.get("learning_roadmap", []):
        learning_roadmap.append({
            "step": step["step"],
            "title": step["title"].replace("{first_gap}", first_gap).replace("{second_gap}", second_gap),
            "description": step["description"].replace("{first_gap}", first_gap).replace("{second_gap}", second_gap),
            "estimated_time": step["estimated_time"]
        })
        
    # 2. Format timeline
    evolution_timeline = []
    for item in template.get("evolution_timeline", []):
        evolution_timeline.append({
            "period": item["period"],
            "title": item["title"].replace("{title}", title).replace("{cluster}", cluster),
            "description": item["description"].replace("{title}", title).replace("{cluster}", cluster),
            "unlocked_capabilities": item["unlocked_capabilities"],
            "risk_factor": item["risk_factor"]
        })
        
    # 3. Format future self
    future_self_tpl = template.get("future_self", {})
    future_self = {
        "headline": future_self_tpl.get("headline", "Emerging {title}").replace("{title}", title).replace("{cluster}", cluster),
        "narrative": future_self_tpl.get("narrative", "").replace("{name}", name).replace("{title}", title).replace("{cluster}", cluster),
        "future_resume_highlights": [
            h.replace("{title}", title).replace("{cluster}", cluster)
            for h in future_self_tpl.get("future_resume_highlights", [])
        ]
    }
    
    # 4. Fit explanation (Why it fits)
    interest_text = ", ".join(profile.get("interests", [])[:2]) or "your stated interests"
    skill_text = ", ".join(current_skills[:2]) or "your current skills"
    signal_text = ", ".join(signals[:4]) if signals else cluster.lower()
    why_it_fits = [
        f"Connects your interest in {interest_text} with the {cluster} space.",
        f"Builds from your current strengths in {skill_text} instead of assuming a blank slate.",
        f"Matched profile signals include {signal_text}.",
    ]
    
    # 5. Build starter project
    starter_project = career.get("starter_project", {
        "title": f"Build a starter project for {title}",
        "description": "Create one small artifact that proves interest and early ability.",
        "expected_output": "A portfolio-ready artifact with feedback notes."
    })
    
    confidence_score = round(min(0.95, 0.62 + (fit_score / 100) * 0.26 + len(signals) * 0.01 - index * 0.03), 2)
    
    return {
        "career_id": career["career_id"],
        "title": title,
        "cluster": cluster,
        "one_line_summary": career["one_line_summary"],
        "mission_statement": career.get("mission_statement") or f"Build a credible path in {cluster.lower()} through focused practice.",
        "fit_score": fit_score,
        "ai_exposure_score": career.get("ai_exposure_score", 5),
        "difficulty_score": career.get("difficulty_score", 6),
        "growth_potential_score": career.get("growth_potential_score", 7),
        "confidence_score": confidence_score,
        "why_it_fits": why_it_fits,
        "required_skills": required_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "human_advantage": career.get("human_advantage", ["taste", "judgment", "communication"]),
        "ai_exposure_breakdown": template.get("ai_exposure_breakdown", []),
        "starter_project": starter_project,
        "learning_roadmap": learning_roadmap,
        "evolution_timeline": evolution_timeline,
        "future_self": future_self,
        "risk_heatmap": template.get("risk_heatmap", [])
    }

def build_action_sprint(career: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    """Builds the 7-day action sprint dynamically from starter project details."""
    first_interest = (profile.get("interests") or [career["cluster"]])[0]
    project = career.get("starter_project", {
        "title": f"Starter project for {career['title']}",
        "description": "Create a small artifact that shows early capability.",
        "expected_output": "A portfolio-ready prototype."
    })
    
    return {
        "focus_career_id": career["career_id"],
        "sprint_title": f"7-Day {career['title']} Exploration Sprint",
        "expected_final_output": project["expected_output"],
        "days": [
            {"day": 1, "title": "Define the problem", "task": f"List 5 real problems around {first_interest} and choose one worth exploring.", "deliverable": "One clear problem statement."},
            {"day": 2, "title": "Study the role", "task": f"Research what a {career['title']} actually does and note 5 daily tasks.", "deliverable": "Role notes with task examples."},
            {"day": 3, "title": "Map required skills", "task": f"Compare your current skills with {', '.join(career.get('required_skills', [])[:3])}.", "deliverable": "Skill gap checklist."},
            {"day": 4, "title": "Build the smallest proof", "task": project["description"], "deliverable": "Rough prototype, outline, dashboard, or case draft."},
            {"day": 5, "title": "Use AI responsibly", "task": "Use AI to accelerate research or drafting, then manually verify and improve the result.", "deliverable": "Before/after note showing what AI helped with."},
            {"day": 6, "title": "Get feedback", "task": "Show the output to 2-3 people and capture what confused or interested them.", "deliverable": "Feedback notes."},
            {"day": 7, "title": "Package the learning", "task": "Write a short case study: problem, approach, result, skill gaps, next step.", "deliverable": project["expected_output"]},
        ]
    }
