"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { AlertCircle, RefreshCw, Zap, Home } from "lucide-react";

export default function ErrorPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-strong rounded-3xl p-10">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={26} className="text-red-400" strokeWidth={1.5} />
            </div>

            <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
            <p className="text-slate-500 text-[14px] leading-relaxed mb-8">
              Daedalus couldn&apos;t complete your simulation. This might be a temporary issue. Try again or use a demo persona to see the full experience.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-[14px]"
              >
                <RefreshCw size={14} /> Try again
              </button>
              <Link
                href="/demo-personas"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl glass text-slate-700 font-semibold text-[14px] hover:bg-white/70"
              >
                <Zap size={14} /> Use demo persona
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 font-medium text-[14px] hover:text-slate-700"
              >
                <Home size={14} /> Return home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
