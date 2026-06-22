from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class StudentProfile(BaseModel):
    name: str
    age: int
    education_stage: str
    location: str
    interests: List[str]
    favorite_subjects: List[str]
    current_skills: List[str]
    work_style_preferences: List[str]
    career_fears: List[str]
    dream_careers: List[str]
    disliked_careers: List[str]
    weekly_time_available: str
    optional_profile_text: Optional[str] = None

class SimulationOptions(BaseModel):
    include_trace: bool = True
    include_demo_fallback: bool = True
    preferred_number_of_paths: int = 3

class SimulationRequest(BaseModel):
    student_profile: StudentProfile
    options: SimulationOptions

class StudentSummary(BaseModel):
    name: str
    profile_headline: str
    dominant_interests: List[str]
    strongest_existing_skills: List[str]
    main_concerns: List[str]

class AIExposureBreakdown(BaseModel):
    ai_assisted_tasks: List[str]
    human_led_tasks: List[str]
    automation_pressure: str
    human_advantage: str

class CareerPath(BaseModel):
    title: str
    cluster: str
    fit_score: int
    difficulty_score: int
    growth_potential: int
    ai_exposure_score: int
    why_it_fits: str
    day_in_the_life: str
    ai_exposure_breakdown: AIExposureBreakdown
    required_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    starter_project: str

class ComparisonData(BaseModel):
    career: str
    scores: List[int]

class Comparison(BaseModel):
    metric_labels: List[str]
    data: List[ComparisonData]

class SkillGapAnalysis(BaseModel):
    strengths: List[str]
    priority_gaps: List[str]
    roadmap: str

class ActionTask(BaseModel):
    day: int
    task: str
    deliverable: str

class ActionSprint(BaseModel):
    title: str
    tasks: List[ActionTask]
    expected_final_output: str
    next_steps: List[str]

class Trace(BaseModel):
    steps: List[str]
    logic_version: str
    confidence_score: float

class SimulationResult(BaseModel):
    simulation_id: str
    created_at: datetime
    student_summary: StudentSummary
    career_paths: List[CareerPath]
    comparison: Comparison
    skill_gap_analysis: SkillGapAnalysis
    action_sprint: ActionSprint
    trace: Trace

class SimulationResponse(BaseModel):
    success: bool
    simulation: SimulationResult
