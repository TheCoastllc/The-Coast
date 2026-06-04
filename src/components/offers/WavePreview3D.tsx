"use client";

import dynamic from "next/dynamic";
import type { WaveWaterProps } from "./WaveWater";

// three.js water, client-only. Same shader as the homepage hero.
const WaveWater = dynamic(() => import("./WaveWater").then((m) => ({ default: m.WaveWater })), {
  ssr: false,
});

const TREATMENTS: { key: string; label: string; desc: string; props: WaveWaterProps }[] = [
  {
    key: "calm",
    label: "Calm",
    desc: "Serene, glassy 3D water with gentle ripples — quiet and premium.",
    props: { amp: 0.42, freq: 0.5, fogDensity: 0.08, caustics: 0.4, camY: 1.5 },
  },
  {
    key: "dramatic",
    label: "Dramatic",
    desc: "Big rolling 3D swells with foam, shot low — the homepage hero's energy.",
    props: { amp: 1.0, freq: 0.55, foamAmt: 0.85, caustics: 0.6, fogDensity: 0.05, camY: 0.9 },
  },
  {
    key: "sunset",
    label: "Sunset glade",
    desc: "A warm sun-reflection burning a glade straight down the water.",
    props: { amp: 0.6, freq: 0.5, reflect: 0.95, accent: "#F4633A", crest: "#2E6CA8", camY: 1.2 },
  },
];

export function WavePreview3D() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2.4rem",
      }}
    >
      {TREATMENTS.map((t, i) => (
        <section key={t.key} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.7rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold)", fontSize: 13, letterSpacing: "0.18em" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "2rem", letterSpacing: "-0.01em", margin: 0, color: "var(--color-cream)" }}>
              {t.label}
            </h2>
          </div>
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 10",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              background: "linear-gradient(to bottom, #0a1727 0%, #050d18 100%)",
            }}
          >
            <WaveWater {...t.props} />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.55, color: "var(--color-cream-dim, #cdc7bb)", margin: 0 }}>
            {t.desc}
          </p>
        </section>
      ))}
    </div>
  );
}
