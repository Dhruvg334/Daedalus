"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Compass, Zap, Target,
  ChevronRight, Sparkles, GitBranch, BarChart3,
  Bookmark, Clock, Briefcase, GraduationCap, Layers
} from "lucide-react"
import { getBookmarks, getRecentViews, getSimulation } from "@/lib/simulation-store"

export function Sidebar() {
  const pathname = usePathname()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const [recommendedPathId, setRecommendedPathId] = useState<string | null>(null)

  const simIdMatch = pathname.match(/\/(?:dashboard|career|skills|sprint|trace|comparison|simulations|opportunities|learning)\/([^\/]+)/)
  const simulationId = simIdMatch ? simIdMatch[1] : ""

  useEffect(() => {
    setBookmarks(getBookmarks())
    setRecent(getRecentViews())
    if (simulationId) {
      const sim = getSimulation(simulationId)
      if (sim) setRecommendedPathId(sim.comparison.recommended_path_id)
    }
  }, [pathname, simulationId])

  const navItems = [
    { name: "Overview", href: `/dashboard/${simulationId}`, icon: LayoutDashboard, check: "/dashboard" },
    { name: "Career Paths", href: recommendedPathId ? `/career/${simulationId}/${recommendedPathId}` : `/career/${simulationId}`, icon: Compass, check: "/career" },
    { name: "Comparison", href: `/comparison/${simulationId}`, icon: BarChart3, check: "/comparison" },
    { name: "Opportunities", href: `/opportunities/${simulationId}`, icon: Briefcase, check: "/opportunities" },
    { name: "Learning", href: `/learning/${simulationId}`, icon: GraduationCap, check: "/learning" },
    { name: "Skills", href: `/skills/${simulationId}`, icon: Target, check: "/skills" },
    { name: "Sprint", href: `/sprint/${simulationId}`, icon: Zap, check: "/sprint" },
  ]

  return (
    <aside className="flex flex-col w-60 border-r border-border/60 bg-white dark:bg-card h-screen sticky top-0 overflow-y-auto custom-scrollbar no-print">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-[#7BBAD4] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">Daedalus</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {simulationId ? navItems.map(item => {
          const active = pathname.includes(item.check)
          return (
            <Link key={item.name} href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-[#7BBAD4]/12 text-[#1e6a8a] dark:text-[#7BBAD4]"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
              )}>
              <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-[#7BBAD4]" : "text-neutral-400")} />
              {item.name}
              {active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-[#7BBAD4]" />}
            </Link>
          )
        }) : (
          <div className="px-3 py-4 rounded-xl border border-dashed border-border text-center mx-1">
            <p className="text-xs text-neutral-400 mb-2">No simulation yet</p>
            <Link href="/onboarding" className="text-xs font-semibold text-[#1e6a8a] hover:underline">Start one →</Link>
          </div>
        )}

        {/* Divider + extras */}
        {simulationId && (
          <div className="pt-4 mt-2 border-t border-border/40">
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tools</p>
            {[
              { href: `/simulations/${simulationId}`, label: "Decision Lab", icon: GitBranch, check: "/simulations" },
              { href: `/trace/${simulationId}`, label: "System Trace", icon: Layers, check: "/trace" },
            ].map(item => {
              const active = pathname.startsWith(item.check)
              return (
                <Link key={item.href} href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    active ? "bg-[#7BBAD4]/12 text-[#1e6a8a]" : "text-neutral-500 hover:bg-neutral-100 hover:text-black"
                  )}>
                  <item.icon className={cn("w-4 h-4", active ? "text-[#7BBAD4]" : "text-neutral-400")} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <div className="pt-4 mt-2 border-t border-border/40">
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Bookmark className="w-3 h-3" /> Saved
            </p>
            {bookmarks.map(b => (
              <Link key={b.id} href={`/dashboard/${b.id}`}
                className={cn("flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors truncate font-medium",
                  simulationId === b.id ? "text-[#1e6a8a] bg-[#7BBAD4]/8" : "text-neutral-500 hover:text-black hover:bg-neutral-50")}>
                {b.name}
              </Link>
            ))}
          </div>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <div className="pt-3">
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Recent
            </p>
            {recent.map(r => (
              <Link key={r.id} href={`/dashboard/${r.id}`}
                className={cn("flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors truncate",
                  simulationId === r.id ? "text-[#1e6a8a] font-semibold" : "text-neutral-400 hover:text-black hover:bg-neutral-50")}>
                {r.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom CTA */}
      <div className="px-4 pb-5 pt-3 border-t border-border/40">
        <div className="p-4 rounded-xl bg-[#7BBAD4]/10 border border-[#7BBAD4]/25">
          <p className="text-xs font-semibold text-[#1e6a8a] mb-1">Upgrade to Pro</p>
          <p className="text-[11px] text-neutral-500 leading-snug mb-3">What-if scenarios and dynamic risk modelling.</p>
          <button className="w-full py-2 bg-black text-white text-[11px] font-bold rounded-lg hover:bg-neutral-800 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  )
}
