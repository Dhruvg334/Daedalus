export type EducationStage =
  | "middle_school"
  | "high_school"
  | "early_college"
  | "college"
  | "early_professional";

export type StudentProfileInput = {
  name: string;
  age?: number;
  education_stage: EducationStage;
  location?: string;
  interests: string[];
  favorite_subjects: string[];
  current_skills: string[];
  work_style_preferences: string[];
  career_fears: string[];
  dream_careers?: string[];
  disliked_careers?: string[];
  weekly_time_available: string;
  optional_profile_text?: string;
};

export type SimulationRequest = {
  student_profile: StudentProfileInput;
  options: {
    include_trace: boolean;
    include_demo_fallback: boolean;
    preferred_number_of_paths: number;
  };
};

export type DemoPersona = {
  persona_id: string;
  name: string;
  age?: number;
  headline: string;
  interests: string[];
  favorite_subjects: string[];
  current_skills: string[];
  career_fears: string[];
  work_style: string;
  weekly_time_available: string;
  profile: StudentProfileInput;
};

export type AIExposureBreakdown = {
  task: string;
  ai_role: string;
  human_role: string;
  risk_level: "low" | "medium" | "high";
};

export type StarterProject = {
  title: string;
  description: string;
  expected_output: string;
};

export type RoadmapStep = {
  step: number;
  title: string;
  description: string;
  estimated_time: string;
};

export type CareerMilestone = {
  period: string;
  title: string;
  description: string;
  unlocked_capabilities: string[];
  risk_factor: number;
};

export type FutureSelf = {
  narrative: string;
  headline: string;
  future_resume_highlights: string[];
};

export type RiskPoint = {
  category: string;
  score: number;
  description: string;
};

export type CareerPath = {
  career_id: string;
  title: string;
  cluster: string;
  one_line_summary: string;
  mission_statement: string;
  fit_score: number;
  ai_exposure_score: number;
  difficulty_score: number;
  growth_potential_score: number;
  confidence_score: number;
  why_it_fits: string[];
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  human_advantage: string[];
  ai_exposure_breakdown: AIExposureBreakdown[];
  starter_project: StarterProject;
  learning_roadmap: RoadmapStep[];
  evolution_timeline: CareerMilestone[];
  future_self?: FutureSelf;
  risk_heatmap: RiskPoint[];
};

export type SkillTreeNode = {
  id: string;
  label: string;
  status: "mastered" | "learning" | "locked";
  children: SkillTreeNode[];
};

export type SkillGapAnalysis = {
  top_existing_skills: string[];
  highest_priority_gaps: Array<{
    skill: string;
    priority: "high" | "medium" | "low";
    reason: string;
  }>;
  skill_matrix: Array<{
    skill: string;
    current_level: number;
    target_level: number;
    relevant_career_ids: string[];
  }>;
  skill_tree: SkillTreeNode[];
};

export type ActionSprint = {
  focus_career_id: string;
  sprint_title: string;
  expected_final_output: string;
  days: Array<{
    day: number;
    title: string;
    task: string;
    deliverable: string;
  }>;
};

export type Trace = {
  pipeline_version: string;
  steps: Array<{
    step_id: string;
    status: string;
    summary: string;
    detail?: Record<string, unknown>;
  }>;
  warnings: string[];
};

export type CareerDNATrait = {
  label: string;
  value: number;
};

export type Simulation = {
  simulation_id: string;
  created_at: string;
  student_summary: {
    name: string;
    profile_headline: string;
    dominant_interests: string[];
    strongest_existing_skills: string[];
    main_concerns: string[];
  };
  career_dna: CareerDNATrait[];
  career_paths: CareerPath[];
  comparison: {
    recommended_path_id: string;
    summary: string;
    comparison_rows: Array<{
      career_id: string;
      title: string;
      fit_score: number;
      ai_exposure_score: number;
      difficulty_score: number;
      growth_potential_score: number;
      first_project: string;
    }>;
  };
  skill_gap_analysis: SkillGapAnalysis;
  action_sprint: ActionSprint;
  trace: Trace;
};

export type SimulationResponse = {
  success: true;
  simulation: Simulation;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// --- PHASE 4 TYPES ---

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantChatResponse = {
  content: string;
  suggested_actions: string[];
  relevant_resources: string[];
};

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: "internship" | "job" | "freelance" | "open_source" | "competition";
  salary_stipend?: string;
  deadline?: string;
  requirements: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  source: string;
  apply_url: string;
  relevance_score: number;
};

export type LearningResource = {
  id: string;
  title: string;
  provider: string;
  type: "documentation" | "tutorial" | "video" | "course" | "book" | "exercise";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_time: string;
  prerequisites: string[];
  quality_score: number;
  tags: string[];
  url: string;
  is_free: boolean;
};

export type OpportunityResponse = {
  opportunities: Opportunity[];
};

export type LearningHubResponse = {
  resources: LearningResource[];
  progress: number;
  streak: number;
};
