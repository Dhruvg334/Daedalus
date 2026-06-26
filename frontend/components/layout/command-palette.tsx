"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  User,
  Search,
  Zap,
  Compass,
  Target,
  Layers,
  Presentation,
  Terminal,
  LayoutDashboard,
  Activity
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Extract simulationId from pathname if present
  const simIdMatch = pathname.match(/\/(?:dashboard|career|skills|sprint|trace|comparison|simulations)\/([^\/]+)/)
  const simulationId = simIdMatch ? simIdMatch[1] : ""

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/30 hover:bg-muted/50 border rounded-md transition-all active:scale-95 group"
      >
        <Search className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
        <span className="text-xs font-bold tracking-tight">Search System...</span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or signal..." />
        <CommandList className="custom-scrollbar">
          <CommandEmpty>No signals matching input found.</CommandEmpty>
          <CommandGroup heading="System Navigation">
            {simulationId && (
              <CommandItem onSelect={() => runCommand(() => router.push(`/dashboard/${simulationId}`))}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Go to Dashboard</span>
                <CommandShortcut>G D</CommandShortcut>
              </CommandItem>
            )}
            <CommandItem onSelect={() => runCommand(() => router.push("/onboarding"))}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Initialize New Subject Simulation</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Intelligence Modules">
            {simulationId ? (
              <>
                <CommandItem onSelect={() => runCommand(() => router.push(`/career/${simulationId}`))}>
                  <Compass className="mr-2 h-4 w-4" />
                  <span>Evolution Path Analysis</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push(`/skills/${simulationId}`))}>
                  <Target className="mr-2 h-4 w-4" />
                  <span>Skill Architecture & Tree</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push(`/sprint/${simulationId}`))}>
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Execute 7-Day Sprint</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push(`/trace/${simulationId}`))}>
                  <Layers className="mr-2 h-4 w-4" />
                  <span>View Logic Trace Logs</span>
                </CommandItem>
              </>
            ) : (
              <CommandItem disabled>
                <Activity className="mr-2 h-4 w-4 opacity-50" />
                <span className="opacity-50 italic">Modules locked (Initialize kernel first)</span>
              </CommandItem>
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Demo & Orchestration">
            <CommandItem onSelect={() => runCommand(() => {
               window.dispatchEvent(new CustomEvent('toggle-presentation-mode'))
            })}>
              <Presentation className="mr-2 h-4 w-4" />
              <span>Toggle Immersive Presentation Mode</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => {
               window.dispatchEvent(new CustomEvent('toggle-judge-mode'))
            })}>
              <Terminal className="mr-2 h-4 w-4" />
              <span>Toggle Technical Judge Dashboard</span>
              <CommandShortcut>⌘J</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
