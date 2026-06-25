"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";

export default function TracePage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [data, setData] = useState<Simulation | null>(null);

  useEffect(() => {
    setData(getSimulation(simulationId));
  }, [simulationId]);

  if (!data) return <main><Navbar /><div className="pt-32 text-center text-slate-400">Trace not found.</div></main>;

  return (
    <main>
      <Navbar />
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/dashboard/${simulationId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[13px] mb-8"><ArrowLeft size={14} /> Back</Link>
          <div className="mb-8">
            <p className="section-label mb-2">AI Pipeline Trace</p>
            <h1 className="font-display text-3xl font-bold text-slate-800">How Daedalus built your career map</h1>
            <p className="text-slate-400 text-[14px] mt-2">A structured pipeline — not a chatbot. Every step is inspectable.</p>
          </div>

          <div className="space-y-3 mb-6">
            {data.trace.steps.map((step, i) => {
              const isOpen = expanded === step.step_id;
              return (
                <div key={step.step_id} className="glass-card rounded-2xl overflow-hidden">
                  <button onClick={() => setExpanded(isOpen ? null : step.step_id)} className="w-full flex items-center gap-3 p-5 text-left">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-white" /></div>
                    <div className="flex-1">
                      <div className="text-[10px] font-mono text-slate-400 mb-0.5">STEP {i + 1} · {step.step_id}</div>
                      <div className="font-medium text-slate-700 text-[14px]">{step.summary}</div>
                    </div>
                    <div className="text-slate-300">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4">
                        <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-widest">Step detail</div>
                        <pre className="text-[11px] text-slate-600 font-mono whitespace-pre-wrap overflow-auto max-h-48">{JSON.stringify(step.detail || step, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {data.trace.warnings.map((warning) => (
            <div key={warning} className="glass-card rounded-2xl p-5 flex items-start gap-3 mb-3">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-slate-500 text-[12px] leading-relaxed">{warning}</p>
            </div>
          ))}

          <div className="mt-4 glass-card rounded-xl p-4 flex items-center justify-between">
            <div className="text-[11px] font-mono text-slate-400">Simulation ID: {data.simulation_id}</div>
            <div className="text-[11px] font-mono text-slate-400">Pipeline: {data.trace.pipeline_version}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
