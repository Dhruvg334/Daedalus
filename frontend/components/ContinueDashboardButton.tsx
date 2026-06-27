"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSimulation, getRecentViews, getSimulation } from "@/lib/simulation-store";

type RecentView = { id: string; name: string; timestamp: number };

export function ContinueDashboardButton({ variant = "hero" }: { variant?: "hero" | "nav" | "navPrimary" }) {
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [recent, setRecent] = useState<RecentView[]>([]);

  const refresh = () => {
    const simulation = getSimulation();
    const recentViews = getRecentViews();
    setRecent(recentViews);
    if (simulation?.simulation_id) {
      setSimulationId(simulation.simulation_id);
      setName(simulation.student_summary?.name || "your dashboard");
    } else if (recentViews[0]?.id) {
      setSimulationId(recentViews[0].id);
      setName(recentViews[0].name || "your dashboard");
    } else {
      setSimulationId(null);
      setName("");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = (id: string) => {
    deleteSimulation(id);
    refresh();
  };

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
    <div className="mt-4 flex flex-col items-center gap-3 animate-in fade-in duration-500">
      <Button variant="outline" size="lg" className="h-13 px-8 text-base gap-2" asChild>
        <Link href={`/dashboard/${simulationId}`}>
          Continue {name ? `${name}'s` : "your"} dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>

      {recent.length > 0 && (
        <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white/70 p-3 text-left shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">Saved simulations</p>
            <p className="text-[10px] text-neutral-400">Stored in this browser</p>
          </div>
          <div className="space-y-1.5">
            {recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 rounded-xl border border-black/5 bg-white px-3 py-2">
                <Link href={`/dashboard/${item.id}`} className="min-w-0 flex-1 text-sm font-semibold text-neutral-800 hover:text-[#1e6a8a]">
                  <span className="block truncate">{item.name || "Saved profile"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${item.name || "saved profile"}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
