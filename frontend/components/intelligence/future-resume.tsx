"use client"

import React from "react"
import { motion } from "framer-motion"
import { FutureSelf } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Briefcase, Award, GraduationCap } from "lucide-react"

interface FutureResumeProps {
  futureSelf: FutureSelf
  studentName: string
}

export function FutureResume({ futureSelf, studentName }: FutureResumeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-primary/20 bg-card shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>

        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">{studentName}</CardTitle>
              <CardDescription className="text-primary font-medium mt-1">
                {futureSelf.headline}
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono bg-background text-primary border-primary/20">
              PROJECTION // YEAR +5
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Professional Narrative
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed italic bg-accent/30 p-4 rounded-xl border border-border">
              "{futureSelf.narrative}"
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Award className="w-3.5 h-3.5" /> Future Milestones & Impact Signals
            </h4>
            <div className="space-y-2">
              {futureSelf.future_resume_highlights.map((highlight, index) => (
                <div key={index} className="flex gap-3 text-sm p-3 rounded-lg border border-border bg-card hover:border-primary/20 transition-all">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center font-mono text-[10px] text-primary shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-muted-foreground leading-relaxed">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
