"use client";

import Antigravity from "@/components/Antigravity";

export default function AntigravityBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        zIndex: 1,
        opacity: 0.45,
      }}
    >
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
    </div>
  );
}
