"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CareerMilestone } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, ShieldAlert, Trophy } from "lucide-react"

interface EvolutionTimelineProps {
  milestones: CareerMilestone[]
  className?: string
}

export function EvolutionTimeline({ milestones, className }: EvolutionTimelineProps) {
  return (
    <div className={cn("relative space-y-8 pl-8", className)}>
      <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

      {milestones.map((milestone, idx) => (
        <motion.div
          key={milestone.period}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary z-10" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{milestone.period}</span>
              <Badge variant="outline" className="text-[9px] bg-background">
                Risk Factor: {(milestone.risk_factor * 100).toFixed(0)}%
              </Badge>
            </div>

            <h4 className="text-lg font-bold">{milestone.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>

            <div className="flex flex-wrap gap-2">
              {milestone.unlocked_capabilities.map(cap => (
                <div key={cap} className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground/70 bg-secondary/50 px-2 py-1 rounded border border-border">
                  <Zap className="w-3 h-3 text-amber-500" />
                  {cap}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
