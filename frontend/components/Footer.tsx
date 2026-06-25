import Link from "next/link";
import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/40">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
            <Compass size={14} className="text-white" strokeWidth={1.5} />
          </div>
          <span className="font-display font-600 text-slate-700 text-[14px]">Daedalus</span>
          <span className="text-slate-300 text-[12px] ml-2">· AI-Era Career Navigation</span>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: "Onboarding", href: "/onboarding" },
            { label: "Demo Personas", href: "/demo-personas" },
            { label: "How it works", href: "#how-it-works" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[12px] text-slate-400 hover:text-slate-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="text-[11px] text-slate-300">
          Track 04 · Track 01 · Built with Daedalus
        </div>
      </div>
    </footer>
  );
}
