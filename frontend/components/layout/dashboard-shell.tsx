"use client"

import React from "react"
import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { CommandPalette } from "./command-palette"
import { ThemeToggle } from "./theme-toggle"
import { AssistantDrawer } from "@/components/intelligence/assistant-drawer"
import { GuidedTour } from "./guided-tour"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useHackathon } from "./hackathon-modes"
import { usePathname, useParams } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const { presentationMode } = useHackathon()
  const pathname = usePathname()
  const params = useParams()
  const simulationId = params?.simulationId as string

  return (
    <div className={cn(
      "flex min-h-screen bg-background text-foreground overflow-hidden transition-all duration-500",
      presentationMode && "scale-[0.98] rounded-[2rem] border-8 border-[#7BBAD4]/20 shadow-2xl my-4 mx-4 h-[calc(100vh-2rem)]"
    )}>
      <GuidedTour />

      {/* Desktop sidebar */}
      {!presentationMode && (
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <MobileNav />

        {/* Top bar */}
        <header className={cn(
          "hidden md:flex h-14 border-b border-border/50 items-center justify-between px-6 z-10 sticky top-0 bg-background/90 backdrop-blur-md transition-opacity",
          presentationMode && "opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-neutral-400">Live</span>
            </div>
            <CommandPalette />
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 bg-neutral-100 dark:bg-white/5 p-1 rounded-lg">
              <BreadcrumbLink label="Home" active={pathname === "/"} href="/" />
              <span className="text-neutral-300 text-xs">/</span>
              <BreadcrumbLink label="Dashboard" active={pathname.includes("/dashboard")}
                href={simulationId ? `/dashboard/${simulationId}` : "/onboarding"} />
            </nav>
            <div className="h-4 w-px bg-border" />
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-[#7BBAD4]/15 flex items-center justify-center border border-[#7BBAD4]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#1e6a8a]" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide pt-14 md:pt-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
              className={cn("p-5 md:p-8 max-w-7xl mx-auto w-full min-h-full", className)}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <AssistantDrawer simulationId={simulationId} />
      </main>
    </div>
  )
}

function BreadcrumbLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link href={href}
      className={cn(
        "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
        active ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm" : "text-neutral-500 hover:text-black dark:hover:text-white"
      )}>
      {label}
    </Link>
  )
}
