from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

EducationStage = Literal["middle_school", "high_school", "early_college", "college", "early_professional"]
RiskLevel = Literal["low", "medium", "high"]
Priority = Literal["high", "medium", "low"]

class StudentProfile(BaseModel):
    name: str = Field(..., min_length=2, max_length=40)
    age: Optional[int] = Field(default=None, ge=10, le=30)
    education_stage: EducationStage
    location: Optional[str] = None
    interests: List[str] = Field(..., min_length=2)
    favorite_subjects: List[str] = Field(..., min_length=1)
    current_skills: List[str] = Field(..., min_length=2)
    work_style_preferences: List[str] = Field(..., min_length=1)
    career_fears: List[str] = Field(..., min_length=1)
    dream_careers: List[str] = Field(default_factory=list)
    disliked_careers: List[str] = Field(default_factory=list)
    weekly_time_available: str
    optional_profile_text: Optional[str] = Field(default=None, max_length=2000)

class SimulationOptions(BaseModel):
    include_trace: bool = True
    include_demo_fallback: bool = True
    preferred_number_of_paths: int = Field(default=3, ge=1, le=5)

class SimulationRequest(BaseModel):
    student_profile: StudentProfile
    options: SimulationOptions = Field(default_factory=SimulationOptions)

class StudentSummary(BaseModel):
    name: str
    profile_headline: str
    dominant_interests: List[str]
    strongest_existing_skills: List[str]
    main_concerns: List[str]

class AIExposureBreakdown(BaseModel):
    task: str
    ai_role: str
    human_role: str
    risk_level: RiskLevel

class StarterProject(BaseModel):
    title: str
    description: str
    expected_output: str

class RoadmapStep(BaseModel):
    step: int
    title: str
    description: str
    estimated_time: str

class CareerMilestone(BaseModel):
    period: str
    title: str
    description: str
    unlocked_capabilities: List[str]
    risk_factor: float = 0.2

class FutureSelf(BaseModel):
    narrative: str
    headline: str
    future_resume_highlights: List[str]

class RiskPoint(BaseModel):
    category: str # e.g. "Automation", "Market Shift", "Skill Obsolescence"
    score: float # 0 to 1
    description: str

class CareerPath(BaseModel):
    career_id: str
    title: str
    cluster: str
    one_line_summary: str
    mission_statement: str = "Empower users through intelligent career navigation."
    fit_score: int
    ai_exposure_score: int
    difficulty_score: int
    growth_potential_score: int
    confidence_score: float
    why_it_fits: List[str]
    required_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    human_advantage: List[str]
    ai_exposure_breakdown: List[AIExposureBreakdown]
    starter_project: StarterProject
    learning_roadmap: List[RoadmapStep]
    evolution_timeline: List[CareerMilestone] = Field(default_factory=list)
    future_self: Optional[FutureSelf] = None
    risk_heatmap: List[RiskPoint] = Field(default_factory=list)

class ComparisonRow(BaseModel):
    career_id: str
    title: str
    fit_score: int
    ai_exposure_score: int
    difficulty_score: int
    growth_potential_score: int
    first_project: str

class Comparison(BaseModel):
    recommended_path_id: str
    summary: str
    comparison_rows: List[ComparisonRow]

class PriorityGap(BaseModel):
    skill: str
    priority: Priority
    reason: str

class SkillMatrixItem(BaseModel):
    skill: str
    current_level: int
    target_level: int
    relevant_career_ids: List[str]

class SkillTreeNode(BaseModel):
    id: str
    label: str
    status: Literal["mastered", "learning", "locked"]
    children: List["SkillTreeNode"] = Field(default_factory=list)

class SkillGapAnalysis(BaseModel):
    top_existing_skills: List[str]
    highest_priority_gaps: List[PriorityGap]
    skill_matrix: List[SkillMatrixItem]
    skill_tree: List[SkillTreeNode] = Field(default_factory=list)

class SprintDay(BaseModel):
    day: int
    title: str
    task: str
    deliverable: str

class ActionSprint(BaseModel):
    focus_career_id: str
    sprint_title: str
    expected_final_output: str
    days: List[SprintDay]

class TraceStep(BaseModel):
    step_id: str
    status: str
    summary: str
    detail: Optional[Dict[str, Any]] = None

class Trace(BaseModel):
    pipeline_version: str
    steps: List[TraceStep]
    warnings: List[str]

class CareerDNATrait(BaseModel):
    label: str
    value: float

class SimulationResult(BaseModel):
    simulation_id: str
    created_at: datetime
    student_summary: StudentSummary
    career_dna: List[CareerDNATrait] = Field(default_factory=list)
    career_paths: List[CareerPath]
    comparison: Comparison
    skill_gap_analysis: SkillGapAnalysis
    action_sprint: ActionSprint
    trace: Trace

class SimulationResponse(BaseModel):
    success: bool
    simulation: SimulationResult
