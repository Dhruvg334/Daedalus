"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Download,
  Zap,
  Calendar,
  ChevronRight,
  Trophy,
  Target,
  Clock,
  Loader2
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import { getProgress, updateProgress } from "@/lib/api";
import type { Simulation } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function SprintPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();

  const [data, setData] = useState<Simulation | null>(null);
  const [dbProgress, setDbProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingDay, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const sim = getSimulation(simulationId);
    if (!sim) {
      router.push("/demo-personas");
      return;
    }
    setData(sim);

    const fetchData = async () => {
      try {
        const progRes = await getProgress(simulationId);
        setDbProgress(progRes);
      } catch (error) {
        console.error("Failed to load sprint progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [simulationId, router]);

  const toggleDay = async (day: number) => {
    if (loading || updatingDay !== null) return;

    setUpdatingId(day);
    try {
      const isDone = dbProgress?.completed_task_ids?.includes(`day_${day}`);
      const updated = await updateProgress({
        simulation_id: simulationId,
        task_id: `day_${day}`,
        hours: isDone ? 0 : 1.0 // Add hour if marking as done
      });
      setDbProgress(updated);

      if (!isDone) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#fbbf24']
        });
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!data && !loading) return null;

  const sprint = data?.action_sprint;
  const focus = data?.career_paths.find((p) => p.career_id === sprint?.focus_career_id);
  const isDone = (day: number) => dbProgress?.completed_task_ids?.includes(`day_${day}`);
  const progress = sprint ? Math.round(((dbProgress?.completed_task_ids?.length || 0) / sprint.days.length) * 100) : 0;

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <section className="space-y-4">
          <Link
            href={`/dashboard/${simulationId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2 text-amber-500">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Action Execution Protocol</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">{sprint?.sprint_title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed flex items-center gap-2">
                Focus Target: <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">{focus?.title || sprint?.focus_career_id}</Badge>
              </p>
            </div>
            <div className="flex items-center gap-4 bg-card border rounded-2xl p-4 shadow-sm">
              <div className="space-y-1 min-w-[120px]">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Efficiency</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-black">{dbProgress?.completed_task_ids?.length || 0}/{sprint?.days.length}</div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Nodes Verified</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {sprint?.days.map((day, idx) => {
                const done = isDone(day.day);
                const active = updatingDay === day.day;

                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <button
                      onClick={() => toggleDay(day.day)}
                      disabled={active}
                      className={cn(
                        "w-full text-left p-6 rounded-2xl border transition-all flex gap-6 group relative overflow-hidden",
                        done
                          ? "bg-emerald-500/5 border-emerald-500/20 opacity-90"
                          : "bg-card hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                          done
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-muted group-hover:border-primary/30"
                        )}>
                          {active ? <Loader2 className="w-5 h-5 animate-spin" /> : done ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-bold">{day.day}</span>}
                        </div>
                        <div className="w-px flex-1 bg-border group-last:hidden" />
                      </div>

                      <div className="flex-1 space-y-3 pb-2 relative z-10">
                        <div className="flex items-center justify-between">
                          <h3 className={cn(
                            "text-lg font-bold transition-colors",
                            done ? "text-emerald-900 dark:text-emerald-400 line-through opacity-50" : "text-foreground"
                          )}>
                            {day.title}
                          </h3>
                          <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground uppercase">
                            Phase {day.day}
                          </Badge>
                        </div>
                        <p className={cn(
                          "text-sm leading-relaxed",
                          done ? "text-muted-foreground/60" : "text-muted-foreground"
                        )}>
                          {day.task}
                        </p>

                        <div className={cn(
                          "mt-4 p-3 rounded-xl border flex items-center gap-3 transition-colors",
                          done ? "bg-emerald-500/10 border-emerald-500/10" : "bg-muted/30 border-muted"
                        )}>
                          <div className="p-1.5 bg-background rounded-md border shadow-sm">
                            <Target className={cn("w-3 h-3", done ? "text-emerald-500" : "text-primary")} />
                          </div>
                          <div className="text-xs">
                            <span className="font-bold uppercase tracking-tighter mr-2 text-muted-foreground">Deliverable:</span>
                            <span className={done ? "text-muted-foreground" : "text-foreground/80"}>{day.deliverable}</span>
                          </div>
                        </div>
                      </div>

                      <div className="self-center relative z-10">
                        <ChevronRight className={cn(
                          "w-5 h-5 transition-all",
                          done ? "text-emerald-500/20" : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                        )} />
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-foreground text-background">
              <CardHeader>
                <div className="p-2 bg-primary rounded-lg w-fit mb-4 shadow-lg shadow-primary/20">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Project Milestone</CardTitle>
                <CardDescription className="text-background/60">Final artifact requirement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium leading-relaxed bg-background/10 p-4 rounded-xl border border-background/20">
                  {sprint?.expected_final_output}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Sprint Logistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Est. Time: 1.5 hours / day</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>7 Neural Verifications</span>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-[10px] leading-relaxed text-muted-foreground italic">
                    "This protocol is designed to maximize neural signal with minimal energy expenditure. Complete deliverables to verify nodes."
                  </p>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" className="w-full text-[10px] font-black uppercase gap-2" asChild>
                  <Link href={`/share/${simulationId}`}>
                    <Download className="w-3 h-3" /> Export Protocol
                  </Link>
                </Button>
              </div>
            </Card>

            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-emerald-500 text-white text-center space-y-4 shadow-2xl shadow-emerald-500/40"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-xl">Sprint Verified!</h4>
                  <p className="text-xs text-white/80 uppercase font-bold tracking-widest">Skill Signal: 100%</p>
                </div>
                <Button
                  variant="secondary"
                  className="w-full font-black uppercase text-[10px] h-12 shadow-lg"
                  onClick={() => {
                    const url = `/share/${simulationId}`;
                    window.open(url, '_blank');
                  }}
                >
                  Generate Certification
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
