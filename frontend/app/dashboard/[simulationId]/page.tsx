"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Download, ArrowRight, Shield, BookOpen, Zap, Compass, Target, Sparkles,
  TrendingUp, Fingerprint, Network, Bookmark, Award, Clock, Briefcase,
  CheckCircle2, Calendar, ChevronRight, GitBranch, BarChart3, Activity
} from "lucide-react";
import { getSimulation, toggleBookmark, getBookmarks } from "@/lib/simulation-store";
import { getSimulationById, getOpportunities, getLearningPath } from "@/lib/api";
import type { Simulation, Opportunity, LearningResource } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { CareerDNA } from "@/components/intelligence/career-dna";
import { CareerGraph } from "@/components/intelligence/career-graph";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();

  const [data, setData] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [learningRes, setLearningRes] = useState<LearningResource[]>([]);

  useEffect(() => {
    let cancelled = false;
    const prefetch = async (sim: Simulation) => {
      try {
        const [o, l] = await Promise.allSettled([
          getOpportunities(sim.comparison.recommended_path_id, simulationId),
          getLearningPath(sim.comparison.recommended_path_id),
        ]);
        if (cancelled) return;
        if (o.status === "fulfilled") setOpps(o.value.opportunities.slice(0, 2));
        if (l.status === "fulfilled") setLearningRes(l.value.resources.slice(0, 2));
      } catch {}
    };
    const load = async () => {
      try {
        const local = getSimulation(simulationId);
        let current = local;
        if (local) {
          if (cancelled) return;
          setData(local);
          setIsBookmarked(getBookmarks().some(b => b.id === local.simulation_id));
        } else {
          const res = await getSimulationById(simulationId);
          current = res.simulation;
          if (cancelled) return;
          setData(res.simulation);
          setIsBookmarked(getBookmarks().some(b => b.id === res.simulation.simulation_id));
        }
        if (!cancelled) setLoading(false);
        if (current) void prefetch(current);
      } catch {
        if (!cancelled) { setLoading(false); router.push("/demo-personas"); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [simulationId, router]);

  const handleBookmark = () => {
    if (!data) return;
    const added = toggleBookmark(data.simulation_id, data.student_summary.name);
    setIsBookmarked(!!added);
    if (added) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#7BBAD4","#B0D4E8"] });
  };

  if (loading) return (
    <DashboardShell>
      <div className="space-y-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-72 rounded-2xl" />
            <div className="grid grid-cols-2 gap-4"><Skeleton className="h-44 rounded-2xl" /><Skeleton className="h-44 rounded-2xl" /></div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-56 rounded-2xl" /><Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      </div>
    </DashboardShell>
  );

  if (!data) return null;
  const simId = data.simulation_id;
  const recommendedId = data.comparison.recommended_path_id;
  const recommended = data.career_paths.find(p => p.career_id === recommendedId) || data.career_paths[0];

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 no-print">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Career Command Center
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              {data.student_summary.name}'s Dashboard
            </h1>
            <p className="text-neutral-500 max-w-xl leading-relaxed text-base">
              {data.student_summary.profile_headline}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Confidence</p>
              <p className="text-2xl font-black text-[#1e6a8a]">{(recommended.confidence_score * 100).toFixed(1)}%</p>
            </div>
            <button onClick={handleBookmark}
              className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                isBookmarked ? "border-[#7BBAD4] bg-[#7BBAD4]/10 text-[#1e6a8a]" : "border-neutral-200 text-neutral-400 hover:border-neutral-300")}>
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
            <Link href={`/sprint/${simId}`}>
              <button className="btn-dark text-sm">Launch Sprint <Zap className="w-3.5 h-3.5" /></button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">

            {/* Mission card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="rounded-2xl bg-black text-white p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-6">
                  <Zap className="w-28 h-28 text-[#7BBAD4]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/40 mb-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Today's focus
                </p>
                <h2 className="text-2xl font-black italic mb-3 max-w-lg">"{recommended.mission_statement}"</h2>
                <p className="text-white/55 text-sm mb-5">
                  Day 1 of your sprint: <span className="text-[#7BBAD4] font-semibold">{data.action_sprint.days[0].title}</span>
                </p>
                <div className="flex gap-3">
                  <Link href={`/sprint/${simId}`}>
                    <button className="px-4 py-2 bg-[#7BBAD4] text-black text-sm font-bold rounded-full hover:bg-[#9ACFDF] transition-colors">
                      Start 7-Day Sprint
                    </button>
                  </Link>
                  <button className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full hover:bg-white/15 transition-colors flex items-center gap-1.5">
                    Mark complete <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Career map */}
            <div className="space-y-3 no-print">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <Network className="w-4 h-4" /> Career Map
                </h2>
                <span className="tag-blue">Interactive</span>
              </div>
              <CareerGraph simulation={data} />
            </div>

            {/* Career paths */}
            <div className="space-y-4">
              <div className="flex items-center justify-between no-print">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Compass className="w-4 h-4 text-neutral-400" /> Your Career Paths
                </h2>
                <Link href={`/comparison/${simId}`}
                  className="text-xs font-semibold text-[#1e6a8a] flex items-center gap-1 hover:underline">
                  Compare paths <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.career_paths.map((path, i) => {
                  const isRec = path.career_id === recommendedId;
                  return (
                    <motion.div key={path.career_id}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}>
                      <div className={cn(
                        "h-full flex flex-col p-5 rounded-2xl border-2 bg-white transition-all group",
                        isRec ? "border-[#7BBAD4] shadow-md" : "border-neutral-100 hover:border-neutral-300"
                      )}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="tag-blue">{path.cluster}</span>
                          {isRec && <Sparkles className="w-3.5 h-3.5 text-[#7BBAD4] animate-pulse" />}
                        </div>
                        <h3 className="font-bold text-base mb-1 group-hover:text-[#1e6a8a] transition-colors">{path.title}</h3>
                        <p className="text-neutral-500 text-xs leading-relaxed mb-4 line-clamp-2">{path.one_line_summary}</p>
                        <div className="mt-auto space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-neutral-400">Match</span>
                            <span className="text-black">{path.fit_score}%</span>
                          </div>
                          <Progress value={path.fit_score} className="h-1.5" />
                          <div className="flex flex-wrap gap-1 pt-1">
                            {path.matched_skills.slice(0, 3).map(s => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{s}</span>
                            ))}
                          </div>
                        </div>
                        <Link href={`/career/${simId}/${path.career_id}`}
                          className="mt-4 w-full py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-center
                            hover:border-[#7BBAD4] hover:text-[#1e6a8a] transition-all block">
                          View full analysis →
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-5">
            {/* Progress */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> Progress
              </h3>
              <Metric label="Interview Readiness" value={15} target={100} color="#7BBAD4" />
              <Metric label="Skills Verified" value={42} target={100} color="#34d399" />
              <Metric label="Learning Hours" value={3.5} target={20} suffix="h" color="#f59e0b" />
            </div>

            {/* DNA */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 no-print">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2 mb-4">
                <Fingerprint className="w-3.5 h-3.5" /> Cognitive Profile
              </h3>
              <CareerDNA traits={data.career_dna} />
            </div>

            {/* Opportunities */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Opportunities
                </h3>
                <Link href={`/opportunities/${simId}`} className="text-[#1e6a8a] hover:underline">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-2">
                {opps.map(o => (
                  <div key={o.id} className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold truncate text-black">{o.title}</p>
                    <p className="text-[11px] text-neutral-400">{o.organization}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Learning
                </h3>
                <Link href={`/learning/${simId}`} className="text-[#1e6a8a] hover:underline">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-2">
                {learningRes.map(r => (
                  <div key={r.id} className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold truncate text-black">{r.title}</p>
                    <p className="text-[11px] text-neutral-400">{r.provider} · {r.estimated_time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision lab */}
            <Link href={`/simulations/${simId}`}
              className="block p-5 rounded-2xl bg-[#7BBAD4]/12 border border-[#7BBAD4]/30 hover:bg-[#7BBAD4]/18 transition-colors group no-print">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#1e6a8a] flex items-center gap-2 text-sm">
                  <GitBranch className="w-4 h-4" /> Decision Lab
                </h4>
                <span className="tag-blue">Beta</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                "What if I focused more on Strategic Logic?"
              </p>
              <span className="text-xs font-semibold text-[#1e6a8a] flex items-center gap-1 group-hover:gap-2 transition-all">
                Open lab <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value, target, color, suffix = "%" }: { label: string; value: number; target: number; color: string; suffix?: string }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] font-semibold">
        <span className="text-neutral-500">{label}</span>
        <span className="text-black">{value}{suffix}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
