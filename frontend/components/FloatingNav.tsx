"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ContinueDashboardButton } from "@/components/ContinueDashboardButton";

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className="floating-nav" style={{ width: scrolled ? "min(660px,92vw)" : "min(710px,94vw)" }}>
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#7BBAD4] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-black">Daedalus</span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {[
            { href: "#how-it-works", label: "How it Works" },
            { href: "#cta", label: "Features" },
            { href: "/demo-personas", label: "Demo" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="text-sm font-medium text-neutral-500 hover:text-black transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <ContinueDashboardButton variant="navPrimary" />
      </div>
    </nav>
  );
}
