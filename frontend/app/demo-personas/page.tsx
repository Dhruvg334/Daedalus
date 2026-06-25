"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { getDemoPersonas } from "@/lib/api";
import type { DemoPersona } from "@/lib/types";

export default function DemoPersonasPage() {
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDemoPersonas()
      .then((res) => setPersonas(res.personas))
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load demo personas."));
  }, []);

  return (
    <main>
      <Navbar />
      <div className="pt-36 pb-24 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Zap size={13} className="text-amber-500" />
              <span className="text-[12px] font-semibold text-slate-600 tracking-wide uppercase">One-click simulation</span>
            </div>
            <h1 className="font-display text-5xl font-bold text-slate-800 tracking-tight mb-4">
              Choose a demo <span className="shimmer-text">persona</span>
            </h1>
            <p className="text-slate-500 max-w-md mx-auto">
              Select a pre-built profile and generate a complete career simulation using the backend API.
            </p>
          </div>

          {error && <div className="glass-card rounded-2xl p-5 text-center text-red-500 mb-6">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {personas.map((p, index) => {
              const gradient = ["from-blue-400 to-indigo-500", "from-violet-400 to-purple-500", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500"][index % 4];
              return (
                <div key={p.persona_id} className="glass-card rounded-3xl p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-display font-bold text-slate-800 text-xl">{p.name}</div>
                      <div className="text-slate-400 text-[12px]">Age {p.age || "—"} · {p.work_style} · {p.weekly_time_available}</div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-[14px] leading-relaxed mb-5">{p.headline}</p>

                  <div className="space-y-3 mb-5">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Interests</div>
                      <div className="flex flex-wrap gap-1">{p.interests.map((tag) => <span key={tag} className="chip text-[11px]">{tag}</span>)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Current skills</div>
                      <div className="flex flex-wrap gap-1">{p.current_skills.map((tag) => <span key={tag} className="chip text-[11px]">{tag}</span>)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-1.5">Career fears</div>
                      <div className="flex flex-wrap gap-1">{p.career_fears.map((f) => <span key={f} className="chip chip-gap text-[11px]">{f}</span>)}</div>
                    </div>
                  </div>

                  <Link href={`/loading?persona=${p.persona_id}`} className="group flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-[14px] shadow-md shadow-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all">
                    Simulate {p.name}&apos;s profile
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center glass-card rounded-2xl p-6">
            <p className="text-slate-500 text-[14px] mb-3">Want to enter your own details instead?</p>
            <Link href="/onboarding" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-[14px] hover:text-blue-700">
              Start the career quiz <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
