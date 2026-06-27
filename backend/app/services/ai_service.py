try:
    import google.generativeai as genai
except Exception:
    genai = None

import asyncio
import json
import logging
import re
from typing import Any, Dict, List, Optional

from ..core.config import settings
from ..schemas.assistant import AssistantMessage

logger = logging.getLogger("daedalus.ai")


class AIService:
    def __init__(self):
        self.model = None
        self.status_reason = "not_configured"
        if not settings.GOOGLE_API_KEY:
            logger.info("Gemini not configured: GOOGLE_API_KEY missing")
            return
        if genai is None:
            self.status_reason = "package_missing"
            logger.warning("Gemini package unavailable: install google-generativeai")
            return
        try:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
            self.status_reason = "ready"
            logger.info("Gemini configured successfully")
        except Exception as exc:
            self.model = None
            self.status_reason = f"configuration_failed: {str(exc)[:120]}"
            logger.exception("Gemini configuration failed")

    def get_status(self) -> Dict[str, Any]:
        return {
            "provider": "gemini",
            "package_available": genai is not None,
            "api_key_configured": bool(settings.GOOGLE_API_KEY),
            "model_ready": self.model is not None,
            "status_reason": self.status_reason,
        }

    async def rerank_career_ids(self, profile: Dict[str, Any], careers: List[Dict[str, Any]], top_n: int = 3) -> List[str]:
        """Ask Gemini to rerank candidate career IDs. Returns [] on any failure.

        This is deliberately constrained: Gemini can choose from backend-approved IDs only.
        The deterministic ranking remains the fallback and source of complete path data.
        """
        if not self.model:
            logger.info("Gemini rerank skipped", extra={"reason": self.status_reason})
            return []

        candidate_payload = [
            {
                "career_id": c.get("career_id"),
                "title": c.get("title"),
                "cluster": c.get("cluster"),
                "summary": c.get("one_line_summary"),
                "skills": c.get("required_skills", [])[:6],
                "signals": {
                    "interests": c.get("related_interests", [])[:10],
                    "subjects": c.get("related_subjects", [])[:8],
                    "work_styles": c.get("work_styles", [])[:8],
                },
            }
            for c in careers
        ]
        prompt = f"""
You are reranking career options for Daedalus, an AI-era career navigation product.
Choose the best {top_n} career_ids from the provided candidate list for this user profile.
Return ONLY valid JSON in this exact shape: {{"career_ids": ["id1", "id2", "id3"], "reason": "short reason"}}
Do not invent career IDs. Prefer founder/venture paths when founder, startup, business ownership, or entrepreneurship signals are strong.
Prefer finance/investment/fintech paths when finance, stocks, markets, investing, or business valuation signals are strong.

User profile:
{json.dumps(profile, ensure_ascii=False)}

Candidate careers:
{json.dumps(candidate_payload, ensure_ascii=False)}
"""
        try:
            response = await asyncio.wait_for(self.model.generate_content_async(prompt), timeout=10)
            text = response.text or ""
            match = re.search(r"\{.*\}", text, re.S)
            if not match:
                logger.warning("Gemini rerank returned non-JSON", extra={"text_preview": text[:200]})
                return []
            parsed = json.loads(match.group(0))
            allowed = {c.get("career_id") for c in careers}
            ids = [cid for cid in parsed.get("career_ids", []) if cid in allowed]
            logger.info("Gemini rerank completed", extra={"selected_ids": ids, "reason": parsed.get("reason")})
            return ids[:top_n]
        except Exception as exc:
            logger.warning("Gemini rerank failed", extra={"error": str(exc)[:240]})
            return []

    async def get_chat_response(
        self,
        messages: List[AssistantMessage],
        context: Dict[str, Any]
    ) -> str:
        if not self.model:
            return self._offline_chat_response(messages, context)

        system_context = self._build_system_context(context)
        prompt = f"""
        You are the Daedalus AI Career Assistant.
        You have access to this structured career simulation context:
        {json.dumps(system_context)}

        Rules:
        1. Be concise and professional.
        2. Give actionable advice.
        3. Reference specific data from the context when available.
        4. Do not claim certainty about the user's future.
        5. If asked outside career guidance, politely redirect.

        User's question: {messages[-1].content if messages else 'Give me guidance'}
        """

        try:
            response = await asyncio.wait_for(self.model.generate_content_async(prompt), timeout=15)
            logger.info("Gemini assistant response completed")
            return response.text or self._offline_chat_response(messages, context)
        except Exception as exc:
            logger.warning("Gemini assistant response failed", extra={"error": str(exc)[:240]})
            return self._offline_chat_response(messages, context, temporary=True)

    async def generate_automation(
        self,
        automation_type: str,
        context: Dict[str, Any],
        instructions: Optional[str] = None
    ) -> str:
        if not context:
            return self._automation_fallback(automation_type, {}, missing_context=True)

        if not self.model:
            return self._automation_fallback(automation_type, context)

        system_context = self._build_system_context(context)
        prompts = {
            "resume": "Generate a future-focused resume projection based on this career path.",
            "cover_letter": "Write a concise cover letter for an internship or entry opportunity in this field.",
            "linkedin": "Craft a professional LinkedIn About summary and headline.",
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

        try:
            response = await asyncio.wait_for(self.model.generate_content_async(full_prompt), timeout=20)
            logger.info("Gemini automation completed", extra={"automation_type": automation_type})
            return response.text or self._automation_fallback(automation_type, context)
        except Exception as exc:
            logger.warning("Gemini automation failed", extra={"automation_type": automation_type, "error": str(exc)[:240]})
            return self._automation_fallback(automation_type, context, temporary=True)

    def _offline_chat_response(self, messages: List[AssistantMessage], context: Dict[str, Any], temporary: bool = False) -> str:
        system_context = self._build_system_context(context)
        top = system_context.get("target_career") or "your recommended path"
        gaps = system_context.get("skill_gaps") or []
        prefix = "The live assistant is temporarily unavailable, so here is a reliable offline response." if temporary else "Live AI is not configured, so here is a reliable offline response."
        if gaps:
            return f"{prefix}\n\nFocus on {top}. Your highest-priority gaps are {', '.join(gaps[:3])}. Use the 7-day sprint to build one visible proof of work, then update your resume or portfolio with the result."
        return f"{prefix}\n\nFocus on {top}. Start with the recommended sprint, document what you build, and use feedback to decide whether this path deserves deeper effort."

    def _automation_fallback(self, automation_type: str, context: Dict[str, Any], temporary: bool = False, missing_context: bool = False) -> str:
        if missing_context:
            return "Simulation context is no longer available on the backend. Reopen the dashboard from the same browser or rerun the simulation, then try this generation again."

        ctx = self._build_system_context(context)
        name = ctx.get("user_name") or "Candidate"
        career = ctx.get("target_career") or "recommended career path"
        gaps = ctx.get("skill_gaps") or []
        matched = ctx.get("matched_skills") or []
        sprint = ctx.get("sprint_title") or "the recommended sprint"
        note = "\n\nNote: Live Gemini generation is temporarily unavailable, so this is a deterministic fallback generated from your simulation." if temporary else "\n\nNote: Live Gemini generation is not configured, so this is a deterministic fallback generated from your simulation."

        if automation_type == "resume":
            return f"# Projected Resume Snapshot: {name}\n\n## Target Direction\n{career}\n\n## Current Strengths\n- " + "\n- ".join(matched[:5] or ["Communication", "learning agility", "project ownership"]) + f"\n\n## Priority Gaps\n- " + "\n- ".join(gaps[:5] or ["Build one portfolio proof", "document learning progress"]) + f"\n\n## Next Proof\nComplete {sprint} and package the result as a short case study.{note}"
        if automation_type == "cover_letter":
            return f"Dear Hiring Team,\n\nI am exploring opportunities aligned with {career}. My current strengths include {', '.join(matched[:3]) or 'structured learning and problem-solving'}, and I am actively building proof through {sprint}. I am especially interested in roles where I can learn quickly, solve practical problems, and use AI responsibly without replacing human judgment.\n\nRegards,\n{name}{note}"
        if automation_type == "linkedin":
            return f"Headline: Aspiring {career} | Building practical AI-era career proof\n\nAbout: I am exploring {career} through applied projects, structured learning, and feedback. My current strengths include {', '.join(matched[:3]) or 'communication, research, and execution'}, and I am focusing next on {', '.join(gaps[:3]) or 'building visible portfolio evidence'}.{note}"
        if automation_type == "readme":
            return f"# Starter Project for {career}\n\n## Problem\nDescribe the real user problem this project addresses.\n\n## Approach\nExplain the workflow, tools, and AI-assisted steps.\n\n## Skills Practiced\n- " + "\n- ".join((matched + gaps)[:6] or ["research", "execution", "documentation"]) + f"\n\n## Outcome\nSummarize what was built and what feedback was received.{note}"
        return f"# Learning Plan: {career}\n\n1. Complete {sprint}.\n2. Study the first priority gap: {gaps[0] if gaps else 'portfolio proof'}.\n3. Build one public artifact.\n4. Ask for feedback from 2-3 people.\n5. Update your dashboard notes and decide the next experiment.{note}"

    def _build_system_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
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
            "sprint_title": context.get("action_sprint", {}).get("sprint_title"),
        }
