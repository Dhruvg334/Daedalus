"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Maximize2, Minimize2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import type { CareerPath, Simulation } from "@/lib/types"

interface CareerGraphProps {
  simulation: Simulation
  className?: string
}

type GraphNode = {
  id: string
  label: string
  subtitle: string
  x: number
  y: number
  r: number
  career?: CareerPath
  primary?: boolean
}

type GraphLayout = {
  subject: GraphNode
  careers: GraphNode[]
}

function useCanvasSize<T extends HTMLElement>(expanded: boolean) {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 960, height: expanded ? 640 : 380 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      setSize({
        width: Math.max(320, rect.width),
        height: Math.max(expanded ? 560 : 360, rect.height),
      })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [expanded])

  return { ref, size }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function truncate(text: string, limit: number) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (ctx.measureText(next).width <= maxWidth) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word
    }
    if (lines.length >= maxLines) break
  }

  if (current && lines.length < maxLines) lines.push(current)
  if (lines.length === maxLines && words.join(" ") !== lines.join(" ")) {
    lines[lines.length - 1] = truncate(lines[lines.length - 1], 15)
  }
  return lines
}

function buildLayout(simulation: Simulation, size: { width: number; height: number }, expanded: boolean): GraphLayout {
  const visibleCareers = simulation.career_paths.slice(0, expanded ? 5 : 3)
  const pad = expanded ? 88 : 60
  const subjectRadius = expanded ? 52 : 44
  const careerRadius = expanded ? 44 : 38

  const centerX = size.width / 2
  const centerY = expanded ? size.height * 0.52 : size.height * 0.54
  const maxHorizontal = Math.max(120, size.width / 2 - pad - careerRadius)
  const maxVertical = Math.max(100, size.height / 2 - pad - careerRadius)
  const ring = Math.min(maxHorizontal, maxVertical, expanded ? 260 : 180)

  const anglesByCount: Record<number, number[]> = {
    1: [-90],
    2: [-135, -45],
    3: [-90, -150, -30],
    4: [-100, -165, -15, 70],
    5: [-90, -160, -25, 150, 35],
  }
  const angles = anglesByCount[visibleCareers.length] || anglesByCount[3]

  const subject: GraphNode = {
    id: "subject",
    label: "YOU",
    subtitle: simulation.student_summary?.name || "Profile",
    x: centerX,
    y: centerY,
    r: subjectRadius,
  }

  const careers = visibleCareers.map((career, index) => {
    const angle = (angles[index] || -90) * (Math.PI / 180)
    const distance = ring + (index === 0 ? 14 : 0)
    const rawX = centerX + Math.cos(angle) * distance
    const rawY = centerY + Math.sin(angle) * distance
    return {
      id: career.career_id,
      label: career.title,
      subtitle: `${career.fit_score}% fit`,
      x: clamp(rawX, pad + careerRadius, size.width - pad - careerRadius),
      y: clamp(rawY, pad + careerRadius, size.height - pad - careerRadius),
      r: careerRadius,
      career,
      primary: index === 0,
    }
  })

  return { subject, careers }
}

function drawMap(canvas: HTMLCanvasElement | null, layout: GraphLayout, size: { width: number; height: number }, expanded: boolean) {
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(size.width * dpr)
  canvas.height = Math.round(size.height * dpr)
  canvas.style.width = `${size.width}px`
  canvas.style.height = `${size.height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size.width, size.height)

  const borderPad = expanded ? 46 : 34
  const gridLeft = borderPad
  const gridTop = borderPad
  const gridRight = size.width - borderPad
  const gridBottom = size.height - borderPad

  ctx.save()
  ctx.strokeStyle = "rgba(17,24,39,0.08)"
  ctx.lineWidth = 1
  const cols = expanded ? 14 : 10
  const rows = expanded ? 7 : 5
  for (let i = 0; i <= cols; i++) {
    const x = gridLeft + ((gridRight - gridLeft) * i) / cols
    ctx.beginPath()
    ctx.moveTo(x, gridTop)
    ctx.lineTo(x, gridBottom)
    ctx.stroke()
  }
  for (let i = 0; i <= rows; i++) {
    const y = gridTop + ((gridBottom - gridTop) * i) / rows
    ctx.beginPath()
    ctx.moveTo(gridLeft, y)
    ctx.lineTo(gridRight, y)
    ctx.stroke()
  }
  ctx.restore()

  for (const node of layout.careers) {
    const dx = node.x - layout.subject.x
    const dy = node.y - layout.subject.y
    const length = Math.hypot(dx, dy) || 1
    const sx = layout.subject.x + (dx / length) * (layout.subject.r + 8)
    const sy = layout.subject.y + (dy / length) * (layout.subject.r + 8)
    const ex = node.x - (dx / length) * (node.r + 8)
    const ey = node.y - (dy / length) * (node.r + 8)

    ctx.save()
    ctx.strokeStyle = node.primary ? "rgba(31,120,152,0.86)" : "rgba(17,24,39,0.38)"
    ctx.lineWidth = node.primary ? 2.5 : 1.7
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(ex, ey)
    ctx.stroke()
    ctx.restore()
  }

  const drawNode = (node: GraphNode, type: "subject" | "career") => {
    ctx.save()
    ctx.shadowColor = "rgba(15,23,42,0.15)"
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 8
    ctx.fillStyle = type === "subject" ? "#ffffff" : node.primary ? "#eef9fc" : "#fffdf8"
    ctx.strokeStyle = type === "subject" ? "#111827" : node.primary ? "#1f7898" : "#111827"
    ctx.lineWidth = type === "subject" ? 4 : 1.8
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    if (type === "subject") {
      ctx.fillStyle = "#111827"
      ctx.font = "900 13px ui-sans-serif, system-ui, -apple-system, Segoe UI"
      ctx.fillText("YOU", node.x, node.y - 5)
      ctx.font = "600 10px ui-sans-serif, system-ui"
      ctx.fillStyle = "rgba(17,24,39,0.55)"
      ctx.fillText(truncate(node.subtitle, 16), node.x, node.y + 13)
    } else {
      ctx.fillStyle = node.primary ? "#1f7898" : "rgba(17,24,39,0.62)"
      ctx.font = "900 11px ui-sans-serif, system-ui, -apple-system, Segoe UI"
      ctx.fillText(node.subtitle, node.x, node.y - 13)
      ctx.fillStyle = "#111827"
      ctx.font = "900 9px ui-sans-serif, system-ui, -apple-system, Segoe UI"
      const lines = wrapText(ctx, node.label.toUpperCase(), node.r * 1.45, expanded ? 3 : 2)
      const startY = node.y + 7 - ((lines.length - 1) * 10) / 2
      lines.forEach((line, index) => ctx.fillText(line, node.x, startY + index * 10))
    }
    ctx.restore()
  }

  drawNode(layout.subject, "subject")
  layout.careers.forEach((node) => drawNode(node, "career"))

  ctx.save()
  ctx.fillStyle = "rgba(17,24,39,0.34)"
  ctx.font = "900 11px ui-sans-serif, system-ui"
  ctx.fillText("NEURAL_MATCH", gridLeft + 24, gridTop + 36)
  ctx.fillText("VECTOR_CACHE", gridRight - 160, gridTop + 54)
  ctx.fillStyle = "#000"
  ctx.font = "900 16px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillText("SIGNAL_GRAPH // 0x42", gridLeft + 22, gridBottom - 52)
  ctx.fillStyle = "rgba(0,0,0,0.58)"
  ctx.font = "500 13px ui-sans-serif, system-ui"
  ctx.fillText("Career paths mapped from profile signals", gridLeft + 22, gridBottom - 28)
  ctx.restore()
}

function GraphCanvas({ simulation, expanded = false }: { simulation: Simulation; expanded?: boolean }) {
  const router = useRouter()
  const { ref, size } = useCanvasSize<HTMLDivElement>(expanded)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const layout = useMemo(() => buildLayout(simulation, size, expanded), [simulation, size, expanded])

  useEffect(() => {
    drawMap(canvasRef.current, layout, size, expanded)
  }, [layout, size, expanded])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    for (const node of layout.careers) {
      if (Math.hypot(x - node.x, y - node.y) <= node.r + 12) {
        router.push(`/career/${simulation.simulation_id}/${node.career?.career_id}`)
        return
      }
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-[1.75rem] border border-black/80 bg-white",
        expanded ? "h-[min(76vh,720px)]" : "h-[380px] md:h-[420px]",
      )}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="absolute inset-0 h-full w-full cursor-pointer"
        aria-label="Interactive career map"
      />
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
