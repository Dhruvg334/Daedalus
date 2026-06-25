"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Download, ArrowRight, Shield, BookOpen, Zap } from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import { getSimulationById } from "@/lib/api";
import type { Simulation } from "@/lib/types";

function ScorePill({ label, value, max = 10, color = "text-blue-500" }: { label: string; value: number; max?: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={`font-semibold ${color}`}>{value}/{max}</span>
      </div>
      <div className="meter-bar"><div className="meter-fill" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();
  const [data, setData] = useState<Simulation | null>(null);

  useEffect(() => {
    const local = getSimulation(simulationId);
    if (local) {
      setData(local);
      return;
    }
    getSimulationById(simulationId)
      .then((res) => setData(res.simulation))
      .catch(() => router.push("/error-page"));
  }, [simulationId, router]);

  if (!data) {
    return <main><Navbar /><div className="pt-32 text-center text-slate-400">Loading career dashboard...</div></main>;
  }

  const simId = data.simulation_id;
  const recommendedId = data.comparison.recommended_path_id;

  return (
    <main>
      <Navbar />
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="section-label mb-2">Career Dashboard</p>
            <h1 className="font-display text-4xl font-bold text-slate-800 tracking-tight mb-2">
              {data.student_summary.name}&apos;s Career Map
            </h1>
            <p className="text-slate-400 text-base">{data.student_summary.profile_headline}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.student_summary.dominant_interests.map((i) => <span key={i} className="chip">{i}</span>)}
              {data.student_summary.main_concerns.map((c) => <span key={c} className="chip chip-gap">{c}</span>)}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 mb-6 border-l-4 border-blue-400">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-blue-500" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-500">Best Match</span>
            </div>
            <p className="text-slate-700 text-[14px] leading-relaxed">{data.comparison.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {data.career_paths.map((path, index) => {
              const recommended = path.career_id === recommendedId;
              const color = ["from-blue-400 to-indigo-500", "from-violet-400 to-purple-500", "from-emerald-400 to-teal-500"][index % 3];
              return (
                <div key={path.career_id} className={`glass-card rounded-3xl p-6 ${recommended ? "ring-2 ring-blue-300/50" : ""}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${color}`} />
                    <span className="text-[11px] text-slate-400">{path.cluster}</span>
                    {recommended && <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full ml-auto">Best Fit</span>}
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-lg mb-2">{path.title}</h3>
                  <p className="text-slate-500 text-[13px] mb-5 leading-relaxed">{path.one_line_summary}</p>
                  <div className="space-y-3 mb-5">
                    <ScorePill label="Fit Score" value={path.fit_score} max={100} color="text-blue-500" />
                    <ScorePill label="AI Exposure" value={path.ai_exposure_score} color="text-amber-500" />
                    <ScorePill label="Growth Potential" value={path.growth_potential_score} color="text-emerald-500" />
                    <ScorePill label="Difficulty" value={path.difficulty_score} color="text-slate-400" />
                  </div>
                  <div className="mb-5">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-2">Skills to build</div>
                    <div className="flex flex-wrap gap-1">
                      {path.missing_skills.map((s) => <span key={s} className="chip chip-gap text-[10px]">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/career/${simId}/${path.career_id}`} className="flex-1 text-center py-2.5 rounded-xl bg-white/60 border border-white/90 text-slate-700 text-[12px] font-semibold hover:bg-white/80 transition-all">View Details</Link>
                    {recommended && <Link href={`/sprint/${simId}`} className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[12px] font-semibold hover:shadow-md transition-all">7-Day Sprint</Link>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Skill Gaps", icon: BookOpen, href: `/skills/${simId}`, color: "text-indigo-500" },
              { label: "Action Sprint", icon: Zap, href: `/sprint/${simId}`, color: "text-blue-500" },
              { label: "Export Map", icon: Download, href: `/share/${simId}`, color: "text-emerald-500" },
              { label: "AI Pipeline", icon: Shield, href: `/trace/${simId}`, color: "text-amber-500" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-white/70">
                  <Icon size={16} className={action.color} strokeWidth={1.5} />
                  <span className="text-[13px] font-semibold text-slate-700">{action.label}</span>
                  <ArrowRight size={12} className="text-slate-300 ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
