"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 relative">
      {/* Floating ring decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-blue-200/30 animate-pulse" />
        <div className="absolute inset-[40px] rounded-full border border-blue-100/20" />
        <div className="absolute inset-[80px] rounded-full border border-indigo-100/20" />
      </div>

      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
        <Sparkles size={13} className="text-blue-500" />
        <span className="text-[12px] font-semibold text-blue-600 tracking-wide uppercase">
          AI-Era Career Navigator
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display text-center max-w-3xl mb-6">
        <span className="block text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-slate-800 mb-1">
          Stop asking what
        </span>
        <span className="block text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight shimmer-text mb-1">
          AI will take.
        </span>
        <span className="block text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-slate-800">
          Start building
          <span className="silver-text"> your future.</span>
        </span>
      </h1>

      <p className="text-center text-slate-500 text-lg max-w-xl mb-10 leading-relaxed font-light">
        Daedalus maps three personalized career paths — with AI exposure analysis,
        skill gaps, and a 7-day action sprint tailored to you.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-16">
        <Link
          href="/onboarding"
          className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white font-semibold text-[15px] shadow-lg shadow-blue-300/40 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 transition-all"
        >
          Start Career Simulation
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/demo-personas"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full glass-strong text-slate-700 font-semibold text-[15px] hover:bg-white/80 transition-all"
        >
          Try Demo Persona
        </Link>
      </div>

      {/* Mini preview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {[
          { step: "01", title: "Tell us your interests", desc: "Skills, fears, subjects, and goals" },
          { step: "02", title: "Compare future paths", desc: "3 AI-analyzed career directions" },
          { step: "03", title: "Get your 7-day sprint", desc: "Concrete steps starting this week" },
        ].map((item) => (
          <div key={item.step} className="glass-card rounded-2xl p-5">
            <div className="font-mono text-[11px] text-blue-400/80 font-500 mb-2 tracking-widest">
              {item.step}
            </div>
            <div className="font-semibold text-slate-700 text-[13px] mb-1">{item.title}</div>
            <div className="text-slate-400 text-[12px] leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-blue-400 to-transparent animate-pulse" />
        <span className="text-[10px] tracking-widest text-slate-500 uppercase">Scroll</span>
      </div>
    </section>
  );
}
