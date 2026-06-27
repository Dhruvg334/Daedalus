"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Check, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { getDemoPersonas, simulateCareerPaths } from "@/lib/api";
import { clearPendingProfile, getPendingProfile, saveSimulation } from "@/lib/simulation-store";
import type { StudentProfileInput } from "@/lib/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STEPS = [
  { id: "read", label: "Reading your profile" },
  { id: "map", label: "Mapping interest clusters" },
  { id: "score", label: "Ranking career paths" },
  { id: "ai", label: "Auditing AI exposure" },
  { id: "sprint", label: "Building your action plan" },
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [done, setDone] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const tick = setInterval(() => {
      setDone(p => p.length < STEPS.length ? [...p, p.length] : p);
    }, 600);

    setError(null);

    async function run() {
      try {
        let profile: StudentProfileInput | null = getPendingProfile();
        const personaId = searchParams.get("persona");
        if (personaId) {
          const res = await getDemoPersonas();
          const found = res.personas.find(p => p.persona_id === personaId);
          profile = found ? found.profile : null;
        }
        if (!profile) throw new Error("Profile not found. Please restart.");

        const response = await simulateCareerPaths({
          student_profile: profile,
          options: { include_trace: true, include_demo_fallback: true, preferred_number_of_paths: 3 },
        });

        if (cancelled) return;
        saveSimulation(response.simulation);
        clearPendingProfile();
        setTimeout(() => {
          setDone([0, 1, 2, 3, 4]);
          setTimeout(() => router.push(`/dashboard/${response.simulation.simulation_id}`), 400);
        }, 500);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Daedalus could not complete the simulation. Please try again.");
      } finally { clearInterval(tick); }
    }

    run();
    return () => { cancelled = true; clearInterval(tick); };
  }, [router, searchParams, retryNonce]);

  const pct = (done.length / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal nav */}
      <div className="h-14 border-b border-neutral-100 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#7BBAD4] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-black">Daedalus</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="ob-card p-8 text-center">
            {/* Spinning logo */}
            <div className="relative w-14 h-14 mx-auto mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(123,186,212,.15)" }}>
                <Sparkles className="w-7 h-7" style={{ color: "#1e6a8a" }} />
              </div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border-2 border-[#7BBAD4] border-t-transparent" />
            </div>

            <h1 className="text-xl font-bold text-black mb-1">
              {error ? "Connection needs attention" : "Running your simulation"}
            </h1>
            <p className="text-sm text-neutral-500 mb-7">
              {error || "Building your personalised career OS…"}
            </p>

            {/* Progress bar */}
            <div className="h-1 w-full bg-neutral-100 rounded-full mb-6 overflow-hidden">
              <motion.div className="h-full bg-[#7BBAD4] rounded-full"
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ ease: "easeOut" }} />
            </div>

            {/* Steps */}
            <div className="space-y-2.5 text-left">
              {STEPS.map((s, i) => {
                const isDone = done.includes(i);
                const isCurrent = i === done.length;
                return (
                  <div key={s.id} className={cn("flex items-center gap-3 transition-opacity",
                    isDone ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-25")}>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all",
                      isDone ? "bg-[#7BBAD4] border-[#7BBAD4]" : "border-neutral-300 bg-white"
                    )}>
                      {isDone
                        ? <Check className="w-3 h-3 text-white" />
                        : <div className={cn("w-1 h-1 rounded-full bg-[#7BBAD4]", isCurrent && "animate-ping")} />}
                    </div>
                    <span className={cn("text-xs font-medium",
                      isDone ? "text-black" : isCurrent ? "text-black" : "text-neutral-400")}>{s.label}</span>
                    {isCurrent && <Loader2 className="w-3 h-3 animate-spin ml-auto text-[#7BBAD4]" />}
                  </div>
                );
              })}
            </div>
            {error && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Backend service may be waking up</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-800">
                      If this is the first request after a quiet period, the hosted backend can take a moment to respond. Retry once before restarting the profile.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => { setDone([]); setRetryNonce(value => value + 1); }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Retry simulation
                  </button>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50"
                  >
                    Edit profile
                  </Link>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoadingContent />
    </Suspense>
  );
}
