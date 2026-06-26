"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Zap,
  Trophy,
  Layers,
  TrendingUp,
  Brain,
  Network
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SkillTree } from "@/components/intelligence/skill-tree";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SkillsPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();
  const [data, setData] = useState<Simulation | null>(null);

  useEffect(() => {
    const sim = getSimulation(simulationId);
    if (!sim) {
      router.push("/demo-personas");
      return;
    }
    setData(sim);
  }, [simulationId, router]);

  if (!data) return null;

  const gaps = data.skill_gap_analysis.highest_priority_gaps;

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
              <div className="flex items-center gap-2 mb-2 text-indigo-500">
                <Target className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Skill Signal Analysis</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">Intelligent Skill Mapping</h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                We've decoded the technical requirements for your recommended paths and mapped them against your current proficiency levels.
              </p>
            </div>
            <Button className="shadow-premium gap-2" asChild>
              <Link href={`/sprint/${simulationId}`}>
                Action Sprint <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Skill Tree (Roadmap.sh inspired) */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="border-border/40 bg-card/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-primary" />
                  Capability Architecture
                </CardTitle>
                <CardDescription>The structured hierarchy of skills required to unlock high-fit careers.</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillTree nodes={data.skill_gap_analysis.skill_tree} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" />
                  Readiness Matrix
                </CardTitle>
                <CardDescription>Current level vs. target proficiency for your recommended paths.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {data.skill_gap_analysis.skill_matrix.map((row) => {
                  const pct = Math.min(100, (row.current_level / row.target_level) * 100);
                  return (
                    <div key={row.skill} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="font-bold text-foreground">{row.skill}</span>
                          <div className="flex gap-2">
                            {row.relevant_career_ids.map(id => (
                              <span key={id} className="text-[10px] text-muted-foreground uppercase font-semibold">
                                {id.split('_').join(' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-primary">Level {row.current_level}</span>
                          <span className="text-xs text-muted-foreground"> / {row.target_level}</span>
                        </div>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Strengths & Priority Gaps */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Verified Strengths
                </CardTitle>
                <CardDescription>High-confidence signals detected in your profile.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.skill_gap_analysis.top_existing_skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground px-1">
              High Priority Gaps
            </h3>
            {gaps.map((gap, idx) => (
              <motion.div
                key={gap.skill}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={cn(
                  "relative overflow-hidden group transition-all",
                  gap.priority === "high" ? "border-amber-500/30 bg-amber-500/[0.02]" : ""
                )}>
                  {gap.priority === "high" && (
                    <div className="absolute top-0 right-0 p-1">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{gap.skill}</CardTitle>
                      <Badge variant={gap.priority === "high" ? "warning" : "secondary"} className="text-[10px]">
                        {gap.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {gap.reason}
                    </p>
                    <div
                      className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary hover:underline cursor-pointer transition-transform group-hover:translate-x-1"
                      onClick={() => router.push(`/sprint/${simulationId}`)}
                    >
                      Build Learning Roadmap <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Card className="bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 bg-white/20 rounded-lg w-fit">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold">Next Intelligence Level</h4>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed">
                    Completing your first starter project will validate 3 of your top 5 skill gaps and unlock the 'Specialist' level on your timeline.
                  </p>
                </div>
                <Button variant="secondary" size="sm" className="w-full text-xs font-bold" asChild>
                  <Link href={`/sprint/${simulationId}`}>Start Verification Sprint</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
