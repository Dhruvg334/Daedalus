"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { getDemoPersonas, simulateCareerPaths } from "@/lib/api";
import { clearPendingProfile, getPendingProfile, saveSimulation } from "@/lib/simulation-store";
import type { StudentProfileInput } from "@/lib/types";

const STEPS = [
  "Reading your profile",
  "Mapping interests to career clusters",
  "Scoring possible paths",
  "Analysing AI exposure",
  "Building your 7-day sprint",
];

export default function LoadingPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const tick = setInterval(() => {
      setCompleted((prev) => (prev.length < STEPS.length ? [...prev, prev.length] : prev));
    }, 550);

    async function runSimulation() {
      try {
        let profile: StudentProfileInput | null = getPendingProfile();
        const personaId = new URLSearchParams(window.location.search).get("persona");

        if (personaId) {
          const personaResponse = await getDemoPersonas();
          profile = personaResponse.personas.find((p) => p.persona_id === personaId)?.profile || null;
        }

        if (!profile) {
          throw new Error("No profile found. Please complete onboarding or choose a demo persona.");
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
        setCompleted([0, 1, 2, 3, 4]);
        setTimeout(() => router.push(`/dashboard/${response.simulation.simulation_id}`), 350);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Simulation failed.");
        setTimeout(() => router.push("/error-page"), 1200);
      } finally {
        clearInterval(tick);
      }
    }

    runSimulation();
    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, [router]);

  const pct = (completed.length / STEPS.length) * 100;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-strong rounded-3xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
          {error ? "!" : <Loader2 size={24} className="animate-spin" />}
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">
          {error ? "Recovering your flow" : "Building your career map"}
        </h1>
        <p className="text-slate-400 text-[14px] mb-7">
          {error || "Daedalus is running a structured simulation, not a generic chatbot response."}
        </p>

        <div className="meter-bar mb-6">
          <div className="meter-fill transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        <div className="space-y-3 text-left">
          {STEPS.map((step, index) => {
            const done = completed.includes(index);
            return (
              <div key={step} className="flex items-center gap-3 text-[13px]">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-blue-500 text-white" : "bg-white/70 text-slate-300"}`}>
                  {done ? <Check size={11} /> : <Loader2 size={11} className={index === completed.length ? "animate-spin" : ""} />}
                </div>
                <span className={done ? "text-slate-700" : "text-slate-400"}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
