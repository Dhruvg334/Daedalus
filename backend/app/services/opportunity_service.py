from typing import List, Dict, Any, Optional
from ..schemas.hubs import Opportunity
import uuid

class OpportunityService:
    def __init__(self):
        # Mock data for demonstration. In production, this would use adapters for LinkedIn, Indeed, Devpost, etc.
        self._mock_data = [
            {
                "id": "opp_1",
                "title": "Junior AI Automation Intern",
                "organization": "FutureTech Systems",
                "location": "Remote",
                "type": "internship",
                "salary_stipend": "$2000/mo",
                "deadline": "2024-12-31",
                "requirements": ["Python", "API Integration"],
                "difficulty": "beginner",
                "source": "Direct",
                "apply_url": "https://example.com/apply",
                "relevance_score": 0.95,
                "career_ids": ["ai_automation_builder"]
            },
            {
                "id": "opp_2",
                "title": "UX Design Challenge",
                "organization": "CreativeFlow",
                "location": "Online",
                "type": "competition",
                "deadline": "2024-11-15",
                "requirements": ["Figma", "Prototyping"],
                "difficulty": "intermediate",
                "source": "Devpost",
                "apply_url": "https://example.com/challenge",
                "relevance_score": 0.88,
                "career_ids": ["ai_product_designer"]
            },
            {
                "id": "opp_3",
                "title": "Data Analyst (Contract)",
                "organization": "Global Insights",
                "location": "Hybrid",
                "type": "freelance",
                "salary_stipend": "$50/hr",
                "deadline": "2024-10-20",
                "requirements": ["Excel", "Statistics"],
                "difficulty": "intermediate",
                "source": "Upwork",
                "apply_url": "https://example.com/project",
                "relevance_score": 0.92,
                "career_ids": ["data_policy_analyst"]
            }
        ]

    def get_relevant_opportunities(self, career_id: str, profile: Optional[Dict[str, Any]] = None) -> List[Opportunity]:
        # Filter mock data by career_id
        filtered = [
            Opportunity(**opp)
            for opp in self._mock_data
            if career_id in opp["career_ids"] or not career_id
        ]
        return sorted(filtered, key=lambda x: x.relevance_score, reverse=True)
