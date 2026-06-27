import Link from "next/link";
import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/40 px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500">
            <Compass size={14} className="text-white" strokeWidth={1.5} />
          </div>
          <span className="font-display text-[14px] font-semibold text-slate-700">Daedalus</span>
          <span className="ml-2 text-[12px] text-slate-300">· AI-era career navigation</span>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: "Onboarding", href: "/onboarding" },
            { label: "Demo Personas", href: "/demo-personas" },
            { label: "About", href: "/about" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[12px] text-slate-400 transition-colors hover:text-slate-700"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="text-[11px] text-slate-300">Built by Dhruv Gupta, Akshhaya Isa, and Pavit Agrawal</div>
      </div>
    </footer>
  );
}
