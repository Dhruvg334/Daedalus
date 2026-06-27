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

type DrawNode = {
  id: string
  label: string
  subtitle: string
  x: number
  y: number
  radius: number
  career?: CareerPath
  primary?: boolean
}

type DrawLayout = {
  subject: DrawNode
  careers: DrawNode[]
}

const DESIGN_WIDTH = 1200
const DESIGN_HEIGHT = 520
const CENTER = { x: DESIGN_WIDTH / 2, y: 275 }

function useMeasuredSize<T extends HTMLElement>(expanded: boolean) {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: DESIGN_WIDTH, height: DESIGN_HEIGHT })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const rect = element.getBoundingClientRect()
      setSize({
        width: Math.max(360, rect.width),
        height: Math.max(expanded ? 520 : 360, rect.height),
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [expanded])

  return { ref, size }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function makeLayout(simulation: Simulation, expanded: boolean): DrawLayout {
  const careers = simulation.career_paths.slice(0, expanded ? 5 : 3)
  const subject: DrawNode = {
    id: "subject",
    label: "YOU",
    subtitle: simulation.student_summary?.name || "Profile",
    x: CENTER.x,
    y: CENTER.y,
    radius: expanded ? 54 : 48,
  }

  const angleSets: Record<number, number[]> = {
    1: [-90],
    2: [-135, -45],
    3: [-90, -158, -22],
    4: [-100, -170, -10, 80],
    5: [-90, -165, -25, 150, 30],
  }
  const angles = angleSets[careers.length] || angleSets[3]
  const baseRadius = expanded ? 245 : 205

  const careerNodes = careers.map((career, index) => {
    const angle = (angles[index] ?? -90) * (Math.PI / 180)
    const fitPull = (100 - clamp(career.fit_score || 70, 45, 100)) * 0.9
    const radius = baseRadius + fitPull
    return {
      id: career.career_id,
      label: career.title,
      subtitle: `${career.fit_score}% fit`,
      x: CENTER.x + Math.cos(angle) * radius,
      y: CENTER.y + Math.sin(angle) * radius,
      radius: expanded ? 46 : 42,
      career,
      primary: index === 0,
    }
  })

  return { subject, careers: careerNodes }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 2) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ""

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width <= maxWidth) {
      line = test
    } else {
      if (line) lines.push(line)
      line = word
    }
    if (lines.length === maxLines) break
  }
  if (line && lines.length < maxLines) lines.push(line)
  if (words.length > 0 && lines.length === maxLines && words.join(" ") !== lines.join(" ")) {
    const last = lines[lines.length - 1]
    lines[lines.length - 1] = last.length > 14 ? `${last.slice(0, 13)}…` : `${last}…`
  }
  return lines
}

function drawCareerMap(
  canvas: HTMLCanvasElement | null,
  layout: DrawLayout,
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

  const scale = Math.min(size.width / DESIGN_WIDTH, size.height / DESIGN_HEIGHT)
  const offsetX = (size.width - DESIGN_WIDTH * scale) / 2
  const offsetY = (size.height - DESIGN_HEIGHT * scale) / 2
  const tx = (x: number) => offsetX + x * scale
  const ty = (y: number) => offsetY + y * scale
  const tr = (r: number) => r * scale

  // background grid
  ctx.save()
  ctx.globalAlpha = 0.09
  ctx.strokeStyle = "#111827"
  ctx.lineWidth = 1
  const grid = 70 * scale
  for (let x = offsetX; x <= offsetX + DESIGN_WIDTH * scale + 1; x += grid) {
    ctx.beginPath()
    ctx.moveTo(x, offsetY)
    ctx.lineTo(x, offsetY + DESIGN_HEIGHT * scale)
    ctx.stroke()
  }
  for (let y = offsetY; y <= offsetY + DESIGN_HEIGHT * scale + 1; y += grid) {
    ctx.beginPath()
    ctx.moveTo(offsetX, y)
    ctx.lineTo(offsetX + DESIGN_WIDTH * scale, y)
    ctx.stroke()
  }
  ctx.restore()

  // links
  for (const node of layout.careers) {
    const sx = tx(layout.subject.x)
    const sy = ty(layout.subject.y)
    const ex = tx(node.x)
    const ey = ty(node.y)
    const dx = ex - sx
    const dy = ey - sy
    const length = Math.hypot(dx, dy) || 1
    const startX = sx + (dx / length) * tr(layout.subject.radius + 4)
    const startY = sy + (dy / length) * tr(layout.subject.radius + 4)
    const endX = ex - (dx / length) * tr(node.radius + 5)
    const endY = ey - (dy / length) * tr(node.radius + 5)

    ctx.save()
    ctx.strokeStyle = node.primary ? "#1f7898" : "#111827"
    ctx.globalAlpha = node.primary ? 0.8 : 0.42
    ctx.lineWidth = node.primary ? 2.4 : 1.8
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.restore()
  }

  const drawNode = (node: DrawNode, kind: "subject" | "career") => {
    const x = tx(node.x)
    const y = ty(node.y)
    const r = tr(node.radius)

    ctx.save()
    ctx.shadowColor = "rgba(15, 23, 42, 0.16)"
    ctx.shadowBlur = 18 * scale
    ctx.shadowOffsetY = 8 * scale
    ctx.fillStyle = kind === "subject" ? "#ffffff" : node.primary ? "#edf8fc" : "#fffdf8"
    ctx.strokeStyle = kind === "subject" ? "#111827" : node.primary ? "#1f7898" : "#111827"
    ctx.lineWidth = kind === "subject" ? Math.max(3, 4 * scale) : Math.max(1.4, 1.7 * scale)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = kind === "subject" ? "#111827" : node.primary ? "#1f7898" : "#111827"
    ctx.font = `900 ${Math.max(10, 12 * scale)}px ui-sans-serif, system-ui, -apple-system, Segoe UI`
    if (kind === "subject") {
      ctx.fillText("YOU", x, y - 4 * scale)
      ctx.font = `600 ${Math.max(8, 9 * scale)}px ui-sans-serif, system-ui`
      ctx.fillStyle = "rgba(17,24,39,0.55)"
      ctx.fillText(node.subtitle.slice(0, 16), x, y + 12 * scale)
    } else {
      ctx.fillText(node.subtitle, x, y - 11 * scale)
      ctx.font = `900 ${Math.max(8, 9 * scale)}px ui-sans-serif, system-ui, -apple-system, Segoe UI`
      ctx.fillStyle = "#111827"
      const lines = wrapText(ctx, node.label.toUpperCase(), r * 1.42, expanded ? 3 : 2)
      const lineHeight = 10 * scale
      const start = y + 7 * scale - ((lines.length - 1) * lineHeight) / 2
      lines.forEach((line, index) => ctx.fillText(line, x, start + index * lineHeight))
    }
    ctx.restore()
  }

  drawNode(layout.subject, "subject")
  layout.careers.forEach((node) => drawNode(node, "career"))

  ctx.save()
  ctx.fillStyle = "rgba(17, 24, 39, 0.32)"
  ctx.font = `900 ${Math.max(10, 12 * scale)}px ui-sans-serif, system-ui`
  ctx.fillText("NEURAL MATCH", tx(78), ty(82))
  ctx.fillText("VECTOR CACHE", tx(940), ty(355))
  ctx.fillStyle = "#000"
  ctx.font = `900 ${Math.max(13, 18 * scale)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.fillText("SIGNAL_GRAPH // 0x42", tx(70), ty(455))
  ctx.fillStyle = "rgba(0,0,0,0.62)"
  ctx.font = `500 ${Math.max(10, 14 * scale)}px ui-sans-serif, system-ui`
  ctx.fillText("Career path centroids generated from profile signals", tx(70), ty(482))
  ctx.restore()
}

function GraphCanvas({ simulation, expanded = false }: { simulation: Simulation; expanded?: boolean }) {
  const router = useRouter()
  const layout = useMemo(() => makeLayout(simulation, expanded), [simulation, expanded])
  const { ref, size } = useMeasuredSize<HTMLDivElement>(expanded)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    drawCareerMap(canvasRef.current, layout, size, expanded)
  }, [layout, size, expanded])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top
    const scale = Math.min(size.width / DESIGN_WIDTH, size.height / DESIGN_HEIGHT)
    const offsetX = (size.width - DESIGN_WIDTH * scale) / 2
    const offsetY = (size.height - DESIGN_HEIGHT * scale) / 2
    const toScreen = (node: DrawNode) => ({
      x: offsetX + node.x * scale,
      y: offsetY + node.y * scale,
      r: node.radius * scale,
    })

    for (const node of layout.careers) {
      const p = toScreen(node)
      if (Math.hypot(px - p.x, py - p.y) <= p.r + 10) {
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
        expanded ? "h-[min(78vh,760px)]" : "h-[430px]"
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
