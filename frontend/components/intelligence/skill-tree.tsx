"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SkillTreeNode } from "@/lib/types"
import { CheckCircle2, Circle, Lock, ChevronRight } from "lucide-react"

interface SkillTreeProps {
  nodes: SkillTreeNode[]
  className?: string
}

export function SkillTree({ nodes, className }: SkillTreeProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {nodes.map((node) => (
        <SkillNode key={node.id} node={node} level={0} />
      ))}
    </div>
  )
}

function SkillNode({ node, level }: { node: SkillTreeNode; level: number }) {
  const isMastered = node.status === "mastered"
  const isLearning = node.status === "learning"
  const isLocked = node.status === "locked"

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border transition-all",
          isMastered ? "bg-primary/5 border-primary/20 text-primary" :
          isLearning ? "bg-accent/50 border-primary/10" : "bg-muted/20 border-transparent opacity-60"
        )}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="shrink-0">
          {isMastered && <CheckCircle2 className="w-4 h-4" />}
          {isLearning && <Circle className="w-4 h-4 animate-pulse" />}
          {isLocked && <Lock className="w-4 h-4" />}
        </div>

        <span className="text-sm font-semibold flex-1">{node.label}</span>

        {node.children.length > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
      </div>

      {node.children.length > 0 && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <SkillNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
