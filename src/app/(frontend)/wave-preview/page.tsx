import type { Metadata } from "next";
import { WavePreview3D } from "@/components/offers/WavePreview3D";

export const metadata: Metadata = {
  title: "Wave options — pick one",
  robots: { index: false, follow: false },
};

/**
 * Side-by-side comparison of real 3D water treatments (the same shader as the
 * homepage hero) so the choice is one glance. Pick one and it gets set on the CBI
 * everywhere. noindex.
 */
export default function WavePreviewPage() {
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
          maxWidth: 660,
          margin: "0 0 3.2rem",
        }}
      >
        Three real 3D water treatments &mdash; the same shader as the homepage hero,
        running live. They animate continuously (this isn&rsquo;t a still). Tell me which
        mood &mdash; calm, dramatic, or sunset &mdash; and I&rsquo;ll set it on the CBI everywhere.
      </p>

      <WavePreview3D />
    </main>
  );
}
