"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  Search,
  Bookmark,
  Sparkles
} from "lucide-react";
import { getSimulation } from "@/lib/simulation-store";
import { getOpportunities } from "@/lib/api";
import type { Simulation, Opportunity } from "@/lib/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OpportunityHubPage() {
  const params = useParams<{ simulationId: string }>();
  const simulationId = params.simulationId as string;
  const router = useRouter();

  const [data, setData] = useState<Simulation | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const sim = getSimulation(simulationId);
    if (!sim) {
      router.push("/demo-personas");
      return;
    }
    setData(sim);

    const fetchOpps = async () => {
      try {
        const res = await getOpportunities(sim.comparison.recommended_path_id, simulationId);
        setOpportunities(res.opportunities);
      } catch (error) {
        console.error("Failed to load opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpps();
  }, [simulationId, router]);

  const filteredOpps = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!data && !loading) return null;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <section className="space-y-4">
          <Link
            href={`/dashboard/${simulationId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Opportunity Engine Active</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">Career Opportunity Hub</h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Real-world internships, hackathons, and projects curated for your
                <span className="text-primary font-bold"> {data?.career_paths[0].title}</span> path.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border">
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold px-4">All</Button>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold px-4">Remote</Button>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold px-4">Paid</Button>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <div className="flex gap-4 items-center bg-card/50 backdrop-blur-md p-2 rounded-2xl border border-border/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles, companies, or skills..."
              className="pl-10 h-12 bg-transparent border-none focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="h-80">
                <CardHeader className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredOpps.length > 0 ? (
            filteredOpps.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full flex flex-col group hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                  {opp.relevance_score > 0.9 && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-[8px] font-black text-white px-3 py-1 rounded-bl-lg flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> HIGH_MATCH
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-tighter mb-2">
                          {opp.type}
                        </Badge>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">{opp.title}</CardTitle>
                        <p className="text-sm font-bold text-muted-foreground">{opp.organization}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" /> {opp.location}
                      </div>
                      {opp.salary_stipend && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                          <DollarSign className="w-3.5 h-3.5" /> {opp.salary_stipend}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" /> {opp.deadline}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground capitalize">
                        <Activity className="w-3.5 h-3.5" /> {opp.difficulty}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Skill Requirements</p>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.requirements.map(req => (
                          <Badge key={req} variant="outline" className="text-[9px] font-medium bg-muted/30">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 gap-2 bg-muted/10 border-t">
                    <Button variant="ghost" size="icon" className="shrink-0 hover:bg-primary/10 hover:text-primary">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button className="w-full text-xs gap-2" asChild>
                      <a href={opp.apply_url} target="_blank" rel="noopener noreferrer">
                        Official Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                <Search className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xl">No opportunities found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

import { Activity } from "lucide-react";
