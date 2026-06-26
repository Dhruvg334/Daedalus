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
      "flex min-h-screen bg-background text-foreground overflow-hidden transition-all duration-700 ease-[0.22,1,0.36,1]",
      presentationMode && "scale-[0.98] rounded-[2.5rem] border-[12px] border-primary/20 shadow-[0_0_100px_rgba(0,0,0,0.5)] my-4 mx-4 h-[calc(100vh-2rem)]"
    )}>
      {/* Interactive Guided Tour */}
      <GuidedTour />

      {/* Desktop Sidebar */}
      {!presentationMode && (
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <MobileNav />

        {/* System Header */}
        <header className={cn(
          "hidden md:flex h-16 border-b glass items-center justify-between px-8 z-10 sticky top-0 transition-opacity",
          presentationMode && "opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                Kernel_Live // 0x92F
              </span>
            </div>
            <CommandPalette />
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
              <NavBreadcrumb label="Home" active={pathname === "/"} href="/" />
              <div className="text-muted-foreground/20 mx-1">/</div>
              <NavBreadcrumb label="OS" active={pathname.includes("/dashboard")} href={simulationId ? `/dashboard/${simulationId}` : "/onboarding"} />
            </nav>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-[10px] font-bold text-primary">PI</span>
              </div>
            </div>
          </div>
        </header>

        {/* High-Speed Page Transition Wrapper */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-16 md:pt-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              className={cn(
                "p-6 md:p-10 max-w-7xl mx-auto w-full min-h-full",
                presentationMode && "max-w-5xl pt-20",
                className
              )}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global AI Assistant */}
        <AssistantDrawer simulationId={simulationId} />
      </main>
    </div>
  )
}

function NavBreadcrumb({ label, active, href }: { label: string, active: boolean, href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter transition-all",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Link>
  )
}

import Link from "next/link"
