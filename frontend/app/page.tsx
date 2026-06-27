import Link from "next/link";
import AntigravityBackground from "@/components/AntigravityBackground";
import { ArrowRight, Sparkles, UserCircle2, BrainCircuit, BarChart3, Zap } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { ContinueDashboardButton } from "@/components/ContinueDashboardButton";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <AntigravityBackground />
      <FloatingNav />

      {/* ══ SCROLL 1 — Hero ══ */}
      <section className="relative scroll-section flex flex-col items-center justify-center text-center overflow-hidden">
        <div
  className="aurora-bg absolute inset-0"
  style={{
    zIndex: 2,
  }}
>
          <div className="ab ab1" /><div className="ab ab2" /><div className="ab ab3" />
          <div className="dot-grid" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20">
          <div className="pb mb-8 mx-auto w-fit">
          </div>

          <h3 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.06]">
          Stop guessing <br></br>your future.{" "} 
          </h3>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.06]">
          <span style={{ color: "#1e6a8a" }}>Start SIMULATING it.</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">
            Map your future in minutes
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding"><button className="btn-dark text-base">Run My Career Simulation <ArrowRight className="w-4 h-4" /></button></Link>
            <Link href="/demo-personas"><button className="btn-outline text-base">See Demo Personas</button></Link>
          </div>
          <ContinueDashboardButton />
      
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-35">
          <div className="w-px h-8 bg-gradient-to-b from-[#7BBAD4] to-transparent" />
        </div>
      </section>

      {/* ══ SCROLL 2 — How It Works ══ */}
      <section id="how-it-works" className="scroll-section flex items-center border-t border-neutral-100 bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-14">
            <div className="pb mb-5 mx-auto w-fit">Process</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              From Profile to Roadmap<br />
              <span style={{ color: "#7BBAD4" }}>in 4 Steps</span>
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto leading-relaxed">
              A deterministic simulation engine — not a chatbot. Every output is traceable and explainable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
            <div className="hidden md:block absolute top-[3.1rem] left-[15%] right-[15%] h-px"
              style={{ background: "linear-gradient(to right,transparent,#B0D4E8,#B0D4E8,transparent)" }} />
            {[
              { step: "01", icon: UserCircle2, title: "Build Your Profile", desc: "Answer 4 quick questions about your interests, skills, and fears. Takes 2 minutes." },
              { step: "02", icon: BrainCircuit, title: "Engine Runs Analysis", desc: "Our deterministic engine maps your signals against a career knowledge base." },
              { step: "03", icon: BarChart3, title: "Get Your Career OS", desc: "Receive a full report: career paths, DNA profile, skill gaps, and a 5-year timeline." },
              { step: "04", icon: Zap, title: "Execute Your Sprint", desc: "Start a 7-day action plan with concrete micro-projects to validate your path." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="step-card relative flex flex-col items-center text-center p-7 group">
                <div className="absolute -top-3 left-5 text-[10px] font-black px-2.5 py-0.5 rounded-full"
                  style={{ background: "#7BBAD4", color: "#fff" }}>{step}</div>
                <div className="p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "rgba(176,212,232,.2)" }}>
                  <Icon className="w-6 h-6" style={{ color: "#1e6a8a" }} />
                </div>
                <h3 className="font-bold text-base mb-2 text-black">{title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/onboarding"><button className="btn-dark text-sm">Try it free <ArrowRight className="w-3.5 h-3.5" /></button></Link>
          </div>
        </div>
      </section>

      {/* ══ SCROLL 3 — CTA ══ */}
      <section id="cta" className="scroll-section flex items-center justify-center border-t border-neutral-100 overflow-hidden"
        style={{ background: "#f8fbfd" }}>
        <div className="aurora-bg" style={{ opacity: 0.32 }}>
          <div className="ab ab1" style={{ opacity: .28 }} />
          <div className="ab ab3" style={{ opacity: .2 }} />
        </div>

        <div className="relative z-20 max-w-3xl mx-auto px-6 py-20 text-center space-y-8">
          <div className="inline-flex p-4 rounded-3xl" style={{ background: "rgba(176,212,232,.22)" }}>
            <Sparkles className="w-8 h-8" style={{ color: "#1e6a8a" }} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Your career OS<br />is waiting.
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 max-w-lg mx-auto leading-relaxed">
            Join students and early professionals using Daedalus to navigate the AI era with clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/onboarding"><button className="btn-dark text-base">Run My Career Simulation <ArrowRight className="w-4 h-4" /></button></Link>
            <Link href="/demo-personas"><button className="btn-outline text-base">See Demo Personas</button></Link>
          </div>
          <p className="text-sm text-neutral-400">Free · No account needed · 10-second results</p>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer className="footer-dark py-7 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#7BBAD4] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Daedalus</span>
            <span className="text-neutral-500 text-sm ml-1">Career OS</span>
          </div>
          <p className="text-neutral-500 text-xs text-center">
            © {new Date().getFullYear()} Daedalus · Built with ❤️
          </p>
          <div className="flex gap-5 text-xs font-medium text-neutral-400">
            {[
              { href: "/onboarding", label: "Get Started" },
              { href: "/demo-personas", label: "Demo" },
              { href: "#how-it-works", label: "How it Works" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
