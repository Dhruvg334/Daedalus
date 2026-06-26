from typing import List, Dict, Any
from ..schemas.hubs import LearningResource
import json

class LearningService:
    def __init__(self):
        self._resources = [
            {
                "id": "res_1",
                "title": "Mastering Python for Automation",
                "provider": "FastAPI Docs / Python.org",
                "type": "documentation",
                "difficulty": "beginner",
                "estimated_time": "10 hours",
                "prerequisites": ["Basic Logic"],
                "quality_score": 4.9,
                "tags": ["python", "automation", "backend"],
                "url": "https://docs.python.org",
                "career_ids": ["ai_automation_builder"]
            },
            {
                "id": "res_2",
                "title": "Figma for AI Product Design",
                "provider": "YouTube / Figma",
                "type": "video",
                "difficulty": "intermediate",
                "estimated_time": "5 hours",
                "prerequisites": ["Design Basics"],
                "quality_score": 4.7,
                "tags": ["design", "figma", "ai"],
                "url": "https://figma.com/resources",
                "career_ids": ["ai_product_designer"]
            },
            {
                "id": "res_3",
                "title": "Introduction to Statistical Policy",
                "provider": "OpenCourseWare",
                "type": "course",
                "difficulty": "intermediate",
                "estimated_time": "20 hours",
                "prerequisites": ["Mathematics"],
                "quality_score": 4.8,
                "tags": ["data", "policy", "statistics"],
                "url": "https://ocw.mit.edu",
                "career_ids": ["data_policy_analyst"]
            }
        ]

    def get_learning_path(self, career_id: str) -> List[LearningResource]:
        filtered = [
            LearningResource(**res)
            for res in self._resources
            if career_id in res["career_ids"] or not career_id
        ]
        return filtered
