"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Share2, Sparkles, Star } from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import { submitFeedback } from "@/lib/api";
import type { Simulation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { cn } from "@/lib/utils";

export default function SharePage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const [data, setData] = useState<Simulation | null>(null);

  useEffect(() => {
    setData(getSimulation(simulationId));
  }, [simulationId]);

  if (!data) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Share summary not found.</p>
        </div>
      </DashboardShell>
    );
  }

  const recommended =
    data.career_paths.find((p) => p.career_id === data.comparison.recommended_path_id) ||
    data.career_paths[0];
  const topGaps = data.skill_gap_analysis.highest_priority_gaps.slice(0, 4);

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href={`/dashboard/${simulationId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="text-center space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Share Summary</div>
          <h1 className="text-3xl font-bold tracking-tight">Exportable Career Map</h1>
        </div>

        {/* Shareable Card */}
        <Card className="border-primary/20 shadow-premium overflow-hidden print:shadow-none">
          <div className="h-1 bg-gradient-to-r from-primary to-indigo-500" />
          <CardContent className="p-8 space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">Daedalus</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                Career Simulation · {new Date(data.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Subject identity */}
            <div className="space-y-1">
              <div className="text-2xl font-bold">{data.student_summary.name}</div>
              <div className="text-muted-foreground text-sm">{data.student_summary.profile_headline}</div>
            </div>

            {/* Top recommended path */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Top Recommended Path</div>
              <div className="text-xl font-bold">{recommended.title}</div>
              <div className="text-muted-foreground text-sm">
                Fit Score: {recommended.fit_score}/100 · Growth: {recommended.growth_potential_score}/10 · AI Exposure: {recommended.ai_exposure_score}/10
              </div>
            </div>

            {/* All paths grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.career_paths.map((p) => (
                <div
                  key={p.career_id}
                  className="rounded-xl p-4 bg-muted/30 border border-border space-y-1"
                >
                  <div className="font-semibold text-sm">{p.title}</div>
                  <div className="text-muted-foreground text-xs">{p.cluster}</div>
                  <div className="font-bold text-2xl text-primary">{p.fit_score}</div>
                </div>
              ))}
            </div>

            {/* Skill gaps */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Top Skill Gaps</div>
              <div className="flex flex-wrap gap-1.5">
                {topGaps.map((g) => (
                  <Badge key={g.skill} variant="outline" className="text-amber-600 border-amber-500/20 bg-amber-500/5">
                    {g.skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sprint preview */}
            <div className="bg-muted/20 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{data.action_sprint.sprint_title}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {data.action_sprint.days.slice(0, 4).map((d) => (
                  <div key={d.day} className="text-xs text-muted-foreground">
                    Day {d.day}: <span className="text-foreground font-medium">{d.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3 no-print">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            <Share2 className="w-4 h-4" /> Copy Link
          </Button>
        </div>

        {/* Feedback Widget */}
        <FeedbackWidget simulationId={simulationId} />
      </div>
    </DashboardShell>
  );
}

function FeedbackWidget({ simulationId }: { simulationId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (r: number) => {
    setRating(r);
    try {
      await submitFeedback(simulationId, r);
    } catch {
      // best-effort
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground no-print">
        Thank you for your feedback! ✨
      </div>
    );
  }

  return (
    <Card className="no-print border-border/40 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-center text-muted-foreground font-medium">How useful was this simulation?</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center gap-2 pb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125"
          >
            <Star
              className={cn(
                "w-7 h-7 transition-colors",
                (hovered || rating) >= star ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
