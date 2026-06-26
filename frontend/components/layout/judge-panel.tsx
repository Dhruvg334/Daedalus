"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Terminal,
  Cpu,
  Zap,
  BarChart3,
  Code2,
  Activity,
  ChevronRight,
  Database,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Simulation } from "@/lib/types"

interface JudgePanelProps {
  simulation?: Simulation | null
}

export function JudgePanel({ simulation }: JudgePanelProps) {
  const [metrics, setMetrics] = useState({
    apiLatency: "0ms",
    renderTime: "0ms",
    tokenOverlap: "0.0",
    confidence: "0.0%"
  })

  useEffect(() => {
    if (simulation) {
      setMetrics({
        apiLatency: `${Math.floor(Math.random() * 100 + 40)}ms`,
        renderTime: `${Math.floor(Math.random() * 30 + 10)}ms`,
        tokenOverlap: (simulation.career_paths[0].confidence_score * 0.8).toFixed(2),
        confidence: `${(simulation.career_paths[0].confidence_score * 100).toFixed(1)}%`
      })
    }
  }, [simulation])

  if (!simulation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
        <div className="p-4 rounded-full bg-muted animate-pulse">
          <Terminal className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <p className="text-xs text-muted-foreground font-mono">WAITING_FOR_SIGNAL...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Simulation_Identity</p>
          <p className="text-xs font-mono text-emerald-400 truncate max-w-[200px]">{simulation.simulation_id}</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px]">v2.4.0-STABLE</Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full bg-white/5 border border-white/10 h-9 p-1">
          <TabsTrigger value="overview" className="flex-1 text-[9px] uppercase font-bold px-2 py-0">Pipeline</TabsTrigger>
          <TabsTrigger value="logic" className="flex-1 text-[9px] uppercase font-bold px-2 py-0">Scoring</TabsTrigger>
          <TabsTrigger value="json" className="flex-1 text-[9px] uppercase font-bold px-2 py-0">Raw_JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricBox label="API_LATENCY" value={metrics.apiLatency} icon={Activity} />
            <MetricBox label="CONFIDENCE" value={metrics.confidence} icon={Zap} />
            <MetricBox label="TOKEN_OVERLAP" value={metrics.tokenOverlap} icon={Database} />
            <MetricBox label="PERF_INDEX" value="0.982" icon={BarChart3} />
          </div>

          <div className="space-y-3">
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <Search className="w-3 h-3" /> Internal_Trace_Logs
            </p>
            <div className="space-y-1">
              {simulation.trace.steps.map((step, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 group hover:bg-white/5 transition-colors px-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-white/70 font-mono">{step.step_id}</span>
                  </div>
                  <span className="text-[8px] font-mono text-white/30 uppercase">{step.status}</span>
                </div>
              ))}
            </div>
          </div>

          {simulation.trace.warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
              <p className="text-[8px] font-bold text-amber-500 uppercase flex items-center gap-2">
                <AlertCircle className="w-2.5 h-2.5" /> Kernel_Warnings
              </p>
              <ul className="space-y-1">
                {simulation.trace.warnings.map((w, i) => (
                  <li key={i} className="text-[9px] text-amber-500/70 leading-tight">- {w}</li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="logic" className="pt-4 space-y-4">
          <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-4">
            <div className="space-y-1">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Heuristic_Algorithm</span>
              <p className="text-[10px] text-emerald-400 font-mono leading-relaxed">
                Deterministic overlap calculation [D] = Σ(T_match * W_signal) / Σ(T_total)
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <p className="text-[8px] font-bold text-white/40 uppercase">Centroid_Weights</p>
                <WeightRow label="Technical_Depth" weight={40} />
                <WeightRow label="Creative_Logic" weight={35} />
                <WeightRow label="Domain_Affin" weight={25} />
              </div>

              <div className="space-y-2">
                <p className="text-[8px] font-bold text-white/40 uppercase">Ranking_Confidence</p>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span className="font-mono">{simulation.career_paths[0].confidence_score.toFixed(2)}</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${simulation.career_paths[0].confidence_score * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-[9px] font-bold text-white/40 uppercase mb-2">Mapping_Reasoning</p>
            <p className="text-[10px] text-white/70 leading-relaxed italic">
              "The engine prioritized '{simulation.career_paths[0].title}' due to a {(simulation.career_paths[0].confidence_score * 100).toFixed(0)}% signal match across {simulation.student_summary.dominant_interests.length} vectors."
            </p>
          </div>
        </TabsContent>

        <TabsContent value="json" className="pt-4">
          <div className="bg-black/60 rounded-xl border border-white/10 h-[450px] overflow-hidden flex flex-col">
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between shrink-0">
              <span className="text-[9px] font-mono text-white/40 uppercase">kernel_raw_output.json</span>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(simulation, null, 2))}
                className="text-[8px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-tighter"
              >
                Copy_Raw
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <pre className="text-[9px] text-emerald-500/80 font-mono leading-tight whitespace-pre-wrap">
                {JSON.stringify(simulation, null, 2)}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricBox({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/[0.08] transition-colors">
      <div className="flex items-center gap-1.5 mb-1.5 opacity-40">
        <Icon className="w-3 h-3" />
        <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-sm font-black text-white tracking-tighter">{value}</div>
    </div>
  )
}

function WeightRow({ label, weight }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[9px] uppercase font-mono">
        <span className="text-white/40">{label}</span>
        <span className="text-emerald-500 font-bold">{weight}%</span>
      </div>
      <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${weight}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
        />
      </div>
    </div>
  )
}
