"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDesktopOnlyWebGL, useHeroMountTrigger } from "@/lib/perf";

// three.js lives ONLY in these chunks - loaded via dynamic(ssr:false) and only
// once a desktop visitor has interacted, so /visuals ships zero WebGL on the
// critical path and synthetic audits never compile a shader.
const LiquidImage = dynamic(
  () => import("@/components/visuals/LiquidImage").then((m) => ({ default: m.LiquidImage })),
  { ssr: false }
);
const ScrollMeltFilm = dynamic(
  () => import("@/components/visuals/ScrollMeltFilm").then((m) => ({ default: m.ScrollMeltFilm })),
  { ssr: false }
);
const Undertow = dynamic(
  () => import("@/components/visuals/Undertow").then((m) => ({ default: m.Undertow })),
  { ssr: false }
);
const ParticleDissolve = dynamic(
  () => import("@/components/visuals/ParticleDissolve").then((m) => ({ default: m.ParticleDissolve })),
  { ssr: false }
);

const TABS = [
  { id: "archive", label: "Archive" },
  { id: "liquid", label: "Liquid" },
  { id: "melt", label: "Melt" },
  { id: "undertow", label: "Undertow" },
  { id: "dissolve", label: "Dissolve" },
] as const;

function Inner() {
  const params = useSearchParams();
  const fx = params.get("fx") ?? "archive";
  const webgl = useDesktopOnlyWebGL(); // desktop, fine pointer, not reduced-motion, tier != low
  const trigger = useHeroMountTrigger(); // first interaction - keeps three.js out of audits
  const live = fx !== "archive" && webgl && trigger;

  return (
    <>
      {live && fx === "liquid" && <LiquidImage />}
      {live && fx === "melt" && <ScrollMeltFilm />}
      {live && fx === "undertow" && <Undertow />}
      {live && fx === "dissolve" && <ParticleDissolve />}

      {fx !== "archive" && !webgl && (
        <p
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: "5rem",
            textAlign: "center",
            zIndex: 40,
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-steel)",
            pointerEvents: "none",
          }}
        >
          The {fx} showcase runs on desktop
        </p>
      )}

      <nav
        aria-label="Effect preview"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "1.4rem",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.3rem",
          alignItems: "center",
          padding: "0.4rem 0.55rem",
          borderRadius: 999,
          background: "rgba(10,12,18,0.72)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid var(--color-border)",
          zIndex: 50,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--color-steel)",
            padding: "0 0.4rem",
          }}
        >
          FX
        </span>
        {TABS.map((t) => {
          const next = new URLSearchParams(params.toString());
          next.set("fx", t.id);
          const active = fx === t.id;
          return (
            <a
              key={t.id}
              href={`?${next.toString()}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "0.4rem 0.7rem",
                borderRadius: 999,
                color: active ? "#0A0C12" : "var(--color-white)",
                background: active ? "#DB5227" : "transparent",
                textDecoration: "none",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              {t.label}
            </a>
          );
        })}
      </nav>
    </>
  );
}

/** Preview switcher for the immersive WebGL effects on /visuals. Default "archive"
 *  shows the page untouched; ?fx=liquid|melt|undertow|dissolve overlays one effect
 *  (desktop-only, after interaction). */
export function VisualsFx() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
