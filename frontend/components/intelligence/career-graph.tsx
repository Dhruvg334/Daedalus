"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Simulation } from "@/lib/types"
import { Brain, User, Zap, Target, Database } from "lucide-react"
import { useRouter } from "next/navigation"

interface CareerGraphProps {
  simulation: Simulation
  className?: string
}

export function CareerGraph({ simulation, className }: CareerGraphProps) {
  const paths = simulation.career_paths
  const router = useRouter()
  const simId = simulation.simulation_id

  return (
    <div className={cn("relative w-full h-[400px] bg-accent/20 rounded-[2rem] overflow-hidden border border-border/50", className)}>
      {/* Central Node: The User */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="p-4 rounded-full bg-primary shadow-lg shadow-primary/20 border-4 border-background flex flex-col items-center">
          <User className="w-6 h-6 text-primary-foreground" />
          <span className="text-[10px] font-bold text-primary-foreground mt-1 uppercase tracking-tighter">Subject</span>
        </div>
      </motion.div>

      {/* Connection Lines & Path Nodes */}
      {paths.map((path, idx) => {
        const angle = (idx / paths.length) * 2 * Math.PI - Math.PI / 2
        const radius = 130
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        return (
          <React.Fragment key={path.career_id}>
            {/* SVG Connector */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${x}px)`}
                y2={`calc(50% + ${y}px)`}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Path Node */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ delay: 0.8 + idx * 0.2, type: "spring" }}
              className="absolute z-10"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <div
                onClick={() => router.push(`/career/${simId}/${path.career_id}`)}
                className="group cursor-pointer relative"
              >
                <div className="w-14 h-14 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all">
                  {idx === 0 ? (
                    <Zap className="w-6 h-6 text-amber-500 fill-amber-500/20" />
                  ) : (
                    <Target className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-[10px] font-bold shadow-lg">
                    {path.title}
                  </div>
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        )
      })}

      {/* Ambient Logic Nodes */}
      <FloatingNode icon={Brain} delay={2} x="15%" y="20%" label="Neural_Match" />
      <FloatingNode icon={Database} delay={2.5} x="85%" y="75%" label="Vector_Cache" />

      <div className="absolute bottom-6 left-8">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">Signal_Graph // 0x42</h4>
        <p className="text-[9px] text-muted-foreground/60 font-mono">Visualizing path centroids and identity vectors</p>
      </div>
    </div>
  )
}

function FloatingNode({ icon: Icon, delay, x, y, label }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.3, 0.15],
        y: [0, -15, 0]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay
      }}
      className="absolute z-0 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-2 text-primary/30">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[8px] font-mono uppercase font-black">{label}</span>
      </div>
    </motion.div>
  )
}
