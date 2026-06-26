"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Zap,
  UserCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Activity
} from "lucide-react";
import { getDemoPersonas } from "@/lib/api";
import type { DemoPersona } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DemoPersonasPage() {
  const [personas, setPersonas] = useState<DemoPersona[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getDemoPersonas()
      .then((res) => setPersonas(res.personas))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <UserCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Persona Library // v1.1</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Select Subject for Simulation</h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Choose a pre-configured cognitive profile to test the deterministic mapping and evolutionary projection engine.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)
          ) : (
            personas.map((p, idx) => (
              <motion.div
                key={p.persona_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full group hover:border-primary/50 transition-all duration-500 overflow-hidden relative shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BrainCircuit className="w-20 h-20 text-primary" />
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                        {p.name.slice(0, 1)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{p.name}</CardTitle>
                        <CardDescription className="text-[10px] font-mono uppercase tracking-tighter">
                          ID: {p.persona_id} // AGE: {p.age || "18"}
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "{p.headline}"
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.interests.slice(0, 3).map(i => (
                          <Badge key={i} variant="secondary" className="text-[10px] bg-primary/5 text-primary border-primary/10">{i}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.current_skills.slice(0, 3).map(s => (
                          <Badge key={s} variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-600">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Button
                        className="w-full justify-between group shadow-sm"
                        asChild
                      >
                        <Link href={`/loading?persona=${p.persona_id}`}>
                          Initialize Simulation
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Global Footer Stats */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-6">
            <SystemStat label="Simulations_Active" value="1,402" />
            <div className="w-px h-8 bg-border" />
            <SystemStat label="Mean_Confidence" value="94.2%" />
          </div>
          <p className="text-[8px] font-mono uppercase tracking-[0.3em]">Daedalus_OS // Demo_Environment_Access</p>
        </div>
      </div>
    </DashboardShell>
  );
}

function SystemStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[8px] font-bold uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black font-mono">{value}</p>
    </div>
  );
}
