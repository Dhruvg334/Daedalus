"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Zap } from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { CareerPath, Simulation } from "@/lib/types";

export default function CareerDetailPage() {
  const params = useParams<{ simulationId: string; careerId: string }>();
  const simulationId = params.simulationId as string;
  const careerId = params.careerId as string;
  const [career, setCareer] = useState<CareerPath | null>(null);
  const [simulation, setSimulation] = useState<Simulation | null>(null);

  useEffect(() => {
    const sim = getSimulation(simulationId);
    setSimulation(sim);
    setCareer(sim?.career_paths.find((p) => p.career_id === careerId) || null);
  }, [simulationId, careerId]);

  if (!career || !simulation) {
    return <main><Navbar /><div className="pt-32 text-center text-slate-400">Career path not found.</div></main>;
  }

  return (
    <main>
      <Navbar />
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/dashboard/${simulationId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[13px] mb-8">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>

          <div className="glass-strong rounded-3xl p-8 mb-6">
            <p className="section-label mb-2">{career.cluster}</p>
            <h1 className="font-display text-4xl font-bold text-slate-800 mb-3">{career.title}</h1>
            <p className="text-slate-500 leading-relaxed mb-6">{career.one_line_summary}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Metric label="Fit" value={`${career.fit_score}/100`} />
              <Metric label="AI Exposure" value={`${career.ai_exposure_score}/10`} />
              <Metric label="Difficulty" value={`${career.difficulty_score}/10`} />
              <Metric label="Growth" value={`${career.growth_potential_score}/10`} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Section title="Why this fits you">
              <ul className="space-y-2">{career.why_it_fits.map((item) => <li key={item} className="text-[14px] text-slate-600">• {item}</li>)}</ul>
            </Section>
            <Section title="Human advantage">
              <div className="flex flex-wrap gap-2">{career.human_advantage.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </Section>
          </div>

          <Section title="AI exposure breakdown" className="mb-6">
            <div className="space-y-3">
              {career.ai_exposure_breakdown.map((row) => (
                <div key={row.task} className="rounded-2xl bg-white/50 border border-white/80 p-4">
                  <div className="font-semibold text-slate-700 text-[14px] mb-2">{row.task}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px] text-slate-500">
                    <div><span className="font-semibold text-blue-500">AI role:</span> {row.ai_role}</div>
                    <div><span className="font-semibold text-emerald-500">Human role:</span> {row.human_role}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Section title="Skills">
              <div className="mb-4"><div className="text-[11px] text-slate-400 uppercase mb-2">Required</div><div className="flex flex-wrap gap-2">{career.required_skills.map((s) => <span key={s} className="chip">{s}</span>)}</div></div>
              <div><div className="text-[11px] text-amber-500 uppercase mb-2">Missing</div><div className="flex flex-wrap gap-2">{career.missing_skills.map((s) => <span key={s} className="chip chip-gap">{s}</span>)}</div></div>
            </Section>
            <Section title="Starter project">
              <div className="flex items-start gap-3">
                <Zap size={18} className="text-blue-500 mt-1" />
                <div>
                  <div className="font-semibold text-slate-700">{career.starter_project.title}</div>
                  <p className="text-[13px] text-slate-500 mt-1">{career.starter_project.description}</p>
                  <p className="text-[12px] text-slate-400 mt-3">Output: {career.starter_project.expected_output}</p>
                </div>
              </div>
            </Section>
          </div>

          <Section title="Learning roadmap">
            <div className="space-y-3">{career.learning_roadmap.map((step) => <div key={step.step} className="flex gap-3"><div className="w-7 h-7 rounded-full bg-blue-500 text-white text-[12px] flex items-center justify-center font-bold">{step.step}</div><div><div className="font-semibold text-slate-700 text-[14px]">{step.title}</div><div className="text-[13px] text-slate-500">{step.description}</div><div className="text-[11px] text-slate-400 mt-1">{step.estimated_time}</div></div></div>)}</div>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/50 border border-white/80 p-4"><div className="text-[11px] text-slate-400 uppercase mb-1">{label}</div><div className="font-display text-2xl font-bold text-slate-800">{value}</div></div>;
}

function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <div className={`glass-card rounded-3xl p-6 ${className}`}><h2 className="font-display font-bold text-slate-800 text-xl mb-4">{title}</h2>{children}</div>;
}
