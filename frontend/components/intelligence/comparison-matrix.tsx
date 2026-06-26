"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Simulation } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ComparisonMatrixProps {
  comparison: Simulation["comparison"]
  className?: string
}

export function ComparisonMatrix({ comparison, className }: ComparisonMatrixProps) {
  return (
    <div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest">Career Path</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">Strategic Fit</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">Growth</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">AI Risk</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest">Entry Project</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparison.comparison_rows.map((row) => {
            const isRecommended = row.career_id === comparison.recommended_path_id
            return (
              <TableRow key={row.career_id} className={cn(isRecommended && "bg-primary/5")}>
                <TableCell className="font-bold text-sm">
                  <div className="flex items-center gap-2">
                    {row.title}
                    {isRecommended && <Badge variant="default" className="text-[8px] h-4">BEST</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    "font-mono text-xs font-bold",
                    row.fit_score > 90 ? "text-emerald-500" : "text-primary"
                  )}>
                    {row.fit_score}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-bold">{row.growth_potential_score}/10</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] uppercase",
                      row.ai_exposure_score > 7 ? "text-destructive border-destructive/20" :
                      row.ai_exposure_score > 4 ? "text-amber-500 border-amber-500/20" : "text-emerald-500 border-emerald-500/20"
                    )}
                  >
                    {row.ai_exposure_score > 7 ? "High" : row.ai_exposure_score > 4 ? "Mid" : "Low"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground italic">
                  {row.first_project}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
