"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2, Sparkles, Cpu, Activity } from "lucide-react";
import { getDemoPersonas, simulateCareerPaths } from "@/lib/api";
import { clearPendingProfile, getPendingProfile, saveSimulation } from "@/lib/simulation-store";
import type { StudentProfileInput } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [completed, setCompleted] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const tick = setInterval(() => {
      setCompleted((prev) => (prev.length < STEPS.length ? [...prev, prev.length] : prev));
    }, 600); // Snappier ticks for faster demo feel

    async function runSimulation() {
      try {
        let profile: StudentProfileInput | null = getPendingProfile();
        const personaId = searchParams.get("persona");

        if (personaId) {
          const personaResponse = await getDemoPersonas();
          const found = personaResponse.personas.find((p) => p.persona_id === personaId);
          profile = found ? found.profile : null;
        }

        if (!profile) {
          throw new Error("Neural signal lost. Please restart initialization.");
        }

        const response = await simulateCareerPaths({
          student_profile: profile,
          options: {
            include_trace: true,
            include_demo_fallback: true,
            preferred_number_of_paths: 3,
          },
        });

        if (cancelled) return;
        saveSimulation(response.simulation);
        clearPendingProfile();

        // Ensure UI finishes animation then redirects
        setTimeout(() => {
           setCompleted([0, 1, 2, 3, 4]);
           setTimeout(() => router.push(`/dashboard/${response.simulation.simulation_id}`), 400);
        }, 500);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Kernel panic detected.");
        setTimeout(() => router.push("/onboarding"), 2000);
      } finally {
        clearInterval(tick);
      }
    }

    runSimulation();
    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, [router, searchParams]);

  const progress = (completed.length / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Floating Theme Controller */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      {/* OS Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-card border border-primary/20 rounded-[2rem] p-10 shadow-premium relative overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
              {error ? (
                <Activity className="w-8 h-8 text-destructive animate-pulse" />
              ) : (
                <>
                  <Cpu className="w-8 h-8" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-2xl border-2 border-primary border-t-transparent"
                  />
                </>
              )}
            </div>

            <div className="space-y-2 mb-10">
              <h1 className="text-2xl font-black tracking-tight">
                {error ? "RECOVERY_MODE" : "System Initialization"}
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                {error || "Executing deterministic career simulation kernel..."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary/60">
                  <span>Kernel Status</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              <div className="space-y-3 text-left">
                {STEPS.map((step, index) => {
                  const isDone = completed.includes(index);
                  const isCurrent = index === completed.length;
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-4 transition-all duration-300",
                        isDone ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-20"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-colors border",
                        isDone ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-transparent"
                      )}>
                        {isDone ? <Check className="w-3 h-3" /> : <div className={cn("w-1 h-1 rounded-full bg-primary", isCurrent && "animate-ping")} />}
                      </div>
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-tighter",
                        isDone ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                      {isCurrent && <Loader2 className="w-3 h-3 animate-spin ml-auto text-primary" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center opacity-30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-mono uppercase tracking-[0.2em]">
            <Sparkles className="w-2.5 h-2.5" /> 0x92f_Kernel_Stable
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const STEPS = [
  { id: "read", label: "Accessing Neural Profile" },
  { id: "map", label: "Mapping Interest Clusters" },
  { id: "score", label: "Executing Ranking Engine" },
  { id: "ai", label: "Auditing AI Risk Vectors" },
  { id: "sprint", label: "Generating Execution Roadmap" },
];

export default function LoadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoadingContent />
    </Suspense>
  );
}
