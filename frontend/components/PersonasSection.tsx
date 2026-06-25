"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const personas = [
  {
    id: "aarav_ai_builder",
    name: "Aarav",
    age: 16,
    headline: "Coding + business + YouTube but worried AI may replace software jobs",
    interests: ["Coding", "Business", "Content"],
    color: "from-blue-400 to-indigo-500",
    initials: "AA",
  },
  {
    id: "maya_designer",
    name: "Maya",
    age: 17,
    headline: "Design + psychology + creativity, anxiety about what tech means for her path",
    interests: ["Design", "Psychology", "Art"],
    color: "from-violet-400 to-purple-500",
    initials: "MA",
  },
  {
    id: "riya_bio",
    name: "Riya",
    age: 18,
    headline: "Biology + helping people + genuinely unsure where tech fits in her future",
    interests: ["Biology", "Healthcare", "People"],
    color: "from-emerald-400 to-teal-500",
    initials: "RI",
  },
  {
    id: "kabir_finance",
    name: "Kabir",
    age: 17,
    headline: "Finance + math + wants a high-growth career and clear ROI on his degree",
    interests: ["Finance", "Math", "Strategy"],
    color: "from-amber-400 to-orange-500",
    initials: "KA",
  },
];

export default function PersonasSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Demo Personas</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            See it work for{" "}
            <span className="shimmer-text">someone like you</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto">
            Four pre-built student profiles. One click to see a full career simulation with real output.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {personas.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-5 flex flex-col">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-[16px] mb-4 shadow-lg`}>
                {p.initials}
              </div>

              <div className="font-display font-bold text-slate-800 text-lg mb-0.5">{p.name}</div>
              <div className="text-[11px] text-slate-400 mb-3">Age {p.age}</div>
              <div className="text-[12px] text-slate-500 leading-relaxed mb-4 flex-1">{p.headline}</div>

              <div className="flex flex-wrap gap-1 mb-4">
                {p.interests.map((tag) => (
                  <span key={tag} className="chip text-[10px]">{tag}</span>
                ))}
              </div>

              <Link
                href={`/demo-personas`}
                className="group flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/60 border border-white/80 text-slate-700 text-[12px] font-semibold hover:bg-white/80 transition-all"
              >
                Simulate this profile
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/demo-personas"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-[14px] shadow-lg shadow-blue-300/30 hover:shadow-xl hover:scale-105 transition-all"
          >
            View all demo personas
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
