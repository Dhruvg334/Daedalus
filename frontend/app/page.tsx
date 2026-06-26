import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Compass,
  Zap,
  ShieldCheck,
  BrainCircuit,
  ArrowUpRight,
  Check,
  GitBranch,
  Target,
  Network,
  TrendingUp,
  UserCircle2,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-premium">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Daedalus</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/demo-personas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
            <ThemeToggle />
            <Button variant="premium" size="sm" asChild>
              <Link href="/onboarding">Get Started Free</Link>
            </Button>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/onboarding">Start</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge variant="outline" className="mb-6 py-1 px-4 bg-background/50 backdrop-blur-sm border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-3">
            <Sparkles className="w-3 h-3 mr-2" /> AI-Era Career Intelligence
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-500">
            Stop Guessing Your Future.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Start Simulating It.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700">
            Daedalus is a career simulation engine for students navigating the AI era. Tell us about yourself — we'll map your future in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Button size="lg" className="h-13 px-8 text-base shadow-premium gap-2 group" asChild>
              <Link href="/onboarding">
                Run My Career Simulation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-8 text-base gap-2" asChild>
              <Link href="/demo-personas">
                Try a Demo First <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-300">
            Free to use · No account required · Results in under 10 seconds
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">Process</Badge>
            <h2 className="text-4xl font-black tracking-tight mb-4">From Profile to Roadmap in 4 Steps</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A deterministic simulation engine — not a chatbot. Every output is traceable and explainable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {[
              { step: "01", icon: UserCircle2, title: "Build Your Profile", desc: "Answer 4 quick questions about your interests, skills, and fears. Takes 2 minutes." },
              { step: "02", icon: BrainCircuit, title: "Engine Runs Analysis", desc: "Our deterministic engine maps your signals against a career knowledge base." },
              { step: "03", icon: BarChart3, title: "Get Your Career OS", desc: "Receive a full report: career paths, DNA profile, skill gaps, and a 5-year timeline." },
              { step: "04", icon: Zap, title: "Execute Your Sprint", desc: "Start a 7-day action plan with concrete micro-projects to validate your path." },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all group">
                <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.step}
                </div>
                <div className="p-3 bg-primary/10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-accent/20 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">Intelligence Features</Badge>
            <h2 className="text-4xl font-black tracking-tight mb-4">Everything You Need to Navigate the AI Era</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Compass}
              title="Multi-Path Simulation"
              description="Get 2 ranked career paths with fit scores, growth projections, and AI exposure analysis — all tailored to your specific profile."
            />
            <FeatureCard
              icon={Network}
              title="Career DNA Profile"
              description="Your unique cognitive signature across 5 dimensions: Creation, Analysis, Empathy, Strategy, and Technical depth."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="AI Exposure Audit"
              description="Task-level analysis of automation risk for each career path, with your irreplaceable human advantages highlighted."
            />
            <FeatureCard
              icon={Target}
              title="Skill Gap Mapping"
              description="A visual architecture of what you already have vs. what you need, with a hierarchical skill tree and readiness matrix."
            />
            <FeatureCard
              icon={GitBranch}
              title="'What-If' Decision Lab"
              description="Adjust your focus weights — more technical, more creative, more strategic — and watch your career landscape shift in real time."
            />
            <FeatureCard
              icon={TrendingUp}
              title="5-Year Evolution Timeline"
              description="See your career milestones projected forward: Junior → Specialist → Strategic Lead, with capability unlocks at each stage."
            />
          </div>
        </div>
      </section>

      {/* Explainability Section */}
      <section className="py-24 border-t">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="outline" className="mb-6 text-primary border-primary/20">Transparency</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Explainable AI by Design.</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We believe career decisions shouldn't come from a black box. Every recommendation is traceable through our Pipeline Trace — inspect every step from profile normalization to final fit scoring.
            </p>
            <div className="space-y-4">
              {[
                "Token-based matching logic — no hallucinations",
                "Curated career knowledge base",
                "Inspectable processing pipeline",
                "Deterministic, reproducible fit scores"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/onboarding">Try it yourself <ChevronRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Card className="border-primary/20 shadow-premium overflow-hidden md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-muted p-3 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-4">System Trace — Pipeline v1.1</div>
              </div>
              <CardContent className="p-6 font-mono text-[11px] space-y-2 bg-black text-emerald-400/90 min-h-[16rem]">
                <p className="text-white/40">// Profile normalization complete</p>
                <p>{"{"}</p>
                <p className="pl-4">"step": "dna_analysis",</p>
                <p className="pl-4">"status": "completed",</p>
                <p className="pl-4">"signals": ["creation_0.85", "technical_0.72"],</p>
                <p className="pl-4">"matches": [</p>
                <p className="pl-8">{"{ \"id\": \"ai_automation_builder\", \"fit\": 91 }"},</p>
                <p className="pl-8">{"{ \"id\": \"data_storyteller\", \"fit\": 78 }"}</p>
                <p className="pl-4">]</p>
                <p>{"}"}</p>
                <div className="animate-pulse bg-emerald-400/20 h-4 w-24 mt-4 rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Your career OS is waiting.
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Join students and early professionals using Daedalus to navigate the AI era with clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-13 px-10 text-base shadow-premium gap-2 group" asChild>
              <Link href="/onboarding">
                Run My Career Simulation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-8 text-base gap-2" asChild>
              <Link href="/demo-personas">
                See Demo Personas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Daedalus</span>
            <span className="text-muted-foreground text-sm ml-2">Career Operating System</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Built for the AI era · Deterministic, not generative · Your data stays on your device
          </p>
          <div className="flex gap-6 text-xs font-medium text-muted-foreground">
            <Link href="/onboarding" className="hover:text-foreground transition-colors">Get Started</Link>
            <Link href="/demo-personas" className="hover:text-foreground transition-colors">Demo</Link>
            <ThemeToggle className="scale-75 -mt-1" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Card className="hover:border-primary/50 transition-all group">
      <CardContent className="p-8 space-y-4">
        <div className="p-3 bg-primary/10 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
