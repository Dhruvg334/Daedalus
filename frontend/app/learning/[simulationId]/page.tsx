"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  Trophy,
  Clock,
  ChevronRight,
  PlayCircle,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Check,
  Loader2,
  Zap
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import { getLearningPath, updateProgress, getProgress } from "@/lib/api";
import type { Simulation, LearningResource } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function LearningHubPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();

  const [data, setData] = useState<Simulation | null>(null);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [dbProgress, setDbProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const sim = getSimulation(simulationId);
    if (!sim) {
      router.push("/demo-personas");
      return;
    }
    setData(sim);

    const fetchData = async () => {
      try {
        const [learnRes, progRes] = await Promise.all([
          getLearningPath(sim.comparison.recommended_path_id),
          getProgress(simulationId)
        ]);
        setResources(learnRes.resources);
        setDbProgress(progRes);
      } catch (error) {
        console.error("Failed to load learning data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [simulationId, router]);

  const handleComplete = async (resourceId: string) => {
    setUpdatingId(resourceId);
    try {
      const updated = await updateProgress({
        simulation_id: simulationId,
        resource_id: resourceId,
        hours: 1.5 // Mock hours gained
      });
      setDbProgress(updated);

      // Visual feedback
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399']
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!data && !loading) return null;

  const isCompleted = (id: string) => dbProgress?.completed_resource_ids?.includes(id);
  const progressPercent = dbProgress ? Math.round((dbProgress.completed_resource_ids?.length / (resources.length || 1)) * 100) : 0;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-10">
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
            <div>
              <div className="flex items-center gap-2 mb-2 text-primary">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Neural Learning Ecosystem</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">Skill Acquisition Dashboard</h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Personalized curriculum to bridge gaps for
                <span className="text-primary font-bold"> {data?.career_paths[0].title}</span>.
              </p>
            </div>

            <Card className="bg-primary/5 border-primary/20 shrink-0">
              <CardContent className="p-4 flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Progress</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-primary">{progressPercent}%</span>
                    <Progress value={progressPercent} className="w-24 h-1.5" />
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Streak</p>
                  <div className="flex items-center gap-1 justify-center">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-2xl font-black">{dbProgress?.streak_count || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learning Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="h-64">
                <CardHeader className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            resources.map((res, idx) => {
              const done = isCompleted(res.id);
              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={cn(
                    "h-full flex flex-col group transition-all duration-300 relative",
                    done ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "hover:border-primary/50"
                  )}>
                    {done && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          done ? "bg-emerald-500/10 text-emerald-500" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          {getResourceIcon(res.type)}
                        </div>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold">
                          {res.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className={cn(
                        "text-lg leading-snug line-clamp-2 min-h-[3.5rem] transition-colors",
                        done ? "text-emerald-900 dark:text-emerald-400" : "group-hover:text-primary"
                      )}>
                        {res.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-bold text-muted-foreground">
                        {res.provider}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {res.estimated_time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-3 h-3 text-amber-500" /> {res.quality_score}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {res.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[9px] font-medium bg-muted/50 border-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 gap-2 border-t bg-muted/5">
                      <Button
                        variant={done ? "outline" : "default"}
                        size="sm"
                        className="w-full text-[10px] font-black uppercase"
                        onClick={() => handleComplete(res.id)}
                        disabled={updatingId === res.id || done}
                      >
                        {updatingId === res.id ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        ) : done ? (
                          <Check className="w-3 h-3 mr-2" />
                        ) : null}
                        {done ? "Completed" : "Mark as Complete"}
                      </Button>
                      <Button variant="ghost" size="icon" className="shrink-0" asChild>
                        <a href={res.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Skill Verification Dashboard */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-md shadow-premium overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              Neural Skill Verification
            </CardTitle>
            <CardDescription>Track the transition from resource consumption to verified professional signal.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">High-Priority Targets</h4>
                {data?.skill_gap_analysis.skill_matrix.slice(0, 3).map((skill) => (
                  <div key={skill.skill} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold">{skill.skill}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">LEVEL {skill.current_level} / {skill.target_level}</span>
                    </div>
                    <Progress value={(skill.current_level / skill.target_level) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
              <div className="bg-muted/20 rounded-2xl p-6 border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm">Unlock Specialist Level</p>
                  <p className="text-xs text-muted-foreground">Complete 2 more resources to verify your 'Tool Proficiency' node.</p>
                </div>
                <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase" asChild>
                  <Link href={`/sprint/${simulationId}`}>Launch Sprint Verification</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function getResourceIcon(type: string) {
  switch (type) {
    case "video": return <Video className="w-4 h-4" />
    case "tutorial": return <PlayCircle className="w-4 h-4" />
    case "documentation": return <FileText className="w-4 h-4" />
    case "course": return <GraduationCap className="w-4 h-4" />
    default: return <BookOpen className="w-4 h-4" />
  }
}
