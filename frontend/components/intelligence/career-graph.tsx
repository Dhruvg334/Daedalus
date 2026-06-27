"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Brain, Database, Maximize2, Minimize2, Target, User, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import type { CareerPath, Simulation } from "@/lib/types"

interface CareerGraphProps {
  simulation: Simulation
  className?: string
}

type NodeKind = "subject" | "career"

type GraphNode = {
  id: string
  label: string
  subLabel?: string
  kind: NodeKind
  x: number
  y: number
  path?: CareerPath
  primary?: boolean
}

type GraphLayout = {
  nodes: GraphNode[]
  links: Array<{ from: GraphNode; to: GraphNode }>
}

const BASE_WIDTH = 1000
const BASE_HEIGHT = 460
const CENTER = { x: BASE_WIDTH / 2, y: 235 }

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function makeLayout(simulation: Simulation): GraphLayout {
  const paths = simulation.career_paths.slice(0, 5)
  const subject: GraphNode = {
    id: "subject",
    label: simulation.student_summary?.name || "Subject",
    subLabel: "Profile vector",
    kind: "subject",
    x: CENTER.x,
    y: CENTER.y,
  }

  // Deterministic radial layout. All lines and overlay nodes use the same math,
  // so there is no SVG/CSS drift and no manual pixel guessing.
  const angles = paths.length <= 3
    ? [-90, 150, 30]
    : [-90, -165, -15, 150, 30]

  const nodes = paths.map((path, index): GraphNode => {
    const angle = (angles[index] ?? (-90 + index * 72)) * (Math.PI / 180)
    const fit = clamp(path.fit_score || 70, 55, 100)
    const radius = 132 + ((100 - fit) * 1.4)
    return {
      id: path.career_id,
      label: path.title,
      subLabel: `${path.fit_score}% fit`,
      kind: "career",
      x: CENTER.x + Math.cos(angle) * radius,
      y: CENTER.y + Math.sin(angle) * radius,
      path,
      primary: index === 0,
    }
  })

  return {
    nodes: [subject, ...nodes],
    links: nodes.map((node) => ({ from: subject, to: node })),
  }
}

function useCanvasSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: BASE_WIDTH, height: BASE_HEIGHT })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const rect = element.getBoundingClientRect()
      setSize({
        width: Math.max(320, rect.width),
        height: Math.max(300, rect.height),
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, size }
}

function drawGraph(
  canvas: HTMLCanvasElement | null,
  layout: GraphLayout,
  size: { width: number; height: number },
  expanded: boolean,
) {
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.floor(size.width * dpr)
  canvas.height = Math.floor(size.height * dpr)
  canvas.style.width = `${size.width}px`
  canvas.style.height = `${size.height}px`

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size.width, size.height)

  const scale = Math.min(size.width / BASE_WIDTH, size.height / BASE_HEIGHT)
  const offsetX = (size.width - BASE_WIDTH * scale) / 2
  const offsetY = (size.height - BASE_HEIGHT * scale) / 2
  const tx = (x: number) => offsetX + x * scale
  const ty = (y: number) => offsetY + y * scale

  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  // Subtle measurement grid, visible enough to make the map feel intentional.
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.strokeStyle = "#1f2937"
  ctx.lineWidth = 1
  const grid = 56 * scale
  for (let x = offsetX; x <= offsetX + BASE_WIDTH * scale; x += grid) {
    ctx.beginPath()
    ctx.moveTo(x, offsetY)
    ctx.lineTo(x, offsetY + BASE_HEIGHT * scale)
    ctx.stroke()
  }
  for (let y = offsetY; y <= offsetY + BASE_HEIGHT * scale; y += grid) {
    ctx.beginPath()
    ctx.moveTo(offsetX, y)
    ctx.lineTo(offsetX + BASE_WIDTH * scale, y)
    ctx.stroke()
  }
  ctx.restore()

  // Links.
  layout.links.forEach((link, index) => {
    const fromX = tx(link.from.x)
    const fromY = ty(link.from.y)
    const toX = tx(link.to.x)
    const toY = ty(link.to.y)
    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2

    ctx.save()
    ctx.strokeStyle = index === 0 ? "#1e6a8a" : "#111827"
    ctx.globalAlpha = index === 0 ? 0.78 : 0.56
    ctx.lineWidth = index === 0 ? 2.5 : 2
    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.quadraticCurveTo(midX, midY - 18 * scale, toX, toY)
    ctx.stroke()
    ctx.restore()
  })

  // Nodes.
  layout.nodes.forEach((node) => {
    const x = tx(node.x)
    const y = ty(node.y)
    const r = node.kind === "subject" ? 44 * scale : 34 * scale

    ctx.save()
    ctx.shadowColor = "rgba(15, 23, 42, 0.14)"
    ctx.shadowBlur = 18 * scale
    ctx.shadowOffsetY = 8 * scale
    ctx.fillStyle = node.primary ? "#eef8fb" : "#ffffff"
    ctx.strokeStyle = node.kind === "subject" ? "#111827" : node.primary ? "#1e6a8a" : "#111827"
    ctx.lineWidth = node.kind === "subject" ? 4 * scale : 1.6 * scale
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.fillStyle = node.primary ? "#1e6a8a" : "#111827"
    ctx.font = `${node.kind === "subject" ? 12 : 11}px ui-sans-serif, system-ui, -apple-system, Segoe UI`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(node.kind === "subject" ? "YOU" : `${node.path?.fit_score ?? ""}%`, x, y)
    ctx.restore()
  })

  // Panel labels.
  ctx.save()
  ctx.fillStyle = "rgba(17, 24, 39, 0.32)"
  ctx.font = `700 ${expanded ? 12 : 11}px ui-sans-serif, system-ui, -apple-system, Segoe UI`
  ctx.fillText("NEURAL MATCH", tx(135), ty(95))
  ctx.fillText("VECTOR CACHE", tx(805), ty(292))
  ctx.restore()
}

function useGraphDrawing(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  layout: GraphLayout,
  size: { width: number; height: number },
  expanded: boolean,
) {
  useEffect(() => {
    drawGraph(canvasRef.current, layout, size, expanded)
  }, [canvasRef, layout, size, expanded])
}

function GraphCanvas({
  simulation,
  expanded = false,
}: {
  simulation: Simulation
  expanded?: boolean
}) {
  const router = useRouter()
  const layout = useMemo(() => makeLayout(simulation), [simulation])
  const { ref, size } = useCanvasSize<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useGraphDrawing(canvasRef, layout, size, expanded)

  const scale = Math.min(size.width / BASE_WIDTH, size.height / BASE_HEIGHT)
  const offsetX = (size.width - BASE_WIDTH * scale) / 2
  const offsetY = (size.height - BASE_HEIGHT * scale) / 2
  const project = (x: number, y: number) => ({
    left: offsetX + x * scale,
    top: offsetY + y * scale,
  })

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-[1.75rem] border border-black/80 bg-white",
        expanded ? "h-[min(78vh,760px)]" : "h-[430px]"
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Interactive career map" />

      <div className="pointer-events-none absolute left-10 top-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-black/35">
        <Brain className="h-4 w-4" /> Neural_Match
      </div>
      <div className="pointer-events-none absolute right-10 top-1/2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/35">
        <Database className="h-4 w-4" /> Vector_Cache
      </div>

      {layout.nodes.map((node) => {
        const point = project(node.x, node.y)
        const isSubject = node.kind === "subject"
        const sizeClass = isSubject ? "h-20 w-20" : "h-16 w-16"
        return (
          <motion.button
            key={node.id}
            type="button"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={node.kind === "career" ? { scale: 1.06 } : undefined}
            transition={{ type: "spring", stiffness: 210, damping: 18 }}
            disabled={isSubject}
            onClick={() => node.path && router.push(`/career/${simulation.simulation_id}/${node.path.career_id}`)}
            className={cn(
              "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] transition",
              sizeClass,
              isSubject ? "cursor-default border-black" : "cursor-pointer border-black/80 hover:border-[#1e6a8a] hover:bg-[#eef8fb]",
              node.primary && "border-[#1e6a8a] bg-[#eef8fb]"
            )}
            style={{ left: point.left, top: point.top }}
            aria-label={isSubject ? "Student profile node" : `Open ${node.label}`}
          >
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
              {isSubject ? (
                <User className="h-5 w-5 text-black" />
              ) : node.primary ? (
                <Zap className="h-5 w-5 text-[#1e6a8a]" />
              ) : (
                <Target className="h-5 w-5 text-black" />
              )}
              <span className="line-clamp-2 max-w-[96px] text-[10px] font-black uppercase leading-tight tracking-tight text-black">
                {isSubject ? "Subject" : node.label}
              </span>
            </span>
          </motion.button>
        )
      })}

      <div className="pointer-events-none absolute bottom-8 left-10">
        <p className="text-[14px] font-black uppercase tracking-[0.36em] text-black">Signal_Graph // 0x42</p>
        <p className="mt-2 text-sm text-black/65">Visualizing path centroids and identity vectors</p>
      </div>
    </div>
  )
}

export function CareerGraph({ simulation, className }: CareerGraphProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-black shadow-sm backdrop-blur transition hover:border-black hover:bg-white"
          aria-label="Expand career map"
        >
          <Maximize2 className="h-3.5 w-3.5" /> Expand
        </button>
        <GraphCanvas simulation={simulation} />
      </div>

      {expanded && (
        <div className="fixed inset-0 z-[100] bg-black/50 p-4 backdrop-blur-sm md:p-8" role="dialog" aria-modal="true">
          <div className="mx-auto flex h-full max-w-7xl flex-col rounded-[2rem] border border-black/20 bg-[#fbfaf7] p-4 shadow-2xl md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-black/45">Interactive career map</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-black">Career path graph</h2>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="inline-flex items-center gap-2 rounded-full border border-black bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-black hover:text-white"
              >
                <Minimize2 className="h-4 w-4" /> Close
              </button>
            </div>
            <GraphCanvas simulation={simulation} expanded />
          </div>
        </div>
      )}
    </>
  )
}
