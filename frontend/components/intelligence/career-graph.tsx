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

type GraphPoint = {
  x: number
  y: number
}

const NODE_POSITIONS: GraphPoint[] = [
  { x: 50, y: 21 },
  { x: 27, y: 68 },
  { x: 73, y: 68 },
  { x: 18, y: 42 },
  { x: 82, y: 42 },
]

export function CareerGraph({ simulation, className }: CareerGraphProps) {
  const paths = simulation.career_paths.slice(0, 5)
  const router = useRouter()
  const simId = simulation.simulation_id

  return (
    <div className={cn("relative w-full min-h-[380px] md:min-h-[430px] bg-white rounded-[2rem] overflow-hidden border border-black/80", className)}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {paths.map((path, idx) => {
          const point = NODE_POSITIONS[idx] ?? NODE_POSITIONS[NODE_POSITIONS.length - 1]
          return (
            <motion.line
              key={path.career_id}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 + idx * 0.12 }}
              x1="50"
              y1="50"
              x2={point.x}
              y2={point.y}
              stroke="currentColor"
              strokeWidth="0.45"
              vectorEffect="non-scaling-stroke"
              className="text-black/80"
            />
          )
        })}
      </svg>

      <FloatingNode icon={Brain} delay={0.2} x="15%" y="21%" label="Neural_Match" />
      <FloatingNode icon={Database} delay={0.6} x="84%" y="69%" label="Vector_Cache" />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-[5px] border-black bg-white shadow-sm">
          <User className="h-5 w-5 text-black" />
          <span className="mt-1 text-[9px] font-black uppercase tracking-tighter text-black">Subject</span>
        </div>
      </motion.div>

      {paths.map((path, idx) => {
        const point = NODE_POSITIONS[idx] ?? NODE_POSITIONS[NODE_POSITIONS.length - 1]
        return (
          <motion.button
            key={path.career_id}
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ delay: 0.35 + idx * 0.12, type: "spring", stiffness: 180, damping: 16 }}
            onClick={() => router.push(`/career/${simId}/${path.career_id}`)}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={`Open ${path.title} analysis`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-black bg-white shadow-sm transition-all group-hover:border-[#1e6a8a] group-hover:shadow-md">
              {idx === 0 ? (
                <Zap className="h-7 w-7 text-amber-500" />
              ) : (
                <Target className="h-7 w-7 text-black transition-colors group-hover:text-[#1e6a8a]" />
              )}
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 max-w-[180px] -translate-x-1/2 rounded-lg bg-black px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {path.title}
            </span>
          </motion.button>
        )
      })}

      <div className="absolute bottom-7 left-8">
        <h4 className="mb-1 text-[11px] font-black uppercase tracking-[0.3em] text-black">Signal_Graph // 0x42</h4>
        <p className="text-[10px] text-black/65">Visualizing path centroids and identity vectors</p>
      </div>
    </div>
  )
}

function FloatingNode({ icon: Icon, delay, x, y, label }: { icon: React.ElementType; delay: number; x: string; y: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.12, 0.34, 0.18] }}
      transition={{ duration: 4.5, repeat: Infinity, delay }}
      className="absolute z-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-2 text-black/35">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[8px] font-mono font-black uppercase">{label}</span>
      </div>
    </motion.div>
  )
}
