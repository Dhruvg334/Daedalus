"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Zap,
  Brain,
  Users,
  Clock,
  Trophy,
  Target,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  History,
  FileText,
  Activity,
  Milestone,
  Wand2
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { CareerPath, Simulation } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { EvolutionTimeline } from "@/components/intelligence/evolution-timeline";
import { FutureResume } from "@/components/intelligence/future-resume";
import { RiskHeatmap } from "@/components/intelligence/risk-heatmap";
import { SocialGenerators } from "@/components/intelligence/social-generators";
import { AutomationHub } from "@/components/intelligence/automation-hub";
import { cn } from "@/lib/utils";

export default function CareerDetailPage() {
  const params = useParams<{ simulationId: string; careerId: string }>();
  const simulationId = params.simulationId as string;
  const careerId = params.careerId as string;
  const router = useRouter();

  const [career, setCareer] = useState<CareerPath | null>(null);
  const [simulation, setSimulation] = useState<Simulation | null>(null);

  useEffect(() => {
    const sim = getSimulation(simulationId);
    if (!sim) {
      router.push("/demo-personas");
      return;
    }
    setSimulation(sim);
    const foundCareer = sim.career_paths.find((p) => p.career_id === careerId);
    if (!foundCareer) {
      router.push(`/dashboard/${simulationId}`);
      return;
    }
    setCareer(foundCareer);
  }, [simulationId, careerId, router]);

  if (!career || !simulation) return null;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4 no-print">
          <Link
            href={`/dashboard/${simulationId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {career.cluster}
                </Badge>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Activity className="w-3 h-3" /> System Confidence: {(career.confidence_score * 100).toFixed(1)}%
                </div>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">{career.title}</h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">{career.one_line_summary}</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Button size="lg" className="gap-2 shadow-premium w-full" asChild>
                <Link href={`/sprint/${simulationId}`}>
                  Execute Roadmap <Zap className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" className="gap-2 w-full" onClick={() => window.print()}>
                <FileText className="w-4 h-4" /> Export Strategy PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Mission Card - Intelligence Layer */}
        <div id="mission-card">
          <Card className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white overflow-hidden border-none shadow-premium animate-in fade-in slide-in-from-bottom-3">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-primary rounded-xl shrink-0">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Mission Card</h3>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed italic">
                    "{career.mission_statement}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="evolution" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-8 mb-8 no-print">
                <TabsTrigger
                  value="evolution"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none py-4 px-0 flex items-center gap-2"
                >
                  <History className="w-4 h-4" /> Career Evolution
                </TabsTrigger>
                <TabsTrigger
                  value="future"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none py-4 px-0 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Future Self
                </TabsTrigger>
                <TabsTrigger
                  value="automation"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none py-4 px-0 flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" /> AI Automation
                </TabsTrigger>
                <TabsTrigger
                  value="readiness"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none py-4 px-0 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> AI Readiness
                </TabsTrigger>
              </TabsList>

              <TabsContent value="evolution" className="space-y-8">
                <div id="timeline">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Milestone className="w-5 h-5 text-primary" />
                        5-Year Strategic Evolution
                      </h3>
                    </div>
                    <EvolutionTimeline milestones={career.evolution_timeline} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="future" className="space-y-8">
                {career.future_self && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Professional Projection
                      </h3>
                      <FutureResume
                        futureSelf={career.future_self}
                        studentName={simulation.student_summary.name}
                      />
                    </div>

                    <div className="no-print">
                      <SocialGenerators
                        careerTitle={career.title}
                        userName={simulation.student_summary.name}
                        mission={career.mission_statement}
                        highlights={career.future_self.future_resume_highlights}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="automation" className="pt-6">
                <AutomationHub simulationId={simulationId} careerTitle={career.title} />
              </TabsContent>

              <TabsContent value="readiness" className="space-y-8">
                {career.risk_heatmap && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      Deterministic Risk Map
                    </h3>
                    <RiskHeatmap risks={career.risk_heatmap} />
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-indigo-500" />
                      Task-Level AI Exposure
                    </CardTitle>
                    <CardDescription>Probability-based audit of workflow automation shifts.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {career.ai_exposure_breakdown.map((row) => (
                      <div key={row.task} className="p-5 rounded-xl border bg-accent/30 transition-all hover:bg-accent/50">
                        <div className="font-bold text-foreground mb-3 flex items-center justify-between">
                          {row.task}
                          <Badge variant="outline" className={cn(
                            "text-[10px] uppercase",
                            row.risk_level === "high" ? "text-destructive border-destructive/20" :
                            row.risk_level === "medium" ? "text-amber-500 border-amber-500/20" : "text-emerald-500 border-emerald-500/20"
                          )}>
                            {row.risk_level} Risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Integration</span>
                            <p className="text-foreground/70 leading-relaxed">{row.ai_role}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Human Advantage</span>
                            <p className="text-foreground/70 leading-relaxed">{row.human_role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-4 space-y-6">
            {/* Why It Fits Section */}
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Strategic Alignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {career.why_it_fits.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm leading-relaxed border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <MetricBox label="Growth" value={`${career.growth_potential_score}/10`} icon={TrendingUp} color="text-emerald-500" />
              <MetricBox label="Difficulty" value={`${career.difficulty_score}/10`} icon={Trophy} color="text-amber-500" />
            </div>

            {/* Learning Path Generator */}
            <Card className="bg-primary text-primary-foreground no-print shadow-premium">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Unlock Career Node
                </CardTitle>
                <CardDescription className="text-primary-foreground/70">Project-based capability verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-background/10 border border-background/20 font-bold text-sm">
                  {career.starter_project.title}
                </div>
                <p className="text-xs text-primary-foreground/80 leading-relaxed">
                  {career.starter_project.description}
                </p>
                <Button variant="secondary" size="sm" className="w-full font-bold" asChild>
                  <Link href={`/sprint/${simulationId}`}>Start 7-Day Verification</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function MetricBox({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="flex flex-col items-center text-center p-4">
      <Icon className={cn("w-5 h-5 mb-2", color)} />
      <div className="text-lg font-black">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
    </Card>
  );
}
