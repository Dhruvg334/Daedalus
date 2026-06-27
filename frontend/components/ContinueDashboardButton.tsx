"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSimulation } from "@/lib/simulation-store";

export function ContinueDashboardButton({ variant = "hero" }: { variant?: "hero" | "nav" | "navPrimary" }) {
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const simulation = getSimulation();
    if (simulation?.simulation_id) {
      setSimulationId(simulation.simulation_id);
      setName(simulation.student_summary?.name || "your dashboard");
    }
  }, []);

  if (!simulationId && variant === "navPrimary") {
    return (
      <Button className="flex items-center gap-1.5 bg-black text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors shrink-0" asChild>
        <Link href="/onboarding">
          Get Started <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    );
  }

  if (!simulationId) return null;

  if (variant === "navPrimary") {
    return (
      <Button className="flex items-center gap-1.5 bg-black text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors shrink-0" asChild>
        <Link href={`/dashboard/${simulationId}`}>
          <RotateCcw className="w-3.5 h-3.5" />
          Continue
        </Link>
      </Button>
    );
  }

  if (variant === "nav") {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/${simulationId}`} className="gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          Continue
        </Link>
      </Button>
    );
  }

  return (
    <div className="mt-4 flex justify-center animate-in fade-in duration-500">
      <Button variant="outline" size="lg" className="h-13 px-8 text-base gap-2" asChild>
        <Link href={`/dashboard/${simulationId}`}>
          Continue {name ? `${name}'s` : "your"} dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
