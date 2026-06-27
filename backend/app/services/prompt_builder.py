import json
from typing import Any, Dict, List

def build_enhancement_prompt(profile: Dict[str, Any], prebuilt_paths: List[Dict[str, Any]]) -> str:
    """Builds a compressed prompt for Gemini to enhance phrasing of selected careers."""
    # Compress profile signals to save tokens
    compressed_profile = {
        "interests": profile.get("interests", [])[:4],
        "favorite_subjects": profile.get("favorite_subjects", [])[:3],
        "current_skills": profile.get("current_skills", [])[:4],
        "career_fears": profile.get("career_fears", [])[:2],
        "dream_careers": profile.get("dream_careers", [])[:2],
        "optional_profile_text": (profile.get("optional_profile_text") or "")[:250]
    }
    
    # Compress prebuilt paths to focus Gemini only on editable copy
    compressed_paths = []
    for path in prebuilt_paths:
        compressed_paths.append({
            "career_id": path["career_id"],
            "title": path["title"],
            "cluster": path["cluster"],
            "one_line_summary": path["one_line_summary"],
            "why_it_fits": path["why_it_fits"],
            "starter_project": {
                "title": path["starter_project"].get("title"),
                "description": path["starter_project"].get("description"),
                "expected_output": path["starter_project"].get("expected_output"),
            },
            "learning_roadmap": [
                {
                    "step": step["step"],
                    "title": step["title"],
                    "description": step["description"]
                }
                for step in path.get("learning_roadmap", [])
            ],
            "future_self": {
                "headline": path["future_self"].get("headline") if path.get("future_self") else "",
                "narrative": path["future_self"].get("narrative") if path.get("future_self") else ""
            }
        })
        
    prompt = f"""You are a professional career coach refining a student simulation.
Your job is NOT to select or recommend new careers. You MUST keep the selected career_id and titles exactly as provided.
Refine the phrasing, vocabulary, and tone of 'why_it_fits', 'starter_project', 'learning_roadmap', and 'future_self' to be highly personalized, encouraging, and tailored to the student's profile.

Student Profile:
{json.dumps(compressed_profile, ensure_ascii=False)}

Pre-Selected Recommendations to Refine:
{json.dumps(compressed_paths, ensure_ascii=False)}

Return JSON shape:
{{
  "recommendations": [
    {{
      "career_id": "string",
      "why_it_fits": [
        "personalized explanation 1",
        "personalized explanation 2",
        "personalized explanation 3"
      ],
      "starter_project": {{
        "title": "refined project title",
        "description": "refined project description",
        "expected_output": "refined expected output"
      }},
      "learning_roadmap": [
        {{
          "step": 1,
          "title": "refined step 1 title",
          "description": "refined step 1 description"
        }},
        {{
          "step": 2,
          "title": "refined step 2 title",
          "description": "refined step 2 description"
        }},
        {{
          "step": 3,
          "title": "refined step 3 title",
          "description": "refined step 3 description"
        }}
      ],
      "future_self": {{
        "headline": "refined future headline",
        "narrative": "refined future narrative narrative"
      }}
    }}
  ]
}}
Return ONLY valid JSON.
"""
    return prompt
