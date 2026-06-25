"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="navbar-float"
      style={{
        boxShadow: scrolled
          ? "0 8px 40px rgba(100,130,240,0.2), inset 0 1px 0 rgba(255,255,255,1)"
          : "0 4px 24px rgba(100,130,240,0.12), inset 0 1px 0 rgba(255,255,255,1)",
      }}
    >
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 opacity-90" />
            <Compass className="relative z-10 w-7 h-7 text-white p-1" strokeWidth={1.5} />
          </div>
          <span className="font-display font-600 text-[15px] tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
            Daedalus
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Paths", href: "#paths" },
            { label: "About", href: "#about" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/demo-personas"
            className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Try Demo
          </Link>
          <Link
            href="/onboarding"
            className="text-[13px] font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/60 flex flex-col gap-3">
          {["How it works", "Paths", "About"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, "-")}`}
              className="text-[13px] font-medium text-slate-600"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link
            href="/onboarding"
            className="text-[13px] font-semibold text-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            onClick={() => setMobileOpen(false)}
          >
            Start Free
          </Link>
        </div>
      )}
    </nav>
  );
}
