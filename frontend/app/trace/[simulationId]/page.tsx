"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Layers,
  Terminal,
  Code2,
  Search,
  Cpu
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import type { Simulation } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TracePage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();

  const [expanded, setExpanded] = useState<string | null>(null);
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

          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Logic Transparency Layer</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">How Daedalus Works</h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Every recommendation is traceable. We use a deterministic scoring pipeline to ensure accuracy and explainability.
            </p>
          </div>
        </section>

        {/* Trace Timeline */}
        <div className="space-y-4 relative">
          <div className="absolute left-7 top-10 bottom-10 w-px bg-border/50 hidden md:block" />

          {data.trace.steps.map((step, i) => {
            const isOpen = expanded === step.step_id;
            return (
              <motion.div
                key={step.step_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={cn(
                  "overflow-hidden transition-all duration-300",
                  isOpen ? "ring-1 ring-primary/20 border-primary/20 shadow-md" : "hover:border-primary/20"
                )}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : step.step_id)}
                    className="w-full flex items-center gap-4 p-5 text-left group"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors",
                      isOpen ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <CheckCircle2 size={20} className={isOpen ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                          STEP {i + 1}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <code className="text-[10px] font-mono text-primary/70">{step.step_id}</code>
                      </div>
                      <h3 className="font-bold text-foreground truncate">{step.summary}</h3>
                    </div>

                    <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 ml-14">
                          <div className="rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] p-4 overflow-hidden">
                            <div className="flex items-center gap-2 mb-3">
                              <Terminal size={12} className="text-muted-foreground" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Internal Signal Log</span>
                            </div>
                            <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[300px] custom-scrollbar">
                              {JSON.stringify(step.detail || step, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Warnings & Meta */}
        <div className="space-y-6 pt-6 border-t">
          {data.trace.warnings.map((warning, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03]"
            >
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700/80 dark:text-amber-500/80 leading-relaxed font-medium">
                {warning}
              </p>
            </motion.div>
          ))}

          <Card className="bg-accent/30 border-none shadow-none">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Code2 size={16} className="text-muted-foreground" />
                <div className="text-[10px] font-mono text-muted-foreground space-x-4">
                  <span>Simulation ID: <span className="text-foreground">{data.simulation_id}</span></span>
                  <span>Pipeline: <span className="text-foreground">{data.trace.pipeline_version}</span></span>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] bg-background">
                Verified Deterministic Output
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
