"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Sparkles, Zap, Target, BookOpen, Briefcase, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TourStep {
  targetId: string
  title: string
  content: string
  icon: any
  position: "top" | "bottom" | "left" | "right" | "center"
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "welcome",
    title: "Welcome to Daedalus_OS",
    content: "The intelligent navigation layer for your career in the AI era. Let's take a quick tour of your new Career Operating System.",
    icon: Sparkles,
    position: "center"
  },
  {
    targetId: "sidebar-overview",
    title: "The Command Center",
    content: "Your sidebar is the central hub. Access Evolution Paths, Skill Trees, and the Decision Lab from here.",
    icon: Zap,
    position: "right"
  },
  {
    targetId: "career-graph",
    title: "Signal Mapping",
    content: "Visualize how your interests and skills map to future-proof career paths through our interactive signal graph.",
    icon: Target,
    position: "bottom"
  },
  {
    targetId: "opportunity-hub",
    title: "Opportunity Engine",
    content: "Discover real-world internships, hackathons, and projects tailored specifically to your chosen path.",
    icon: Briefcase,
    position: "right"
  },
  {
    targetId: "learning-hub",
    title: "Personalized Learning",
    content: "Access curated, free resources to bridge your skill gaps and unlock new career nodes.",
    icon: BookOpen,
    position: "right"
  },
  {
    targetId: "ai-assistant",
    title: "Gemini Assistant",
    content: "Your personalized AI career coach. Ask it anything about your roadmap or use it to automate resume generation.",
    icon: MessageSquare,
    position: "left"
  }
]

export function GuidedTour() {
  const [currentStep, setCurrentStep] = useState(-1)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const startTour = () => {
      setIsActive(true)
      setCurrentStep(0)
    }
    window.addEventListener("daedalus-start-tour", startTour)
    return () => window.removeEventListener("daedalus-start-tour", startTour)
  }, [])

  const handleComplete = () => {
    localStorage.setItem("daedalus-tour-seen", "true")
    setIsActive(false)
    setCurrentStep(-1)
  }

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  if (!isActive || currentStep === -1) return null

  const step = TOUR_STEPS[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleComplete()
          }}
        >
          <div className="flex items-center justify-center h-full p-6">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full"
            >
              <Card className="border-primary/20 shadow-2xl bg-background/95 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <button
                      onClick={handleComplete}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight">{step.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-foreground/80 pt-2">
                    {step.content}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {TOUR_STEPS.map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                            i === currentStep ? "bg-primary w-4" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {currentStep > 0 && (
                        <Button variant="ghost" size="sm" onClick={prevStep}>
                          <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                      )}
                      <Button size="sm" onClick={nextStep} className="shadow-lg shadow-primary/20">
                        {currentStep === TOUR_STEPS.length - 1 ? "Get Started" : "Continue"}
                        {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
