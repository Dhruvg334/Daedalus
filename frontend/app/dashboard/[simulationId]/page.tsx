"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  ArrowRight,
  Shield,
  BookOpen,
  Zap,
  Compass,
  Target,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Fingerprint,
  Layers,
  Activity,
  UserCheck,
  Share2,
  GitBranch,
  Network,
  Bookmark,
  Award,
  Clock,
  Briefcase,
  CheckCircle2,
  Calendar,
  ChevronRight
} from "lucide-react";
import { getSimulation, toggleBookmark, getBookmarks } from "@/lib/simulation-store";
import { getSimulationById, getOpportunities, getLearningPath } from "@/lib/api";
import type { Simulation, Opportunity, LearningResource } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { CareerDNA } from "@/components/intelligence/career-dna";
import { CareerGraph } from "@/components/intelligence/career-graph";
import { useHackathon } from "@/components/layout/hackathon-modes";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();
  const { presentationMode } = useHackathon();

  const [data, setData] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [learning, setLearning] = useState<LearningResource[]>([]);

  useEffect(() => {
    let cancelled = false;

    const prefetchHubData = async (currentSim: Simulation) => {
      try {
        const [opportunityResult, learningResult] = await Promise.allSettled([
          getOpportunities(currentSim.comparison.recommended_path_id, simulationId),
          getLearningPath(currentSim.comparison.recommended_path_id)
        ]);

        if (cancelled) return;
        if (opportunityResult.status === "fulfilled") {
          setOpps(opportunityResult.value.opportunities.slice(0, 2));
        }
        if (learningResult.status === "fulfilled") {
          setLearning(learningResult.value.resources.slice(0, 2));
        }
      } catch (error) {
        console.warn("Optional dashboard hub prefetch failed:", error);
      }
    };

    const loadData = async () => {
      try {
        const local = getSimulation(simulationId);
        let currentSim = local;
        if (local) {
          if (cancelled) return;
          setData(local);
          setIsBookmarked(getBookmarks().some(b => b.id === local.simulation_id));
        } else {
          const res = await getSimulationById(simulationId);
          currentSim = res.simulation;
          if (cancelled) return;
          setData(res.simulation);
          setIsBookmarked(getBookmarks().some(b => b.id === res.simulation.simulation_id));
        }

        if (!cancelled) setLoading(false);
        if (currentSim) void prefetchHubData(currentSim);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        if (!cancelled) {
          setLoading(false);
          router.push("/demo-personas");
        }
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [simulationId, router]);

  const handleBookmark = () => {
    if (!data) return;
    const added = toggleBookmark(data.simulation_id, data.student_summary.name);
    setIsBookmarked(!!added);
    if (added) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#6366f1']
      });
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="h-80 rounded-[2rem]" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!data) return null;

  const simId = data.simulation_id;
  const recommendedId = data.comparison.recommended_path_id;
  const recommendedPath = data.career_paths.find(p => p.career_id === recommendedId) || data.career_paths[0];

  return (
    <DashboardShell>
      <div className="space-y-10">
        {/* Header Section */}
        <section className="no-print">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {presentationMode ? "Live OS Presentation" : "Career Command Center Active"}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                {data.student_summary.name}&apos;s Command Center
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                {data.student_summary.profile_headline}
              </p>
            </div>
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">System Confidence</span>
                <span className="text-xl font-black text-primary">{(recommendedPath.confidence_score * 100).toFixed(1)}%</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleBookmark}
                className={cn("transition-colors h-11 w-11", isBookmarked && "bg-primary/10 border-primary text-primary")}
              >
                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
              </Button>
              <Button variant="premium" size="lg" className="gap-2 group h-11 shadow-premium">
                <UserCheck className="w-4 h-4" /> Finalize Profile
              </Button>
            </div>
          </div>
        </section>

        {/* --- PART 6: COMMAND CENTER GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: VISUALS & CORE TASKS */}
          <div className="lg:col-span-8 space-y-8">

            {/* TODAY'S MISSION CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-foreground text-background overflow-hidden border-none shadow-premium relative group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-32 h-32 text-primary" />
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-background/50">Today's Protocol</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight italic">"{recommendedPath.mission_statement}"</h2>
                    <p className="text-background/60 text-sm max-w-xl">Focus on Day 1 of your {data.action_sprint.sprint_title}: <span className="text-primary font-bold">{data.action_sprint.days[0].title}</span>.</p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="secondary" size="sm" className="font-bold" asChild>
                      <Link href={`/sprint/${simId}`}>Launch 7-Day Sprint</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-background hover:bg-background/10 font-bold gap-2">
                      Mark as Complete <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* SIGNAL MAP VISUALIZATION */}
            <section className="space-y-4 no-print">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Network className="w-4 h-4" /> Interactive Career Map
                </h2>
                <Badge variant="outline" className="text-[10px] font-mono bg-background">MAP_ENGINE_v1.1</Badge>
              </div>
              <CareerGraph simulation={data} />
            </section>

            {/* EVOLUTIONARY PATHS GRID */}
            <section className="space-y-6">
              <div className="flex items-center justify-between no-print">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Compass className="w-5 h-5 text-muted-foreground" />
                  Primary Trajectories
                </h2>
                <Link href={`/comparison/${simId}`} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  Compare Analysis Matrix <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.career_paths.map((path, index) => {
                  const recommended = path.career_id === recommendedId;
                  return (
                    <motion.div
                      key={path.career_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <Card className={cn(
                        "h-full flex flex-col group transition-all duration-300 overflow-hidden border-border/40",
                        recommended ? "border-primary/50 shadow-xl ring-1 ring-primary/10" : "hover:border-foreground/20 shadow-sm"
                      )}>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={recommended ? "default" : "secondary"} className="text-[9px] font-black h-5 uppercase tracking-tighter">
                              {path.cluster}
                            </Badge>
                            {recommended && <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />}
                          </div>
                          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{path.title}</CardTitle>
                          <CardDescription className="line-clamp-2 leading-relaxed text-xs">
                            {path.one_line_summary}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-4 pt-2">
                          <div className="space-y-3">
                            <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-muted-foreground">Match Affinity</span>
                              <span className="text-foreground">{path.fit_score}%</span>
                            </div>
                            <Progress value={path.fit_score} className="h-1.5" />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {path.matched_skills.slice(0, 3).map(s => (
                              <Badge key={s} variant="outline" className="text-[8px] bg-emerald-500/5 text-emerald-600 border-emerald-500/10 uppercase">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="pt-2 gap-2 no-print bg-muted/20 border-t border-border/5">
                          <Button variant="outline" size="sm" className="w-full text-[10px] font-bold uppercase" asChild>
                            <Link href={`/career/${simId}/${path.career_id}`}>Strategic Audit</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: ANALYTICS & HUB PREVIEWS */}
          <div className="lg:col-span-4 space-y-8">

            {/* SYSTEM ANALYTICS */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Progress Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <StatMetric label="Interview Readiness" value={15} target={100} icon={Shield} color="text-amber-500" />
                <StatMetric label="Skill Verification" value={42} target={100} icon={CheckCircle2} color="text-emerald-500" />
                <StatMetric label="Learning Hours" value={3.5} target={20} suffix="h" icon={Clock} color="text-primary" />
              </CardContent>
            </Card>

            {/* COGNITIVE DNA PREVIEW */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden no-print">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Cognitive Signature</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CareerDNA traits={data.career_dna} />
              </CardContent>
            </Card>

            {/* OPPORTUNITY HUB PREVIEW */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Opportunity Engine</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                  <Link href={`/opportunities/${simId}`}><ChevronRight className="w-4 h-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {opps.map(opp => (
                  <div key={opp.id} className="p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer">
                    <p className="text-xs font-bold truncate group-hover:text-primary">{opp.title}</p>
                    <p className="text-[10px] text-muted-foreground">{opp.organization}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* LEARNING HUB PREVIEW */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Neural Learning</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                  <Link href={`/learning/${simId}`}><ChevronRight className="w-4 h-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {learning.map(res => (
                  <div key={res.id} className="p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer">
                    <p className="text-xs font-bold truncate group-hover:text-emerald-500">{res.title}</p>
                    <p className="text-[10px] text-muted-foreground">{res.provider} · {res.estimated_time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* DECISION LAB BUTTON */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-primary text-primary-foreground space-y-4 shadow-premium group cursor-pointer no-print relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
              <div className="flex items-center justify-between relative z-10">
                <h4 className="font-bold flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Decision Lab
                </h4>
                <Badge className="bg-white/20 text-white border-none text-[9px] font-mono">BETA_v2.1</Badge>
              </div>
              <p className="text-xs text-primary-foreground/80 leading-relaxed relative z-10">
                "What if I increase my focus on Strategic Logic by 20%?"
              </p>
              <Button variant="secondary" size="sm" className="w-full text-[10px] font-black uppercase group-hover:bg-white transition-colors relative z-10" asChild>
                <Link href={`/simulations/${simId}`}>Launch Simulation Engine</Link>
              </Button>
            </motion.div>

            {/* System Info */}
            <div className="pt-4 text-center space-y-1 opacity-30 no-print">
              <p className="text-[8px] font-mono uppercase tracking-[0.3em]">Daedalus_Kernel // Build_0x92f</p>
              <p className="text-[8px] font-mono uppercase tracking-[0.3em]">Latency: 42ms // Secure_Link: Active</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatMetric({ label, value, target, icon: Icon, color, suffix = "%" }: any) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-3 h-3", color)} />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="text-foreground">{value}{suffix}</span>
      </div>
      <Progress value={pct} className="h-1 bg-muted/30" />
    </div>
  );
}
