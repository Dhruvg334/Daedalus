"use client";
import { Brain, Layers, Zap, Target } from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "Profile your world",
    desc: "Enter your interests, subjects, current skills, work style, and what you're afraid of getting wrong. Takes under 3 minutes.",
    tag: "Personalization",
  },
  {
    icon: Layers,
    title: "Three paths emerge",
    desc: "Daedalus scores career clusters using your exact profile, then generates three distinct futures ranked by fit, growth, and AI exposure.",
    tag: "AI Analysis",
  },
  {
    icon: Zap,
    title: "See how AI changes each path",
    desc: "Every career path includes a task-by-task AI exposure breakdown — so you know what AI will assist, augment, and where you stay irreplaceable.",
    tag: "AI Exposure",
  },
  {
    icon: Target,
    title: "Know what to do this week",
    desc: "Your 7-day action sprint turns the best path into daily deliverables. By day 7, you'll have a real project you built.",
    tag: "Action Sprint",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">The Method</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            From confusion to{" "}
            <span className="shimmer-text">clarity</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto text-base leading-relaxed">
            Not a chatbot. Not a quiz. A structured simulation that turns your inputs into a decision cockpit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="glass-card rounded-3xl p-7 relative overflow-hidden">
                {/* Background number */}
                <span className="absolute right-6 top-4 font-mono text-[80px] font-bold text-blue-100/50 select-none leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4 border border-white/80">
                    <Icon size={18} className="text-blue-500" strokeWidth={1.5} />
                  </div>
                  <div className="chip mb-3">{s.tag}</div>
                  <h3 className="font-display font-700 text-xl text-slate-800 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-[14px] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
