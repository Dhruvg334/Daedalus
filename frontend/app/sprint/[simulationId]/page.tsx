"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, CheckCircle2, Circle, Download } from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";

export default function SprintPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const [data, setData] = useState<Simulation | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    setData(getSimulation(simulationId));
  }, [simulationId]);

  if (!data) return <main><Navbar /><div className="pt-32 text-center text-slate-400">Sprint not found.</div></main>;

  const sprint = data.action_sprint;
  const focus = data.career_paths.find((p) => p.career_id === sprint.focus_career_id);

  return (
    <main>
      <Navbar />
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/dashboard/${simulationId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[13px] mb-8"><ArrowLeft size={14} /> Back</Link>
          <div className="mb-8">
            <p className="section-label mb-2">7-Day Action Sprint</p>
            <h1 className="font-display text-3xl font-bold text-slate-800">{sprint.sprint_title}</h1>
            <p className="text-slate-400 text-[14px] mt-2">Focus path: {focus?.title || sprint.focus_career_id}</p>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-white/60">
              <div className="font-display font-bold text-slate-800 text-[18px]">Expected output</div>
              <div className="text-slate-500 text-[13px] mt-1">{sprint.expected_final_output}</div>
            </div>
            <div className="relative p-5">
              <div className="space-y-3">
                {sprint.days.map((day) => {
                  const done = checked.includes(day.day);
                  return (
                    <button key={day.day} onClick={() => setChecked((prev) => done ? prev.filter((d) => d !== day.day) : [...prev, day.day])} className="w-full text-left rounded-2xl bg-white/50 border border-white/80 p-4 flex gap-3 hover:bg-white/70">
                      {done ? <CheckCircle2 size={18} className="text-blue-500 mt-0.5" /> : <Circle size={18} className="text-slate-300 mt-0.5" />}
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-300">DAY {day.day}</div>
                        <div className="font-semibold text-slate-700 text-[14px]">{day.title}</div>
                        <div className="text-[13px] text-slate-500 mt-1">{day.task}</div>
                        <div className="text-[12px] text-slate-400 mt-2">Deliverable: {day.deliverable}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Link href={`/share/${simulationId}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-[14px]">
            <Download size={14} /> Export career map
          </Link>
        </div>
      </div>
    </main>
  );
}
