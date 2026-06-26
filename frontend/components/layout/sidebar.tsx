"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Compass,
  Zap,
  Target,
  Layers,
  Settings,
  HelpCircle,
  ChevronRight,
  Sparkles,
  GitBranch,
  BarChart3,
  Bookmark,
  Clock,
  Activity,
  Briefcase,
  GraduationCap,
  MessageSquare
} from "lucide-react"
import { getBookmarks, getRecentViews, getSimulation } from "@/lib/simulation-store"

export function Sidebar() {
  const pathname = usePathname()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const [recommendedPathId, setRecommendedPathId] = useState<string | null>(null)

  // Extract simulationId from pathname
  const simIdMatch = pathname.match(/\/(?:dashboard|career|skills|sprint|trace|comparison|simulations|opportunities|learning)\/([^\/]+)/)
  const simulationId = simIdMatch ? simIdMatch[1] : ""

  useEffect(() => {
    setBookmarks(getBookmarks())
    setRecent(getRecentViews())

    if (simulationId) {
      const sim = getSimulation(simulationId)
      if (sim) {
        setRecommendedPathId(sim.comparison.recommended_path_id)
      }
    }
  }, [pathname, simulationId])

  const sidebarItems = [
    { name: "Overview", href: `/dashboard/${simulationId}`, icon: LayoutDashboard, activeCheck: "/dashboard" },
    { name: "Evolution Paths", href: recommendedPathId ? `/career/${simulationId}/${recommendedPathId}` : `/career/${simulationId}`, icon: Compass, activeCheck: "/career" },
    { name: "Intelligence Matrix", href: `/comparison/${simulationId}`, icon: BarChart3, activeCheck: "/comparison" },
    { name: "Opportunity Hub", href: `/opportunities/${simulationId}`, icon: Briefcase, activeCheck: "/opportunities" },
    { name: "Learning Ecosystem", href: `/learning/${simulationId}`, icon: GraduationCap, activeCheck: "/learning" },
    { name: "Skill Architecture", href: `/skills/${simulationId}`, icon: Target, activeCheck: "/skills" },
    { name: "Execution Sprint", href: `/sprint/${simulationId}`, icon: Zap, activeCheck: "/sprint" },
  ]

  return (
    <aside className="flex flex-col w-64 border-r bg-card/30 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto custom-scrollbar no-print">
      <div className="p-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-premium group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">Daedalus</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {simulationId ? (
          sidebarItems.map((item) => {
            const isActive = pathname.includes(item.activeCheck)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
                {isActive && <ChevronRight className="ml-auto w-4 h-4 animate-in slide-in-from-left-2" />}
              </Link>
            )
          })
        ) : (
          <div className="px-3 py-4 rounded-xl bg-muted/20 border border-dashed border-border text-center">
            <Activity className="w-5 h-5 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">No Active Kernel</p>
            <Link href="/onboarding" className="text-[10px] text-primary hover:underline font-bold">Initialize System →</Link>
          </div>
        )}

        {/* Dynamic Sections */}
        {bookmarks.length > 0 && (
          <div className="pt-6 pb-2">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
              <Bookmark className="w-3 h-3" /> Bookmarks
            </p>
            {bookmarks.map(b => (
              <Link
                key={b.id}
                href={`/dashboard/${b.id}`}
                className={cn(
                  "flex items-center px-3 py-1.5 text-xs rounded-md transition-colors truncate",
                  simulationId === b.id ? "text-primary font-bold bg-primary/5" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {b.name}
              </Link>
            ))}
          </div>
        )}

        {recent.length > 0 && (
          <div className="pt-4">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Recent
            </p>
            {recent.map(r => (
              <Link
                key={r.id}
                href={`/dashboard/${r.id}`}
                className={cn(
                  "flex items-center px-3 py-1.5 text-xs rounded-md transition-colors truncate",
                  simulationId === r.id ? "text-primary font-bold bg-primary/5" : "text-muted-foreground/60 hover:text-foreground"
                )}
              >
                {r.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t space-y-4">
        {simulationId && (
          <div className="px-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Intelligence Hub</p>
            <div className="space-y-1">
              <Link
                href={`/simulations/${simulationId}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                  pathname.startsWith("/simulations") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <GitBranch className="w-4 h-4" />
                Decision Lab
              </Link>
              <Link
                href={`/trace/${simulationId}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                  pathname.startsWith("/trace") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Layers className="w-4 h-4" />
                System Trace
              </Link>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 group cursor-pointer overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative z-10">
            <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Pro Intelligence</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Unlock 'What-if' scenarios and dynamic risk modelling.</p>
            <button className="mt-3 w-full py-2 bg-foreground text-background text-[10px] font-bold rounded-lg hover:opacity-90 transition-opacity">
              Upgrade OS
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
