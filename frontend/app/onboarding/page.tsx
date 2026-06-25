"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { savePendingProfile } from "@/lib/simulation-store";
import type { StudentProfileInput } from "@/lib/types";

const STEPS = [
  { id: "basics", title: "Who are you?", subtitle: "Basic information to personalize your paths." },
  { id: "interests", title: "What lights you up?", subtitle: "Your interests shape which careers we surface." },
  { id: "skills", title: "What can you do?", subtitle: "Honest skill inventory — no judgment." },
  { id: "fears", title: "What worries you?", subtitle: "Your concerns help us address real anxieties." },
  { id: "goals", title: "What do you want?", subtitle: "Optional context to make paths more specific." },
];

const INTEREST_OPTIONS = [
  "Coding", "Business", "Design", "Writing", "Science", "Math",
  "Psychology", "Healthcare", "Education", "Art", "Music", "Film",
  "Sustainability", "Finance", "Law", "Research", "Sports", "Gaming",
];

const SKILL_OPTIONS = [
  "Basic Python", "JavaScript", "Figma", "Excel", "Public Speaking",
  "Writing", "Research", "Data Analysis", "Video Editing", "Canva",
  "Communication", "Leadership", "Problem Solving", "Critical Thinking",
];

const FEAR_OPTIONS = [
  "AI replacing my job", "Choosing the wrong career", "Not earning enough",
  "Being stuck in one field", "Not being technical enough", "Falling behind peers",
  "Wasting my degree", "Picking the wrong major",
];

const WORK_STYLES = ["Builder", "Researcher", "Helper", "Creative", "Analyst", "Leader", "Independent", "Collaborative"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    education_stage: "high_school",
    location: "India",
    interests: [] as string[],
    favorite_subjects: [] as string[],
    current_skills: [] as string[],
    work_style_preferences: [] as string[],
    career_fears: [] as string[],
    dream_careers: "",
    disliked_careers: "",
    weekly_time_available: "5-7 hours",
    optional_profile_text: "",
  });

  const toggleItem = (key: keyof typeof form, value: string) => {
    const arr = form[key] as string[];
    const updated = arr.includes(value) ? arr.filter((i) => i !== value) : [...arr, value];
    setForm({ ...form, [key]: updated });
  };

  const isSelected = (key: keyof typeof form, value: string) =>
    (form[key] as string[]).includes(value);

  const splitList = (value: string) =>
    value
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length >= 2);

  const validateStep = () => {
    const trimmedName = form.name.trim();
    const age = form.age ? Number(form.age) : undefined;

    if (step === 0) {
      if (trimmedName.length < 2) return "Please enter a real name with at least 2 characters.";
      if (age !== undefined && (Number.isNaN(age) || age < 10 || age > 30)) return "Age should be between 10 and 30.";
      if (!form.weekly_time_available) return "Please select weekly time availability.";
    }

    if (step === 1) {
      if (form.interests.length < 2) return "Pick at least 2 interests so Daedalus has enough signal.";
      if (form.favorite_subjects.length < 1) return "Pick at least 1 favourite subject.";
      if (form.work_style_preferences.length < 1) return "Pick at least 1 work style.";
    }

    if (step === 2 && form.current_skills.length < 2) {
      return "Pick at least 2 current skills. Honest beginner skills are fine.";
    }

    if (step === 3 && form.career_fears.length < 1) {
      return "Pick at least 1 career concern. This helps the AI exposure analysis.";
    }

    if (step === 4) {
      const dreamCareers = splitList(form.dream_careers);
      const dislikedCareers = splitList(form.disliked_careers);
      if (form.dream_careers.trim() && dreamCareers.length === 0) return "Dream careers should contain at least one meaningful word, or leave it blank.";
      if (form.disliked_careers.trim() && dislikedCareers.length === 0) return "Disliked careers should contain at least one meaningful word, or leave it blank.";
    }

    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    const profile: StudentProfileInput = {
      name: form.name.trim(),
      age: form.age ? Number(form.age) : undefined,
      education_stage: form.education_stage as StudentProfileInput["education_stage"],
      location: form.location.trim() || undefined,
      interests: form.interests,
      favorite_subjects: form.favorite_subjects,
      current_skills: form.current_skills,
      work_style_preferences: form.work_style_preferences,
      career_fears: form.career_fears,
      dream_careers: splitList(form.dream_careers),
      disliked_careers: splitList(form.disliked_careers),
      weekly_time_available: form.weekly_time_available,
      optional_profile_text: form.optional_profile_text.trim() || undefined,
    };

    savePendingProfile(profile);
    router.push("/loading");
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main>
      <Navbar />
      <div className="pt-36 pb-24 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-400">Step {step + 1} of {STEPS.length}</span>
              <span className="text-[12px] text-blue-500 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="meter-bar">
              <div className="meter-fill transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            {/* Step dots */}
            <div className="flex justify-between mt-3">
              {STEPS.map((s, i) => (
                <div key={s.id} className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${i < step ? "bg-blue-500 text-white" : i === step ? "bg-white border-2 border-blue-400 text-blue-500" : "bg-white/50 border border-slate-200 text-slate-300"}`}>
                  {i < step ? <Check size={10} /> : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="font-display text-3xl font-bold text-slate-800 mb-1">{STEPS[step].title}</h2>
            <p className="text-slate-400 text-[14px] mb-8">{STEPS[step].subtitle}</p>

            {/* Step 0: Basics */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">Your name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/90 text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-300 focus:bg-white/80 transition-all text-[14px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">Age</label>
                    <input
                      type="number"
                      placeholder="16"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/90 text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-300 transition-all text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">Stage *</label>
                    <select
                      value={form.education_stage}
                      onChange={(e) => setForm({ ...form, education_stage: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/90 text-slate-700 focus:outline-none focus:border-blue-300 transition-all text-[14px]"
                    >
                      <option value="middle_school">Middle School</option>
                      <option value="high_school">High School</option>
                      <option value="early_college">Early College</option>
                      <option value="college">College</option>
                      <option value="early_professional">Early Professional</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">Weekly time available *</label>
                  <div className="flex flex-wrap gap-2">
                    {["2-4 hours", "5-7 hours", "8+ hours"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setForm({ ...form, weekly_time_available: t })}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${form.weekly_time_available === t ? "bg-blue-500 text-white border-blue-500" : "bg-white/60 text-slate-600 border-white/90 hover:bg-white/80"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Interests */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-3">Interests * (pick at least 2)</label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleItem("interests", item)}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${isSelected("interests", item) ? "bg-blue-500 text-white border-blue-500" : "bg-white/60 text-slate-600 border-white/90 hover:bg-white/80"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-3">Favourite subjects * (pick at least 1)</label>
                  <div className="flex flex-wrap gap-2">
                    {["Computer Science", "Mathematics", "Economics", "Biology", "Chemistry", "Physics", "English", "History", "Art", "Psychology", "Statistics", "Business"].map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleItem("favorite_subjects", s)}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${isSelected("favorite_subjects", s) ? "bg-indigo-500 text-white border-indigo-500" : "bg-white/60 text-slate-600 border-white/90 hover:bg-white/80"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-3">Work style * (pick any)</label>
                  <div className="flex flex-wrap gap-2">
                    {WORK_STYLES.map((ws) => (
                      <button
                        key={ws}
                        onClick={() => toggleItem("work_style_preferences", ws)}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${isSelected("work_style_preferences", ws) ? "bg-violet-500 text-white border-violet-500" : "bg-white/60 text-slate-600 border-white/90 hover:bg-white/80"}`}
                      >
                        {ws}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-3">Current skills * (pick at least 2)</label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleItem("current_skills", skill)}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${isSelected("current_skills", skill) ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/60 text-slate-600 border-white/90 hover:bg-white/80"}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">Anything else to add?</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. I've built small school projects, I help friends with tech..."
                    value={form.optional_profile_text}
                    onChange={(e) => setForm({ ...form, optional_profile_text: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/90 text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-300 transition-all text-[14px] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Fears */}
            {step === 3 && (
              <div>
                <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-3">Career concerns * (pick at least 1)</label>
                <div className="flex flex-wrap gap-2">
                  {FEAR_OPTIONS.map((fear) => (
                    <button
                      key={fear}
                      onClick={() => toggleItem("career_fears", fear)}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${isSelected("career_fears", fear) ? "bg-amber-500 text-white border-amber-500" : "bg-white/60 text-slate-600 border-white/90 hover:bg-white/80"}`}
                    >
                      {fear}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Goals */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">Dream careers (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Software engineer, startup founder..."
                    value={form.dream_careers}
                    onChange={(e) => setForm({ ...form, dream_careers: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/90 text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-300 transition-all text-[14px]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-widest block mb-2">Careers you definitely don&apos;t want (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure theory research, sales..."
                    value={form.disliked_careers}
                    onChange={(e) => setForm({ ...form, disliked_careers: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/90 text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-300 transition-all text-[14px]"
                  />
                </div>
                <div className="glass rounded-2xl p-4">
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-700">Ready to generate.</span> Daedalus will analyze your profile and return three personalized career paths with AI exposure, skill gaps, and a 7-day sprint.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-[13px] text-amber-700">
                {error}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => { setError(null); setStep(step - 1); }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/60 border border-white/90 text-slate-600 font-medium text-[14px] hover:bg-white/80 transition-all"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="group flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-[14px] shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                {step === STEPS.length - 1 ? "Generate My Paths" : "Continue"}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
