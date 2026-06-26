"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { RiskPoint } from "@/lib/types"
import { AlertTriangle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface RiskHeatmapProps {
  risks: RiskPoint[]
  className?: string
}

export function RiskHeatmap({ risks, className }: RiskHeatmapProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Dynamic Risk Heatmap</h3>
        <Badge variant="outline" className="text-[10px] bg-amber-500/5 text-amber-600 border-amber-500/20">
          <AlertTriangle className="w-3 h-3 mr-1" /> AI-ERA VECTORS
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {risks.map((risk, idx) => (
          <motion.div
            key={risk.category}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-xl border bg-card/50 flex flex-col justify-between h-32 relative overflow-hidden group"
          >
            {/* Background Heat Intensity */}
            <div
              className="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.07]"
              style={{ backgroundColor: getHeatColor(risk.score) }}
            />

            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{risk.category}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="focus:outline-none">
                      <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs max-w-[200px] leading-relaxed">{risk.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2 z-10">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black tracking-tighter" style={{ color: getHeatColor(risk.score) }}>
                  {(risk.score * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] font-bold text-muted-foreground mb-1">PROBABILITY</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${risk.score * 100}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 + 0.5, ease: "circOut" }}
                  className="h-full"
                  style={{ backgroundColor: getHeatColor(risk.score) }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function getHeatColor(score: number) {
  if (score > 0.7) return "hsl(var(--destructive))"
  if (score > 0.4) return "hsl(38 92% 50%)" // Amber
  return "hsl(142 71% 45%)" // Emerald
}
