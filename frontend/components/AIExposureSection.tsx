"use client";
import { Shield, TrendingUp, AlertCircle } from "lucide-react";

const tasks = [
  { task: "Writing boilerplate code", ai: "Heavily assists", human: "Reviews, tests, integrates", risk: "medium" },
  { task: "Understanding user problems", ai: "Suggests patterns", human: "Identifies actual pain point", risk: "low" },
  { task: "Debugging edge cases", ai: "Helps spot issues", human: "Understands context & fixes", risk: "low" },
  { task: "Generating first drafts", ai: "Drafts quickly", human: "Edits for tone and accuracy", risk: "medium" },
  { task: "Repetitive data entry", ai: "Automates entirely", human: "Exception handling only", risk: "high" },
  { task: "Strategic decision making", ai: "Provides analysis", human: "Makes final judgment", risk: "low" },
];

const riskConfig = {
  low: { label: "You stay essential", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  medium: { label: "AI assists, you guide", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  high: { label: "Role evolving fast", color: "text-red-500", bg: "bg-red-50 border-red-100" },
};

export default function AIExposureSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: explainer */}
          <div>
            <p className="section-label mb-3">AI Exposure Analysis</p>
            <h2 className="font-display text-4xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
              AI doesn&apos;t just take jobs.<br />
              <span className="shimmer-text">It reshapes them.</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              For every career path, Daedalus breaks down each task — what AI handles,
              what you handle, and how fast that changes. High AI exposure is not a red
              flag. It means your career moves fast and your skills need to evolve with it.
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, title: "Human advantage mapped", desc: "See exactly which tasks keep you irreplaceable across all three paths.", color: "text-blue-500" },
                { icon: TrendingUp, title: "Growth trajectory", desc: "Careers with high AI exposure often have the fastest compensation growth.", color: "text-indigo-500" },
                { icon: AlertCircle, title: "Honest risk labeling", desc: "No sugarcoating. Tasks at high automation risk are clearly flagged.", color: "text-amber-500" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/70 border border-white/90 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className={item.color} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700 text-[14px]">{item.title}</div>
                      <div className="text-slate-400 text-[13px] leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: task breakdown table */}
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/60">
              <div className="font-semibold text-slate-700 text-[14px]">Task-by-task breakdown</div>
              <div className="text-slate-400 text-[12px]">AI Automation Builder • Career Path 1</div>
            </div>

            <div className="divide-y divide-white/40">
              {tasks.map((t, i) => {
                const cfg = riskConfig[t.risk as keyof typeof riskConfig];
                return (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-medium text-slate-700 text-[13px]">{t.task}</div>
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${cfg.bg} ${cfg.color} whitespace-nowrap`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-blue-400 mb-1">AI does</div>
                        <div className="text-[12px] text-slate-500">{t.ai}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">You do</div>
                        <div className="text-[12px] text-slate-600 font-medium">{t.human}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
