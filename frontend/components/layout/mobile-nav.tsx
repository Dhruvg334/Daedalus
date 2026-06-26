"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { getSimulation } from "@/lib/simulation-store"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [recommendedPathId, setRecommendedPathId] = useState<string | null>(null)

  // Extract simulationId from pathname
  const simIdMatch = pathname.match(/\/(?:dashboard|career|skills|sprint|trace|comparison|simulations)\/([^\/]+)/)
  const simulationId = simIdMatch ? simIdMatch[1] : ""

  useEffect(() => {
    if (simulationId) {
      const sim = getSimulation(simulationId)
      if (sim) {
        setRecommendedPathId(sim.comparison.recommended_path_id)
      }
    }
  }, [simulationId])

  const menuItems = [
    { name: "Overview", href: `/dashboard/${simulationId}`, activeCheck: "/dashboard" },
    { name: "Evolution Paths", href: recommendedPathId ? `/career/${simulationId}/${recommendedPathId}` : `/career/${simulationId}`, activeCheck: "/career" },
    { name: "Intelligence Matrix", href: `/comparison/${simulationId}`, activeCheck: "/comparison" },
    { name: "Skill Architecture", href: `/skills/${simulationId}`, activeCheck: "/skills" },
    { name: "Execution Sprint", href: `/sprint/${simulationId}`, activeCheck: "/sprint" },
    { name: "System Trace", href: `/trace/${simulationId}`, activeCheck: "/trace" },
  ]

  return (
    <div className="md:hidden">
      <header className="h-16 border-b glass flex items-center justify-between px-6 fixed top-0 w-full z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded flex items-center justify-center shadow-premium">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Daedalus</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[300px] bg-card border-l z-[70] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-black uppercase tracking-widest text-xs text-muted-foreground">System_Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <nav className="space-y-2 flex-1">
                {simulationId ? (
                  menuItems.map((item) => {
                    const isActive = pathname.includes(item.activeCheck)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl transition-all border",
                          isActive
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-transparent hover:bg-accent"
                        )}
                      >
                        <span className="font-bold text-sm">{item.name}</span>
                        <ChevronRight className={cn("w-4 h-4", isActive ? "opacity-100" : "opacity-40")} />
                      </Link>
                    )
                  })
                ) : (
                  <div className="p-6 rounded-2xl bg-muted/20 border border-dashed text-center space-y-4">
                    <p className="text-xs text-muted-foreground font-medium italic">No active simulation detected in kernel memory.</p>
                    <Button className="w-full" asChild onClick={() => setOpen(false)}>
                      <Link href="/onboarding">Start Simulation</Link>
                    </Button>
                  </div>
                )}
              </nav>

              <div className="pt-6 border-t space-y-4">
                <Button variant="premium" className="w-full justify-between group h-12">
                  Upgrade to Pro OS
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </Button>
                <p className="text-[8px] font-mono text-center text-muted-foreground uppercase tracking-widest">
                  Daedalus_OS // Build_0x92F
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
