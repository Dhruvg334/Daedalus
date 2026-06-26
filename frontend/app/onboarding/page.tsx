"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  User,
  Target,
  Zap,
  Brain,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { savePendingProfile } from "@/lib/simulation-store";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const STEPS = [
  { id: "identity", title: "Identity", icon: User, description: "Tell us who you are" },
  { id: "context", title: "Context", icon: Target, description: "Your current stage" },
  { id: "signals", title: "Signals", icon: Brain, description: "Interests & Skills" },
  { id: "vision", title: "Vision", icon: Zap, description: "Aspirations & Fears" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "18",
    education_stage: "high_school",
    interests: [] as string[],
    current_skills: [] as string[],
    career_fears: [] as string[],
    dream_careers: [] as string[],
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const isMeaningful = (value: string) => value.trim().replace(/[^a-zA-Z0-9]/g, "").length >= 2;

  const validateStep = () => {
    if (currentStep === 0) {
      if (!isMeaningful(formData.name)) return "Please enter a real name with at least 2 characters.";
      const age = Number(formData.age);
      if (!Number.isFinite(age) || age < 10 || age > 30) return "Please enter an age between 10 and 30.";
    }
    if (currentStep === 1) {
      if (!formData.education_stage) return "Please select your current education stage.";
    }
    if (currentStep === 2) {
      if (formData.interests.length < 2) return "Add at least 2 interests. Press Enter after each one.";
      if (formData.current_skills.length < 2) return "Add at least 2 current skills. Press Enter after each one.";
    }
    if (currentStep === 3) {
      if (formData.career_fears.length < 1) return "Add at least 1 career concern or fear. Press Enter after typing it.";
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
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const interests = formData.interests.map(item => item.trim()).filter(Boolean);
    const skills = formData.current_skills.map(item => item.trim()).filter(Boolean);
    const fears = formData.career_fears.map(item => item.trim()).filter(Boolean);

    savePendingProfile({
      name: formData.name.trim(),
      age: Number(formData.age),
      education_stage: formData.education_stage as any,
      location: "Global",
      interests,
      favorite_subjects: interests,
      current_skills: skills,
      career_fears: fears,
      dream_careers: formData.dream_careers.length > 0 ? formData.dream_careers : [interests[0]],
      disliked_careers: [],
      work_style_preferences: ["building", "autonomous"],
      weekly_time_available: "5-10 hours",
      optional_profile_text: `Interest profile: ${interests.join(", ")}`
    });

    router.push("/loading");
  };

  const addItem = (key: 'interests' | 'current_skills' | 'career_fears' | 'dream_careers', value: string) => {
    const clean = value.trim().replace(/\s+/g, " ");
    if (!isMeaningful(clean)) {
      setError("Please enter a meaningful value with at least 2 characters.");
      return;
    }
    setError(null);
    setFormData(prev => ({
      ...prev,
      [key]: Array.from(new Set([...prev[key], clean])).slice(0, 8)
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Floating Theme Controller */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl z-10">
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Kernel_Initialization
          </div>
          <h1 className="text-3xl font-black tracking-tight">System Onboarding</h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-500",
                  idx <= currentStep ? "bg-primary w-6" : "bg-muted"
                )} />
                {idx < STEPS.length - 1 && <div className="w-4 h-[1px] bg-border mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-primary/10 shadow-premium overflow-hidden bg-card/50 backdrop-blur-xl">
          <div className="h-1 w-full bg-muted">
            <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>

          <CardContent className="p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <StepHeader step={STEPS[0]} />
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject Name</label>
                        <Input placeholder="e.g. Alex Rivera" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 bg-muted/20 border-none focus-visible:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Age</label>
                        <Input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="h-12 bg-muted/20 border-none focus-visible:ring-primary/20" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <StepHeader step={STEPS[1]} />
                    <div className="grid grid-cols-2 gap-4">
                      {["middle_school", "high_school", "early_college", "college", "early_professional"].map(stage => (
                        <button
                          key={stage}
                          onClick={() => setFormData({...formData, education_stage: stage})}
                          className={cn(
                            "p-4 rounded-xl border text-left transition-all",
                            formData.education_stage === stage ? "bg-primary/5 border-primary shadow-sm" : "bg-muted/30 hover:border-primary/30"
                          )}
                        >
                          <span className={cn("text-xs font-bold capitalize", formData.education_stage === stage ? "text-primary" : "text-muted-foreground")}>
                            {stage.replace('_', ' ')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <StepHeader step={STEPS[2]} />
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Primary Interests</label>
                        <Input placeholder="e.g. AI, Music, Finance..." onKeyDown={e => { if(e.key === 'Enter') { addItem('interests', e.currentTarget.value); e.currentTarget.value = ''; }}} className="h-12 bg-muted/20 border-none focus-visible:ring-primary/20" />
                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.interests.map(i => <Badge key={i} variant="secondary">{i}</Badge>)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Skills</label>
                        <Input placeholder="e.g. Python, Design, Writing..." onKeyDown={e => { if(e.key === 'Enter') { addItem('current_skills', e.currentTarget.value); e.currentTarget.value = ''; }}} className="h-12 bg-muted/20 border-none focus-visible:ring-primary/20" />
                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.current_skills.map(s => <Badge key={s} variant="outline" className="text-emerald-500 border-emerald-500/20">{s}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <StepHeader step={STEPS[3]} />
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dream Careers</label>
                        <Input placeholder="e.g. Startup Founder, Researcher..." onKeyDown={e => { if(e.key === 'Enter') { addItem('dream_careers', e.currentTarget.value); e.currentTarget.value = ''; }}} className="h-12 bg-muted/20 border-none focus-visible:ring-primary/20" />
                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.dream_careers.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <ShieldAlert className="w-3 h-3 text-amber-500" /> Career Fears
                        </label>
                        <Input placeholder="e.g. Automation, Stagnation..." onKeyDown={e => { if(e.key === 'Enter') { addItem('career_fears', e.currentTarget.value); e.currentTarget.value = ''; }}} className="h-12 bg-muted/20 border-none focus-visible:ring-primary/20" />
                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.career_fears.map(f => <Badge key={f} variant="outline" className="text-amber-500 border-amber-500/20">{f}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <div className="mt-12 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0 || loading} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleNext} disabled={loading} className="min-w-[140px] gap-2 shadow-premium h-11">
                {loading ? "Running Neural Mapping..." : currentStep === STEPS.length - 1 ? "Initialize OS" : "Continue"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepHeader({ step }: { step: any }) {
  const Icon = step.icon;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg"><Icon className="w-5 h-5 text-primary" /></div>
        <h2 className="text-xl font-bold">{step.title}</h2>
      </div>
      <p className="text-muted-foreground text-sm">{step.description}</p>
    </div>
  );
}
