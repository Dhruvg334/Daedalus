"use client";

import { useEffect, useMemo, useState } from "react";
import Antigravity from "@/components/Antigravity";

function canRunWebGLBackground() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 640px)").matches) return false;
  return true;
}

function StaticAntigravityFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(123,186,212,0.36),transparent_30%),radial-gradient(circle_at_80%_14%,rgba(176,212,232,0.32),transparent_28%),radial-gradient(circle_at_50%_58%,rgba(30,106,138,0.14),transparent_36%),linear-gradient(135deg,#eef8fc_0%,#ffffff_46%,#f7fbfd_100%)]">
      <div className="absolute -left-24 top-8 h-80 w-80 rounded-full bg-[#7BBAD4]/25 blur-3xl" />
      <div className="absolute right-[-4rem] top-14 h-96 w-96 rounded-full bg-[#B0D4E8]/30 blur-3xl" />
      <div className="absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-[#1e6a8a]/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.13] bg-[radial-gradient(circle,#7aaec6_1px,transparent_1px)] [background-size:30px_30px]" />
    </div>
  );
}

export default function AntigravityBackground() {
  const [mounted, setMounted] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowWebGL(canRunWebGLBackground());
  }, []);

  const antigravityProps = useMemo(
    () => ({
      colors: ["#7BBAD4", "#B0D4E8", "#1e6a8a"],
      count: 4,
      speed: 0.42,
      amplitude: 0.85,
      waviness: 0.9,
      thickness: 1.1,
      glow: 3.2,
      taper: 2.5,
      spread: 0.9,
      intensity: 0.38,
      saturation: 1.45,
      opacity: 0.72,
      scale: 2.4,
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
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <StaticAntigravityFallback />
      {mounted && showWebGL ? (
        <div className="absolute inset-0 opacity-80 mix-blend-multiply">
          <Antigravity {...antigravityProps} />
        </div>
      ) : null}
    </div>
  );
}
