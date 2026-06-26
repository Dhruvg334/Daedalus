"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Brain,
  Zap,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Terminal,
  User,
  Bot
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { chatWithAssistant } from "@/lib/api"
import { AssistantMessage } from "@/lib/types"

interface AssistantDrawerProps {
  simulationId?: string
}

export function AssistantDrawer({ simulationId }: AssistantDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: "assistant", content: "Identity confirmed. I am the Daedalus Assistant. How can I optimize your career trajectory today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: AssistantMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await chatWithAssistant([...messages, userMessage], simulationId)
      setMessages(prev => [...prev, { role: "assistant", content: response.content }])
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Kernel communication error. Please check your connection or API key configuration." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Trigger */}
      <motion.div
        className="fixed bottom-6 right-6 z-[60] no-print"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-2xl shadow-primary/40 group relative overflow-hidden"
          onClick={() => setIsOpen(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-600 opacity-90 group-hover:scale-110 transition-transform duration-500" />
          <MessageSquare className="relative z-10 w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          {messages.length > 1 && !isOpen && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-background rounded-full z-20" />
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-end p-6">
            <motion.div
              className="pointer-events-auto w-full max-w-md h-[600px] flex flex-col"
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
                width: isMaximized ? "calc(100vw - 3rem)" : "100%",
                maxWidth: isMaximized ? "calc(100vw - 3rem)" : "28rem",
                height: isMaximized ? "calc(100vh - 3rem)" : "600px"
              }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <Card className="flex-1 flex flex-col border-primary/20 shadow-2xl overflow-hidden bg-background/95 backdrop-blur-xl">
                <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        Daedalus Intelligence
                        <Badge variant="outline" className="text-[8px] h-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">LIVE</Badge>
                      </CardTitle>
                      <p className="text-[10px] text-muted-foreground font-mono">Kernel_Module::Assistant_v2</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMaximized(!isMaximized)}>
                      {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setIsOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                  <div className="flex flex-col gap-4">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex gap-3 max-w-[85%]",
                          msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border",
                          msg.role === "user" ? "bg-muted/50" : "bg-primary/10 border-primary/20"
                        )}>
                          {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted/50 border border-border rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        </div>
                        <div className="bg-muted/30 p-3 rounded-2xl rounded-tl-none italic text-xs text-muted-foreground">
                          Retrieving neural context...
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <div className="p-4 border-t bg-muted/20">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about your roadmap, skills, or resume..."
                      className="h-11 bg-background border-none focus-visible:ring-primary/20"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button
                      className="h-11 px-4 shadow-lg shadow-primary/20"
                      disabled={isLoading || !input.trim()}
                      onClick={handleSend}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                    {["Explain my Fit", "Next Sprint Task", "Resume Help"].map(chip => (
                      <Badge
                        key={chip}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors whitespace-nowrap text-[10px]"
                        onClick={() => setInput(chip)}
                      >
                        {chip}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
