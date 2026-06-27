"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, UserCircle2, ChevronRight } from "lucide-react";
import { getDemoPersonas } from "@/lib/api";
import type { DemoPersona } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DemoPersonasPage() {
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDemoPersonas().then(r => setPersonas(r.personas)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCircle2 className="w-4 h-4 text-[#7BBAD4]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1e6a8a]">Demo Library</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Try a pre-built profile</h1>
          <p className="text-neutral-500 max-w-lg">
            Pick any persona to see a full career simulation — no account required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            [1,2,3,4].map(i => <div key={i} className="h-52 rounded-2xl bg-neutral-100 animate-pulse" />)
          ) : personas.map((p, idx) => (
            <motion.div key={p.persona_id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}>
              <Link href={`/loading?persona=${p.persona_id}`}
                className="block group h-full p-6 rounded-2xl border-2 border-neutral-200 bg-white
                  hover:border-[#7BBAD4] hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#7BBAD4]/12 flex items-center justify-center
                    text-[#1e6a8a] font-black text-lg border border-[#7BBAD4]/25 shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-black text-base">{p.name}</h3>
                    <p className="text-xs text-neutral-400 font-mono">{p.persona_id}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-2 italic">
                  "{p.headline}"
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.interests.slice(0, 3).map(i => (
                    <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-full font-medium
                      bg-[#7BBAD4]/12 text-[#1e6a8a] border border-[#7BBAD4]/25">{i}</span>
                  ))}
                  {p.current_skills.slice(0, 2).map(s => (
                    <span key={s} className="text-[11px] px-2.5 py-0.5 rounded-full font-medium
                      bg-emerald-50 text-emerald-700 border border-emerald-200">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1e6a8a]
                  group-hover:gap-2.5 transition-all">
                  Run simulation <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-neutral-100 pt-6 flex items-center justify-between">
          <p className="text-sm text-neutral-400">Or start with your own profile</p>
          <Link href="/onboarding">
            <button className="btn-dark text-sm">
              Build my profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
