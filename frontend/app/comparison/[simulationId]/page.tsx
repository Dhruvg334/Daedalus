"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";import {
  ArrowLeft,
  BarChart3,
  Sparkles,
  Info,
  TrendingUp,
  Brain,
  ShieldCheck,
  Target
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComparisonMatrix } from "@/components/intelligence/comparison-matrix";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ComparisonPage() {
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
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Career Intelligence Matrix</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">Side-by-Side Analysis</h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Objective comparison of your top paths across fit, growth, and AI-era risk factors.
              </p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link href={`/share/${simulationId}`}>
                <Sparkles className="w-4 h-4" /> Export Report
              </Link>
            </Button>
          </div>
        </section>

        {/* Matrix Card */}
        <Card className="border-none shadow-premium overflow-hidden">
          <ComparisonMatrix comparison={data.comparison} />
        </Card>

        {/* Intelligence Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            icon={TrendingUp}
            title="Growth Leader"
            path={data.career_paths.reduce((prev, current) => (prev.growth_potential_score > current.growth_potential_score) ? prev : current).title}
            description="This path shows the highest compound growth potential over the next 5 years."
            color="text-emerald-500"
            bgColor="bg-emerald-500/10"
          />
          <InsightCard
            icon={Brain}
            title="Human Edge"
            path={data.career_paths.reduce((prev, current) => (prev.ai_exposure_score < current.ai_exposure_score) ? prev : current).title}
            description="This path has the lowest risk of complete AI substitution for core tasks."
            color="text-indigo-500"
            bgColor="bg-indigo-500/10"
          />
          <InsightCard
            icon={ShieldCheck}
            title="Strategic Fit"
            path={data.career_paths.find(p => p.career_id === data.comparison.recommended_path_id)?.title || ""}
            description="Highest alignment with your current skill signature and long-term DNA."
            color="text-primary"
            bgColor="bg-primary/10"
          />
        </div>

        {/* Legend / Methodology */}
        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Intelligence Methodology</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-[11px] text-muted-foreground leading-relaxed">
            <div>
              <span className="font-bold text-foreground block mb-1">Strategic Fit</span>
              Calculated using token overlap between profile vectors and career requirements.
            </div>
            <div>
              <span className="font-bold text-foreground block mb-1">Growth Index</span>
              Based on job market velocity and AI-augmentation productivity gains.
            </div>
            <div>
              <span className="font-bold text-foreground block mb-1">AI Exposure</span>
              Measures task-level automation risk vs human-in-the-loop requirements.
            </div>
            <div>
              <span className="font-bold text-foreground block mb-1">Confidence</span>
              The statistical reliability of the recommendation based on input density.
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function InsightCard({ icon: Icon, title, path, description, color, bgColor }: any) {
  return (
    <Card className="hover:border-primary/20 transition-all group">
      <CardContent className="p-6 space-y-3">
        <div className={cn("p-2 rounded-lg w-fit", bgColor)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{title}</h4>
          <p className="font-bold text-base mb-2">{path}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
