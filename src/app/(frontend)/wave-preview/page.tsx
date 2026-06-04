import type { Metadata } from "next";
import { WaveVisual, type WaveVariant } from "@/components/offers/WaveVisual";
import { CBI } from "@/app/(frontend)/offers/content";

export const metadata: Metadata = {
  title: "Wave options — pick one",
  robots: { index: false, follow: false },
};

const OPTIONS: { v: WaveVariant; label: string; desc: string }[] = [
  { v: "swell", label: "Swell", desc: "Layered rolling ocean swell — calm and steady." },
  { v: "crest", label: "Crest", desc: "A single swell rising to a glowing, foam-tipped peak." },
  { v: "curl", label: "Curl", desc: "A breaking wave curling over into a barrel, with spray." },
];

/**
 * Side-by-side comparison of the three CBI wave graphics so the choice is one
 * glance, not a URL-param hunt. Pick one and it gets set everywhere. noindex.
 */
export default function WavePreviewPage() {
  const m = CBI.mock;
  return (
    <main
      style={{
        minHeight: "100vh",
        maxWidth: 1220,
        margin: "0 auto",
        padding: "calc(var(--nav-h, 64px) + 5vh) 5vw 12vh",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontSize: 12,
          color: "var(--color-gold)",
          margin: 0,
        }}
      >
        The Coast Brand Index
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          margin: "0.25em 0 0.3em",
          color: "var(--color-cream)",
        }}
      >
        Pick your wave
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          color: "var(--color-cream-dim, #cdc7bb)",
          maxWidth: 640,
          margin: "0 0 3.2rem",
        }}
      >
        Three options for the &ldquo;How strong is your wave?&rdquo; graphic, all
        on one screen. Tell me which one — swell, crest, or curl — and I&rsquo;ll set
        it on the home page, /offers, and the test flow.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2.4rem",
        }}
      >
        {OPTIONS.map((o, i) => (
          <section key={o.v} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.7rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold)", fontSize: 13, letterSpacing: "0.18em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "2rem",
                  letterSpacing: "-0.01em",
                  margin: 0,
                  color: "var(--color-cream)",
                }}
              >
                {o.label}
              </h2>
            </div>
            <WaveVisual variant={o.v} score={m.score} waveName={m.waveName} scale={CBI.waveScale} />
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                lineHeight: 1.55,
                color: "var(--color-cream-dim, #cdc7bb)",
                margin: 0,
              }}
            >
              {o.desc}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
