"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  GitBranch,
  Zap,
  RefreshCcw,
  Save,
  Info,
  TrendingUp,
  Brain,
  SlidersHorizontal,
  CheckCircle2
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Maps slider values to adjusted fit score delta
function computeDelta(
  careerCluster: string,
  techFocus: number,
  creationFocus: number,
  strategyFocus: number
): number {
  const clusterLower = careerCluster.toLowerCase();
  let delta = 0;
  if (clusterLower.includes("ai") || clusterLower.includes("software") || clusterLower.includes("data")) {
    delta += (techFocus - 50) * 0.15;
  }
  if (clusterLower.includes("design") || clusterLower.includes("creative") || clusterLower.includes("content")) {
    delta += (creationFocus - 50) * 0.15;
  }
  if (clusterLower.includes("business") || clusterLower.includes("strategy") || clusterLower.includes("product")) {
    delta += (strategyFocus - 50) * 0.15;
  }
  return Math.round(delta);
}

export default function DecisionLabPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();
  const [data, setData] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [savedScenario, setSavedScenario] = useState(false);

  const [parameters, setParameters] = useState({
    techFocus: 50,
    creationFocus: 50,
    strategyFocus: 50,
  });

  const [deltas, setDeltas] = useState<Record<string, number>>({});

  useEffect(() => {
    const sim = getSimulation(simulationId);
    if (!sim) {
      router.push("/demo-personas");
      return;
    }
    setData(sim);
  }, [simulationId, router]);

  const runWhatIf = () => {
    if (!data) return;
    setLoading(true);
    setTimeout(() => {
      const newDeltas: Record<string, number> = {};
      data.career_paths.forEach(p => {
        newDeltas[p.career_id] = computeDelta(p.cluster, parameters.techFocus, parameters.creationFocus, parameters.strategyFocus);
      });
      setDeltas(newDeltas);
      setHasRun(true);
      setLoading(false);
    }, 1200);
  };

  const handleSave = () => {
    setSavedScenario(true);
    setTimeout(() => setSavedScenario(false), 2000);
  };

  if (!data) return null;

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
                <GitBranch className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Decision Laboratory</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">'What-If' Simulation</h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Adjust your cognitive weights and professional focus to see how it reshapes your career landscape.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleSave} disabled={!hasRun}>
                {savedScenario ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                {savedScenario ? "Saved!" : "Save Scenario"}
              </Button>
              <Button onClick={runWhatIf} disabled={loading} className="gap-2 shadow-premium">
                {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Re-Calculate Paths
              </Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Parameter Sliders */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Input Signals</CardTitle>
                </div>
                <CardDescription>Drag to modify your focus areas, then re-calculate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <ParameterSlider
                    label="Technical Depth"
                    value={parameters.techFocus}
                    onChange={(v) => setParameters({...parameters, techFocus: v})}
                    description="Emphasis on engineering and coding tools."
                  />
                  <ParameterSlider
                    label="Creative Output"
                    value={parameters.creationFocus}
                    onChange={(v) => setParameters({...parameters, creationFocus: v})}
                    description="Emphasis on design and content building."
                  />
                  <ParameterSlider
                    label="Strategic Logic"
                    value={parameters.strategyFocus}
                    onChange={(v) => setParameters({...parameters, strategyFocus: v})}
                    description="Emphasis on business and decision logic."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3 h-3 text-primary" />
                <span className="font-bold text-foreground uppercase">Simulator Logic</span>
              </div>
              Changing these parameters alters the deterministic weights of the simulation engine. It tests how the system responds to different "versions" of your professional focus.
            </div>
          </div>

          {/* Results Comparison */}
          <div className="lg:col-span-8 space-y-6 relative">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl border"
                >
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-bold animate-pulse">Running Neural Re-Mapping...</p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {hasRun ? "Projected Shift Analysis" : "Baseline Path Analysis"}
                </h3>

                {!hasRun && (
                  <div className="p-6 rounded-2xl border border-dashed border-border text-center text-muted-foreground text-sm space-y-2">
                    <SlidersHorizontal className="w-8 h-8 mx-auto opacity-30" />
                    <p>Adjust the sliders and click <strong>Re-Calculate Paths</strong> to see how your career landscape shifts.</p>
                  </div>
                )}

                {hasRun && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.career_paths.slice(0, 2).map((path) => {
                      const delta = deltas[path.career_id] ?? 0;
                      const newScore = Math.min(100, Math.max(0, path.fit_score + delta));
                      return (
                        <motion.div
                          key={path.career_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="relative overflow-hidden border-border/40">
                            <div className="absolute top-0 right-0 p-3">
                              <Badge variant="outline" className={cn(
                                "text-[10px]",
                                delta > 0 ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
                                delta < 0 ? "bg-destructive/5 text-destructive border-destructive/10" :
                                "bg-muted text-muted-foreground"
                              )}>
                                {delta > 0 ? `+${delta}% FIT` : delta < 0 ? `${delta}% FIT` : "NO CHANGE"}
                              </Badge>
                            </div>
                            <CardHeader className="pb-4">
                              <CardTitle className="text-lg">{path.title}</CardTitle>
                              <CardDescription className="text-xs uppercase font-bold tracking-tighter text-primary">{path.cluster}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Revised Strategic Fit</span>
                                  <span className="font-black">{newScore}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    className={cn("h-full", delta >= 0 ? "bg-primary" : "bg-destructive/60")}
                                    initial={{ width: `${path.fit_score}%` }}
                                    animate={{ width: `${newScore}%` }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed italic">
                                {delta > 0
                                  ? `Increasing your focus in this direction makes ${path.title} more aligned with your adjusted profile.`
                                  : delta < 0
                                  ? `Shifting focus away from ${path.cluster} reduces the alignment of this path.`
                                  : `This path score is unchanged by the current focus adjustments.`}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {hasRun && (
                  <Card className="bg-accent/20 border-border/30">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold">Intelligence Summary</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your adjustments shifted the decision landscape. The path with the highest cluster-signal match
                          {Object.values(deltas).some(d => d > 0) ? " gained" : " lost"} fitness under these new weights.
                          Use this to explore which version of yourself leads to the most aligned career trajectory.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ParameterSlider({ label, value, onChange, description }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
          <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>
        </div>
        <span className="text-sm font-black text-primary">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        max={100}
        step={1}
        className="cursor-pointer"
      />
    </div>
  );
}
