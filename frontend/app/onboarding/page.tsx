"use client";

import { KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, User, Target, Brain, Zap, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { savePendingProfile } from "@/lib/simulation-store";
import Link from "next/link";

const STEPS = [
  { id: "identity", title: "Who are you?", icon: User, description: "A couple of quick facts about you" },
  { id: "context", title: "Where are you?", icon: Target, description: "Your current stage of life" },
  { id: "signals", title: "What do you love?", icon: Brain, description: "Interests and current skills" },
  { id: "vision", title: "Where do you want to go?", icon: Zap, description: "Dreams and concerns" },
];

const EDUCATION_STAGES = [
  { value: "middle_school", label: "Middle School" },
  { value: "high_school", label: "High School" },
  { value: "early_college", label: "Early College" },
  { value: "college", label: "College" },
  { value: "early_professional", label: "Early Professional" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", age: "18", education_stage: "high_school",
    interests: [] as string[], current_skills: [] as string[],
    career_fears: [] as string[], dream_careers: [] as string[],
  });
  const [drafts, setDrafts] = useState({ interests: "", current_skills: "", career_fears: "", dream_careers: "" });

  const isMeaningful = (v: string) => v.trim().replace(/[^a-zA-Z0-9]/g, "").length >= 2;
  const tokenize = (v: string) => v.split(/[,\n]/).map(s => s.trim()).filter(isMeaningful);
  const merge = (existing: string[], draft: string) =>
    Array.from(new Set([...existing, ...tokenize(draft)])).slice(0, 8);

  const committed = () => {
    if (step === 2) return { ...form, interests: merge(form.interests, drafts.interests), current_skills: merge(form.current_skills, drafts.current_skills) };
    if (step === 3) return { ...form, dream_careers: merge(form.dream_careers, drafts.dream_careers), career_fears: merge(form.career_fears, drafts.career_fears) };
    return form;
  };

  const addItem = (key: keyof typeof drafts, val: string, silent = false) => {
    const tokens = tokenize(val);
    if (!tokens.length) { if (!silent) setError("Please enter at least 2 characters."); return false; }
    setError(null);
    setForm(p => ({ ...p, [key]: Array.from(new Set([...p[key], ...tokens])).slice(0, 8) }));
    setDrafts(p => ({ ...p, [key]: "" }));
    return true;
  };

  const removeItem = (key: keyof typeof drafts, val: string) =>
    setForm(p => ({ ...p, [key]: p[key].filter(i => i !== val) }));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, key: keyof typeof drafts) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addItem(key, drafts[key]); }
  };

  const validate = (data = form) => {
    if (step === 0) {
      if (!isMeaningful(data.name)) return "Please enter your name.";
      const age = Number(data.age);
      if (!isFinite(age) || age < 10 || age > 30) return "Age must be between 10 and 30.";
    }
    if (step === 1 && !data.education_stage) return "Please select your education stage.";
    if (step === 2) {
      if (!data.interests.length) return "Add at least 1 interest (press Enter to add).";
      if (!data.current_skills.length) return "Add at least 1 skill (press Enter to add).";
    }
    if (step === 3 && !data.career_fears.length) return "Add at least 1 concern or fear.";
    return null;
  };

  const next = () => {
    const c = committed();
    const err = validate(c);
    setForm(c);
    setDrafts(p => ({ ...p, interests: "", current_skills: "", dream_careers: "", career_fears: "" }));
    if (err) { setError(err); return; }
    setError(null);
    if (step < STEPS.length - 1) { setStep(p => p + 1); }
    else { submit(c); }
  };

  const submit = (data = form) => {
    setLoading(true);
    const interests = data.interests.filter(isMeaningful);
    savePendingProfile({
      name: data.name.trim(), age: Number(data.age),
      education_stage: data.education_stage as any, location: "Global",
      interests, favorite_subjects: interests,
      current_skills: data.current_skills.filter(isMeaningful),
      career_fears: data.career_fears.filter(isMeaningful),
      dream_careers: data.dream_careers.filter(isMeaningful).length > 0
        ? data.dream_careers.filter(isMeaningful) : [interests[0]],
      disliked_careers: [], work_style_preferences: ["building", "autonomous"],
      weekly_time_available: "5-10 hours",
      optional_profile_text: `Interests: ${interests.join(", ")}`,
    });
    router.push("/loading");
  };

  const pct = ((step + 1) / STEPS.length) * 100;
  const Icon = STEPS[step].icon;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal top bar */}
      <div className="h-14 border-b border-neutral-100 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#7BBAD4] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-black">Daedalus</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i < step ? "bg-[#7BBAD4] w-8" : i === step ? "bg-black w-12" : "bg-neutral-200 w-8"
                )} />
              </div>
            ))}
            <span className="ml-2 text-xs text-neutral-400 font-medium">{step + 1} / {STEPS.length}</span>
          </div>

          {/* Card */}
          <div className="ob-card">
            {/* Top progress bar */}
            <div className="h-0.5 w-full bg-neutral-100">
              <motion.div className="h-full bg-[#7BBAD4]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
            </div>

            <div className="p-8 md:p-10">
              {/* Step header */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(123,186,212,.15)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#1e6a8a" }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{STEPS[step].title}</h2>
                  <p className="text-sm text-neutral-500">{STEPS[step].description}</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  className="space-y-5">

                  {step === 0 && (
                    <>
                      <Field label="Your name">
                        <Input placeholder="e.g. Alex Rivera" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          className="h-12 border-neutral-200 focus-visible:ring-[#7BBAD4]/40 bg-neutral-50" />
                      </Field>
                      <Field label="Your age">
                        <Input type="number" value={form.age}
                          onChange={e => setForm({ ...form, age: e.target.value })}
                          className="h-12 border-neutral-200 focus-visible:ring-[#7BBAD4]/40 bg-neutral-50" />
                      </Field>
                    </>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-3">
                      {EDUCATION_STAGES.map(s => (
                        <button key={s.value}
                          onClick={() => setForm({ ...form, education_stage: s.value })}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all font-medium text-sm",
                            form.education_stage === s.value
                              ? "border-[#7BBAD4] bg-[#7BBAD4]/8 text-black"
                              : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                          )}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <>
                      <TokenField label="Interests" placeholder="e.g. AI, Music, Finance"
                        hint="Press Enter or comma to add"
                        value={drafts.interests}
                        onChange={v => setDrafts(p => ({ ...p, interests: v }))}
                        onKeyDown={e => onKeyDown(e, "interests")}
                        onBlur={() => addItem("interests", drafts.interests, true)}
                        tokens={form.interests}
                        onRemove={v => removeItem("interests", v)}
                        color="blue" />
                      <TokenField label="Current Skills" placeholder="e.g. Python, Design, Writing"
                        hint="One skill is enough to continue"
                        value={drafts.current_skills}
                        onChange={v => setDrafts(p => ({ ...p, current_skills: v }))}
                        onKeyDown={e => onKeyDown(e, "current_skills")}
                        onBlur={() => addItem("current_skills", drafts.current_skills, true)}
                        tokens={form.current_skills}
                        onRemove={v => removeItem("current_skills", v)}
                        color="green" />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <TokenField label="Dream Careers (optional)" placeholder="e.g. Startup Founder, Researcher"
                        value={drafts.dream_careers}
                        onChange={v => setDrafts(p => ({ ...p, dream_careers: v }))}
                        onKeyDown={e => onKeyDown(e, "dream_careers")}
                        onBlur={() => addItem("dream_careers", drafts.dream_careers, true)}
                        tokens={form.dream_careers}
                        onRemove={v => removeItem("dream_careers", v)}
                        color="blue" />
                      <TokenField label="Career Fears" placeholder="e.g. Automation, Stagnation"
                        hint="What worries you about the future?"
                        value={drafts.career_fears}
                        onChange={v => setDrafts(p => ({ ...p, career_fears: v }))}
                        onKeyDown={e => onKeyDown(e, "career_fears")}
                        onBlur={() => addItem("career_fears", drafts.career_fears, true)}
                        tokens={form.career_fears}
                        onRemove={v => removeItem("career_fears", v)}
                        color="amber"
                        icon={<ShieldAlert className="w-3 h-3 text-amber-500" />} />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {error && (
                <div className="mt-5 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(p => p - 1)} disabled={step === 0 || loading}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors disabled:opacity-30">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={next} disabled={loading}
                  className="btn-dark min-w-[140px] justify-center">
                  {loading ? "Running simulation…" : step === STEPS.length - 1 ? "Run Simulation" : "Continue"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function TokenField({ label, placeholder, hint, value, onChange, onKeyDown, onBlur, tokens, onRemove, color, icon }: {
  label: string; placeholder: string; hint?: string;
  value: string; onChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  tokens: string[]; onRemove: (v: string) => void;
  color: "blue" | "green" | "amber"; icon?: React.ReactNode;
}) {
  const tokenClass = {
    blue: "bg-[#7BBAD4]/12 text-[#1e6a8a] border-[#7BBAD4]/30",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  }[color];

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
        {icon}{label}
      </label>
      <input
        type="text" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown} onBlur={onBlur}
        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-neutral-50 text-sm
          focus:outline-none focus:border-[#7BBAD4] transition-colors"
      />
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
      {tokens.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tokens.map(t => (
            <span key={t} onClick={() => onRemove(t)}
              className={cn("inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-70 transition-opacity", tokenClass)}>
              {t} <span className="opacity-60">×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
