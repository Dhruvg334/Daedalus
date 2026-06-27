"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Linkedin,
  Github,
  ListChecks,
  Wand2,
  Copy,
  Check,
  Download,
  Loader2,
  Sparkles,
  RefreshCw,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { runAutomation } from "@/lib/api"
import { getSimulation } from "@/lib/simulation-store"
import { cn } from "@/lib/utils"

interface AutomationHubProps {
  simulationId: string
  careerTitle: string
}

const AUTOMATIONS = [
  { id: "resume", label: "Projected Resume", icon: FileText, desc: "Generate a Year+5 resume projection." },
  { id: "cover_letter", label: "Cover Letter", icon: FileText, desc: "Tailored letter for top opportunities." },
  { id: "linkedin", label: "LinkedIn Optimization", icon: Linkedin, desc: "Professional bio and headline." },
  { id: "readme", label: "Project README", icon: Github, desc: "Technical documentation for your sprint." },
  { id: "learning_plan", label: "Learning Roadmap", icon: ListChecks, desc: "Detailed weekly study schedule." },
]

export function AutomationHub({ simulationId, careerTitle }: AutomationHubProps) {
  const [activeType, setActiveType] = useState(AUTOMATIONS[0].id)
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)

  const handleRun = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }))
    try {
      const localSimulation = getSimulation(simulationId)
      const res = await runAutomation(type, simulationId, undefined, localSimulation || undefined)
      setContent(prev => ({ ...prev, [type]: res.content }))
    } catch (error) {
      console.error("Automation failed:", error)
      setContent(prev => ({ ...prev, [type]: "This generated asset could not be created right now. Your dashboard and sprint are still available. Please retry in a few seconds." }))
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }

  const copyToClipboard = (text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-primary/20 shadow-xl bg-card/50 backdrop-blur-md overflow-hidden">
      <CardHeader className="bg-primary/5 border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Career AI Automation Lab
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Deterministic context meets generative reasoning to build your professional assets.
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-background/50 font-mono text-[10px]">OS_MODULE::AUTO_LAB</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Sidebar */}
          <div className="lg:col-span-4 border-r border-border/50 p-4 space-y-2 bg-muted/20">
            {AUTOMATIONS.map((auto) => (
              <button
                key={auto.id}
                onClick={() => setActiveType(auto.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all group relative overflow-hidden",
                  activeType === auto.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <auto.icon className={cn("w-4 h-4", activeType === auto.id ? "" : "text-muted-foreground")} />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">{auto.label}</p>
                    <p className={cn("text-[10px] opacity-70 line-clamp-1", activeType === auto.id ? "text-primary-foreground" : "text-muted-foreground")}>
                      {auto.desc}
                    </p>
                  </div>
                </div>
                {activeType === auto.id && (
                  <motion.div
                    layoutId="active-bg"
                    className="absolute inset-0 bg-primary-foreground/10"
                    initial={false}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Editor/Display Area */}
          <div className="lg:col-span-8 flex flex-col bg-background/30">
            <div className="p-4 border-b flex items-center justify-between bg-muted/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
                {AUTOMATIONS.find(a => a.id === activeType)?.label} Output
              </h4>
              <div className="flex gap-2">
                {content[activeType] && (
                  <Button variant="ghost" size="sm" className="h-8 gap-2 text-[10px] font-bold" onClick={() => copyToClipboard(content[activeType])}>
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant={content[activeType] ? "outline" : "default"}
                  className="h-8 gap-2 text-[10px] font-bold shadow-sm"
                  onClick={() => handleRun(activeType)}
                  disabled={loading[activeType]}
                >
                  {loading[activeType] ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : content[activeType] ? (
                    <RefreshCw className="w-3 h-3" />
                  ) : (
                    <Zap className="w-3 h-3" />
                  )}
                  {content[activeType] ? "Regenerate" : "Initialize Generation"}
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6 relative">
              <AnimatePresence mode="wait">
                {loading[activeType] ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <div className="space-y-1">
                        <p className="text-sm font-black animate-pulse text-foreground">Synthesizing Neural Signal...</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Gemini-1.5-Flash :: Executing_Task::{activeType}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                {content[activeType] ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose dark:prose-invert prose-xs max-w-none h-full overflow-y-auto pr-4 custom-scrollbar"
                  >
                    <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl border font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-foreground/90">
                      {content[activeType]}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30"
                  >
                    <div className="p-4 rounded-full bg-muted">
                      <Wand2 className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-1 text-foreground">
                      <p className="font-bold text-foreground">No active artifact detected.</p>
                      <p className="text-xs text-muted-foreground">Click 'Initialize Generation' to create this professional asset.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
