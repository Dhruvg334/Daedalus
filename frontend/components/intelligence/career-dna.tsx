"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CareerDNATrait } from "@/lib/types"

interface CareerDNAProps {
  traits: CareerDNATrait[]
  className?: string
}

export function CareerDNA({ traits, className }: CareerDNAProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Career DNA Signature</h3>
        <div className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">v1.1 Deterministic</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {traits.map((trait, idx) => (
          <div key={trait.label} className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-foreground/80">{trait.label}</span>
              <span className="text-primary font-mono">{(trait.value * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trait.value * 100}%` }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground leading-relaxed italic">
        *DNA signature is calculated by mapping profile signals (interests, subjects, skills) against fundamental career archetypes.
      </p>
    </div>
  )
}
