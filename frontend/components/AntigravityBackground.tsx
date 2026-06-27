"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
  loading: () => null,
});

function shouldUseLightweightBackground() {
  if (typeof window === "undefined") return true;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrowScreen = window.matchMedia("(max-width: 768px)").matches;
  const lowMemory = typeof navigator !== "undefined" && "deviceMemory" in navigator && Number((navigator as any).deviceMemory) <= 4;
  return reducedMotion || narrowScreen || lowMemory;
}

export default function AntigravityBackground() {
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);

  useEffect(() => {
    if (shouldUseLightweightBackground()) return;
    const id = window.setTimeout(() => setCanRenderWebGL(true), 650);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        zIndex: 1,
        opacity: 0.45,
      }}
    >
      {!canRenderWebGL ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(123,186,212,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(30,106,138,0.12),transparent_25%),linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)]" />
      ) : (
        <Antigravity
          colors={["#030b21", "#2c0640", "#d8eef7"]}
          count={3}
          speed={0.55}
          amplitude={1}
          waviness={1}
          thickness={1.5}
          glow={5}
          taper={3}
          spread={1}
          intensity={0.6}
          saturation={2}
          opacity={1}
          scale={3}
          glass={false}
          refraction={1}
          dispersion={1}
          glassSize={1}
          hueShift={0}
        />
      )}
    </div>
  );
}
