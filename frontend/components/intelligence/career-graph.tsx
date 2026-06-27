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

const WIDTH = 1000
const HEIGHT = 430
const CENTER: GraphPoint = { x: 500, y: 215 }

const NODE_POSITIONS: GraphPoint[] = [
  { x: 500, y: 92 },
  { x: 330, y: 300 },
  { x: 670, y: 300 },
  { x: 220, y: 190 },
  { x: 780, y: 190 },
]

export function CareerGraph({ simulation, className }: CareerGraphProps) {
  const paths = simulation.career_paths.slice(0, 5)
  const router = useRouter()
  const simId = simulation.simulation_id

  const openCareer = (careerId: string) => {
    router.push(`/career/${simId}/${careerId}`)
  }

  return (
    <div className={cn("relative w-full overflow-hidden rounded-[2rem] border border-black/80 bg-white", className)}>
      <svg
        className="block h-auto w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Interactive career map"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="daedalus-node-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.10" />
          </filter>
        </defs>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <text x="154" y="103" className="fill-black/25 text-[11px] font-black uppercase tracking-wider">
            Neural_Match
          </text>
          <foreignObject x="132" y="88" width="18" height="18" className="text-black/25">
            <Brain className="h-4 w-4" />
          </foreignObject>
          <text x="850" y="284" className="fill-black/25 text-[11px] font-black uppercase tracking-wider">
            Vector_Cache
          </text>
          <foreignObject x="828" y="269" width="18" height="18" className="text-black/25">
            <Database className="h-4 w-4" />
          </foreignObject>
        </motion.g>

        {paths.map((path, idx) => {
          const point = NODE_POSITIONS[idx] ?? NODE_POSITIONS[NODE_POSITIONS.length - 1]
          return (
            <motion.line
              key={`line-${path.career_id}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.15 + idx * 0.1 }}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={point.x}
              y2={point.y}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="text-black/80"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        <motion.g
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          transform={`translate(${CENTER.x} ${CENTER.y})`}
        >
          <circle r="46" className="fill-white stroke-black" strokeWidth="5" filter="url(#daedalus-node-shadow)" />
          <foreignObject x="-10" y="-22" width="20" height="20" className="text-black">
            <User className="h-5 w-5" />
          </foreignObject>
          <text x="0" y="20" textAnchor="middle" className="fill-black text-[11px] font-black uppercase tracking-tight">
            Subject
          </text>
        </motion.g>

        {paths.map((path, idx) => {
          const point = NODE_POSITIONS[idx] ?? NODE_POSITIONS[NODE_POSITIONS.length - 1]
          const isPrimary = idx === 0
          return (
            <motion.g
              key={path.career_id}
              role="button"
              tabIndex={0}
              aria-label={`Open ${path.title} analysis`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.3 + idx * 0.1, type: "spring", stiffness: 180, damping: 16 }}
              transform={`translate(${point.x} ${point.y})`}
              onClick={() => openCareer(path.career_id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") openCareer(path.career_id)
              }}
              className="cursor-pointer outline-none"
            >
              <rect x="-34" y="-34" width="68" height="68" rx="18" className="fill-white stroke-black transition-colors hover:stroke-[#1e6a8a]" strokeWidth="1.5" filter="url(#daedalus-node-shadow)" />
              <foreignObject x="-14" y="-14" width="28" height="28" className={isPrimary ? "text-amber-500" : "text-black"}>
                {isPrimary ? <Zap className="h-7 w-7" /> : <Target className="h-7 w-7" />}
              </foreignObject>
              <title>{path.title}</title>
            </motion.g>
          )
        })}

        <text x="40" y="365" className="fill-black text-[14px] font-black uppercase tracking-[0.35em]">
          Signal_Graph // 0x42
        </text>
        <text x="40" y="391" className="fill-black/65 text-[13px]">
          Visualizing path centroids and identity vectors
        </text>
      </svg>
    </div>
  )
}
