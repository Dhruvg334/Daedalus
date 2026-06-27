"use client";

import { useEffect, useMemo, useState } from "react";
import Antigravity from "@/components/Antigravity";

function shouldUseLightweightBackground() {
  if (typeof window === "undefined") return true;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrowScreen = window.matchMedia("(max-width: 768px)").matches;
  const lowMemory =
    typeof navigator !== "undefined" &&
    "deviceMemory" in navigator &&
    Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 4;

  return reducedMotion || narrowScreen || lowMemory;
}

function StaticAntigravityFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_20%_15%,rgba(123,186,212,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(30,106,138,0.12),transparent_25%),linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)]">
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#7BBAD4]/20 blur-3xl" />
      <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-[#1e6a8a]/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/3 h-56 w-56 rounded-full bg-[#B0D4E8]/20 blur-3xl" />
    </div>
  );
}

export default function AntigravityBackground() {
  const [mounted, setMounted] = useState(false);
  const [useLightweight, setUseLightweight] = useState(true);

  useEffect(() => {
    setMounted(true);
    setUseLightweight(shouldUseLightweightBackground());
  }, []);

  const antigravityProps = useMemo(
    () => ({
      colors: ["#030b21", "#2c0640", "#d8eef7"],
      count: 3,
      speed: 0.55,
      amplitude: 1,
      waviness: 1,
      thickness: 1.5,
      glow: 5,
      taper: 3,
      spread: 1,
      intensity: 0.6,
      saturation: 2,
      opacity: 1,
      scale: 3,
      glass: false,
      refraction: 1,
      dispersion: 1,
      glassSize: 1,
      hueShift: 0,
    }),
    [],
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 1, opacity: 0.45 }}
    >
      {!mounted || useLightweight ? <StaticAntigravityFallback /> : <Antigravity {...antigravityProps} />}
    </div>
  );
}
