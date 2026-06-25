"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";

export default function SharePage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const [data, setData] = useState<Simulation | null>(null);

  useEffect(() => {
    setData(getSimulation(simulationId));
  }, [simulationId]);

  if (!data) return <main><Navbar /><div className="pt-32 text-center text-slate-400">Share summary not found.</div></main>;

  const recommended = data.career_paths.find((p) => p.career_id === data.comparison.recommended_path_id) || data.career_paths[0];
  const topGaps = data.skill_gap_analysis.highest_priority_gaps.slice(0, 4);

  return (
    <main>
      <Navbar />
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/dashboard/${simulationId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[13px] mb-8"><ArrowLeft size={14} /> Back</Link>

          <div className="mb-8 text-center">
            <p className="section-label mb-2">Share Summary</p>
            <h1 className="font-display text-3xl font-bold text-slate-800">Exportable career map</h1>
          </div>

          <div className="glass-strong rounded-3xl p-8 mb-6 print:shadow-none print:border print:border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500" />
                <span className="font-display font-bold text-slate-700">Daedalus</span>
              </div>
              <div className="text-[11px] text-slate-400">Career Simulation · {new Date(data.created_at).toLocaleDateString()}</div>
            </div>

            <div className="mb-6">
              <div className="font-display font-bold text-slate-800 text-2xl">{data.student_summary.name}</div>
              <div className="text-slate-400 text-[13px]">{data.student_summary.profile_headline}</div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-1">Top Recommended Path</div>
              <div className="font-display font-bold text-slate-800 text-xl">{recommended.title}</div>
              <div className="text-slate-500 text-[13px] mt-1">Fit Score: {recommended.fit_score}/100 · Growth: {recommended.growth_potential_score}/10 · AI Exposure: {recommended.ai_exposure_score}/10</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              {data.career_paths.map((p) => (
                <div key={p.career_id} className="rounded-xl p-3 bg-white/60 border border-white/90">
                  <div className="font-semibold text-slate-700 text-[12px] mb-1">{p.title}</div>
                  <div className="text-slate-400 text-[11px]">{p.cluster}</div>
                  <div className="font-bold text-slate-800 text-[18px] mt-1">{p.fit_score}</div>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-2">Top Skill Gaps</div>
              <div className="flex flex-wrap gap-1.5">{topGaps.map((g) => <span key={g.skill} className="chip chip-gap text-[11px]">{g.skill}</span>)}</div>
            </div>

            <div className="bg-white/50 rounded-2xl p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-2">{data.action_sprint.sprint_title}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.action_sprint.days.slice(0, 4).map((d) => <div key={d.day} className="text-[12px] text-slate-500">Day {d.day}: {d.title}</div>)}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl glass text-slate-700 font-semibold text-[14px] hover:bg-white/70 transition-all"><Download size={14} /> Download PDF</button>
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-[14px]"><Share2 size={14} /> Copy Link</button>
          </div>
        </div>
      </div>
    </main>
  );
}
