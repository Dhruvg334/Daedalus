"use client";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/40 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-300/40">
              <Compass size={26} className="text-white" strokeWidth={1.5} />
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4">
              Your future is not{" "}
              <span className="shimmer-text">random.</span>
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto mb-8">
              Career clarity takes under 3 minutes with Daedalus.
              No account needed. No fluff. Just your inputs and three possible futures.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/onboarding"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white font-bold text-[15px] shadow-xl shadow-blue-300/40 hover:shadow-2xl hover:shadow-blue-300/50 hover:scale-105 transition-all"
              >
                Start Career Simulation
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo-personas"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/80 bg-white/50 text-slate-700 font-semibold text-[15px] hover:bg-white/70 transition-all"
              >
                Try Demo Persona
              </Link>
            </div>

            <p className="text-slate-400 text-[12px] mt-6">
              No account required · Built for real career clarity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
