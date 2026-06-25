"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";

export default function SkillsPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const [data, setData] = useState<Simulation | null>(null);

  useEffect(() => {
    setData(getSimulation(simulationId));
  }, [simulationId]);

  if (!data) return <main><Navbar /><div className="pt-32 text-center text-slate-400">Skill map not found.</div></main>;

  const gaps = data.skill_gap_analysis.highest_priority_gaps;

  return (
    <main>
      <Navbar />
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/dashboard/${simulationId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[13px] mb-8"><ArrowLeft size={14} /> Back</Link>
          <div className="mb-8">
            <p className="section-label mb-2">Skill Gap Map</p>
            <h1 className="font-display text-3xl font-bold text-slate-800">What to build next</h1>
            <p className="text-slate-400 text-[14px] mt-2">Daedalus compares your current skill signal with the requirements across recommended paths.</p>
          </div>

          <div className="glass-card rounded-3xl p-6 mb-6">
            <h2 className="font-display font-bold text-slate-800 text-xl mb-4">Existing strengths</h2>
            <div className="flex flex-wrap gap-2">{data.skill_gap_analysis.top_existing_skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {gaps.map((gap) => (
              <div key={gap.skill} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{gap.skill}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${gap.priority === "high" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>{gap.priority}</span>
                </div>
                <p className="text-[13px] text-slate-500 leading-relaxed">{gap.reason}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-6 mb-6">
            <h2 className="font-display font-bold text-slate-800 text-xl mb-4">Skill readiness matrix</h2>
            <div className="space-y-4">
              {data.skill_gap_analysis.skill_matrix.map((row) => {
                const pct = Math.min(100, (row.current_level / row.target_level) * 100);
                return (
                  <div key={row.skill}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="font-medium text-slate-700">{row.skill}</span>
                      <span className="text-slate-400">Level {row.current_level}/{row.target_level}</span>
                    </div>
                    <div className="meter-bar"><div className="meter-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link href={`/sprint/${simulationId}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-[14px]">
            Move to action sprint <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
