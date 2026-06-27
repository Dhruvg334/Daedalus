"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Presentation, Activity, Code2, Clock, Cpu, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JudgePanel } from "./judge-panel"
import { getSimulation } from "@/lib/simulation-store"
import { useParams } from "next/navigation"

interface PresentationToolsContextType {
  presentationMode: boolean
  judgeMode: boolean
  togglePresentation: () => void
  toggleJudge: () => void
}

const PresentationToolsContext = createContext<PresentationToolsContextType | undefined>(undefined)

export function PresentationToolsProvider({ children }: { children: React.ReactNode }) {
  const [presentationMode, setPresentationMode] = useState(false)
  const [judgeMode, setJudgeMode] = useState(false)
  const params = useParams()
  const simulationId = params?.simulationId as string
  const simulation = getSimulation(simulationId)

  useEffect(() => {
    const handleToggleP = () => setPresentationMode(prev => !prev)
    const handleToggleJ = () => setJudgeMode(prev => !prev)

    window.addEventListener('toggle-presentation-mode', handleToggleP)
    window.addEventListener('toggle-judge-mode', handleToggleJ)

    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPresentationMode(prev => !prev)
      }
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setJudgeMode(prev => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => {
      window.removeEventListener('toggle-presentation-mode', handleToggleP)
      window.removeEventListener('toggle-judge-mode', handleToggleJ)
      document.removeEventListener("keydown", down)
    }
  }, [])

  return (
    <PresentationToolsContext.Provider value={{
      presentationMode,
      judgeMode,
      togglePresentation: () => setPresentationMode(!presentationMode),
      toggleJudge: () => setJudgeMode(!judgeMode)
    }}>
      <div className={presentationMode ? "presentation-mode" : ""}>
        {children}
        <AnimatePresence>
          {judgeMode && (
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              className="fixed right-6 top-20 bottom-6 w-96 z-[100] pointer-events-none"
            >
              <Card className="h-full bg-black/95 border-primary/50 text-emerald-400 font-mono overflow-hidden shadow-2xl pointer-events-auto flex flex-col">
                <div className="bg-primary/20 p-4 border-b border-primary/30 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-widest text-xs">Judge_Mode::Technical_Audit</span>
                  </div>
                  <button
                    onClick={() => setJudgeMode(false)}
                    className="hover:bg-white/10 p-1 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <CardContent className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                  <JudgePanel simulation={simulation} />
                </CardContent>
                <div className="p-3 bg-white/5 border-t border-white/10 text-[8px] text-white/40 flex justify-between shrink-0">
                  <span>RUNTIME: Vercel_Edge</span>
                  <span>BUILD: 0x92f_v2.4</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <PresentationBadge show={presentationMode} />
      </div>
    </PresentationToolsContext.Provider>
  )
}

export const usePresentationTools = () => {
  const context = useContext(PresentationToolsContext)
  return context ?? {
    presentationMode: false,
    judgeMode: false,
    togglePresentation: () => {},
    toggleJudge: () => {},
  }
}

function PresentationBadge({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
    >
      <Badge className="bg-primary/90 text-primary-foreground px-4 py-2 text-xs font-bold shadow-2xl backdrop-blur-md animate-pulse border-primary">
        <Presentation className="w-3 h-3 mr-2" /> PRESENTATION MODE ACTIVE
      </Badge>
    </motion.div>
  )
}
