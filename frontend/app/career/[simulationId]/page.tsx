"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getSimulation } from "@/lib/simulation-store"

export default function CareerBridge() {
  const params = useParams()
  const router = useRouter()
  const simulationId = params.simulationId as string

  useEffect(() => {
    const sim = getSimulation(simulationId)
    if (sim) {
      router.replace(`/career/${simulationId}/${sim.comparison.recommended_path_id}`)
    } else {
      router.replace("/demo-personas")
    }
  }, [simulationId, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
