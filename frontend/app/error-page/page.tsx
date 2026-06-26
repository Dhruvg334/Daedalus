"use client";
import Link from "next/link";
import { AlertCircle, RefreshCw, Zap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-destructive/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full text-center z-10">
        <Card className="border-destructive/20 shadow-premium overflow-hidden">
          <div className="h-1 w-full bg-destructive/60" />
          <CardContent className="p-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-destructive" strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Daedalus couldn&apos;t complete your simulation. This might be a temporary issue.
                Try again or use a demo persona to see the full experience.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={() => window.location.reload()}
                className="gap-2 w-full"
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </Button>
              <Button variant="outline" className="gap-2 w-full" asChild>
                <Link href="/demo-personas">
                  <Zap className="w-4 h-4" /> Use demo persona
                </Link>
              </Button>
              <Button variant="ghost" className="gap-2 w-full text-muted-foreground" asChild>
                <Link href="/">
                  <Home className="w-4 h-4" /> Return home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
          Daedalus_OS // Error_Recovery_Mode
        </p>
      </div>
    </div>
  );
}
