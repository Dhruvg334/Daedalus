import google.generativeai as genai
from typing import List, Dict, Any, Optional
import json
from ..core.config import settings
from ..schemas.assistant import AssistantMessage

class AIService:
    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    async def get_chat_response(
        self,
        messages: List[AssistantMessage],
        context: Dict[str, Any]
    ) -> str:
        if not self.model:
            return "AI features are currently unavailable. Please configure GOOGLE_API_KEY."

        # Context Compression: Extract only necessary fields from simulation
        system_context = self._build_system_context(context)

        chat = self.model.start_chat(history=[])

        # Prepare the prompt with structured context
        prompt = f"""
        You are the Daedalus AI Career Assistant.
        You have access to the following user career simulation context:
        {json.dumps(system_context)}

        Rules:
        1. Be concise and professional.
        2. Give actionable advice.
        3. Reference specific data from the context (skills, fit scores, sprint days).
        4. If asked about something outside career guidance, politely redirect.
        5. Do not hallucinate data not present in the context or career library.

        User's question: {messages[-1].content}
        """

        response = await self.model.generate_content_async(prompt)
        return response.text

    async def generate_automation(
        self,
        automation_type: str,
        context: Dict[str, Any],
        instructions: Optional[str] = None
    ) -> str:
        if not self.model:
            return "Automation features are currently unavailable."

        system_context = self._build_system_context(context)

        prompts = {
            "resume": "Generate a future-focused resume based on this career path. Include specific skill highlights and projected achievements.",
            "cover_letter": "Write a compelling cover letter for an internship in this field, emphasizing the human advantage and current skills.",
            "linkedin": "Craft a professional LinkedIn 'About' summary that bridges the user's current background with their target career.",
            "learning_plan": "Create a detailed weekly learning plan to bridge the identified skill gaps.",
            "readme": "Generate a professional GitHub README for the user's starter project."
        }

        base_prompt = prompts.get(automation_type, "Provide career guidance based on this context.")

        full_prompt = f"""
        Context: {json.dumps(system_context)}
        Task: {base_prompt}
        Additional Instructions: {instructions or 'None'}

        Format the output clearly using Markdown.
        """

        response = await self.model.generate_content_async(full_prompt)
        return response.text

    def _build_system_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # Minimize tokens by picking relevant bits
        if not context:
            return {}

        summary = context.get("student_summary", {})
        career_paths = context.get("career_paths", [])
        top_path = career_paths[0] if career_paths else {}

        return {
            "user_name": summary.get("name"),
            "current_interests": summary.get("dominant_interests"),
            "target_career": top_path.get("title"),
            "fit_score": top_path.get("fit_score"),
            "skill_gaps": top_path.get("missing_skills"),
            "matched_skills": top_path.get("matched_skills"),
            "human_advantage": top_path.get("human_advantage"),
            "sprint_title": context.get("action_sprint", {}).get("sprint_title")
        }
