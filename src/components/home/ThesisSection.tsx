"use client";

import { useVariant } from "@/components/visuals/useVariant";
import styles from "./ThesisSection.module.css";

export const THESIS_VARIANTS = ["lighthouse", "bottle", "chart", "billboard", "glass"] as const;
export type ThesisVariant = (typeof THESIS_VARIANTS)[number];

type Beat = { label: string; title: string; body: string };
const KEYWORDS = ["invisibility", "accessible", "empires"] as const;

function renderTitle(title: string, k: string) {
  const i = title.toLowerCase().indexOf(k.toLowerCase());
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <em>{title.slice(i, i + k.length)}</em>
      {title.slice(i + k.length)}
    </>
  );
}

/* ── recognizable object decorations ── */
function Lighthouse() {
  return (
    <svg className={styles.lhTower} viewBox="0 0 60 130" fill="none" aria-hidden>
      <path d="M22 128 L18 56 H42 L38 128 Z" fill="#0b1c2e" stroke="#1c3650" strokeWidth="1.5" />
      <path d="M19 56 h22 l-3 -8 H22 Z" fill="#13283f" />
      <rect x="23" y="36" width="14" height="12" rx="1.5" fill="#1a3552" stroke="#244766" />
      <rect x="25" y="38" width="10" height="8" fill="#ffe6a8" opacity="0.9" />
      <path d="M21 36 h18 l-9 -9 Z" fill="#7a1f1f" />
      <circle cx="30" cy="42" r="2.4" fill="#fff" />
      {/* stripes */}
      <path d="M20 72 H40 M19 92 H41 M18 112 H42" stroke="#244766" strokeWidth="3" opacity="0.5" />
    </svg>
  );
}
function CompassRose() {
  return (
    <svg className={styles.chRose} viewBox="0 0 100 100" fill="none" aria-hidden>
      <circle cx="50" cy="50" r="44" stroke="#9a7a3a" strokeWidth="1" opacity="0.5" />
      <circle cx="50" cy="50" r="34" stroke="#9a7a3a" strokeWidth="0.6" opacity="0.4" />
      <path d="M50 6 L57 50 L50 60 L43 50 Z" fill="#b98f3e" opacity="0.85" />
      <path d="M50 94 L43 50 L50 40 L57 50 Z" fill="#7a5e28" opacity="0.7" />
      <path d="M6 50 L50 43 L60 50 L50 57 Z" fill="#8a6a30" opacity="0.6" />
      <path d="M94 50 L50 57 L40 50 L50 43 Z" fill="#8a6a30" opacity="0.6" />
    </svg>
  );
}

function ThesisBeat({ variant, beat, i }: { variant: ThesisVariant; beat: Beat; i: number }) {
  const content = (
    <div className={styles.content}>
      <p className={styles.label}>{beat.label}</p>
      <h2 className={styles.title}>{renderTitle(beat.title, KEYWORDS[i] ?? "")}</h2>
      <p className={styles.body}>{beat.body}</p>
    </div>
  );

  if (variant === "lighthouse") {
    return (
      <section className={styles.beat} data-i={i}>
        <div className={styles.lhBeam} aria-hidden />
        <Lighthouse />
        {content}
      </section>
    );
  }
  if (variant === "bottle") {
    return (
      <section className={styles.beat} data-i={i}>
        <div className={styles.boScene}>
          <svg className={styles.boGlass} viewBox="0 0 120 300" fill="none" aria-hidden>
            <rect x="46" y="6" width="28" height="40" rx="6" fill="#0e2a3a" opacity="0.5" stroke="#3f7d86" />
            <rect x="50" y="0" width="20" height="12" rx="3" fill="#7a5230" />
            <path d="M40 46 q-18 18 -18 60 v160 q0 28 38 28 t38 -28 V106 q0 -42 -18 -60 Z" fill="rgba(120,200,200,0.10)" stroke="#3f7d86" strokeWidth="1.5" />
            <path d="M48 70 q-8 14 -8 44 v140" stroke="rgba(190,240,240,0.35)" strokeWidth="2" fill="none" />
          </svg>
          <div className={styles.boScroll}>{content}</div>
        </div>
      </section>
    );
  }
  if (variant === "chart") {
    return (
      <section className={styles.beat} data-i={i}>
        <CompassRose />
        <div className={styles.chRoute} aria-hidden />
        {content}
      </section>
    );
  }
  if (variant === "billboard") {
    return (
      <section className={styles.beat} data-i={i}>
        <div className={styles.bbBoard}>
          <span className={styles.bbSpot} aria-hidden />
          {content}
        </div>
        <span className={styles.bbLeg} data-side="l" aria-hidden />
        <span className={styles.bbLeg} data-side="r" aria-hidden />
      </section>
    );
  }
  // glass
  return (
    <section className={styles.beat} data-i={i}>
      <div className={styles.glGhost} aria-hidden>{beat.title}</div>
      <div className={styles.glLens}>
        <div className={styles.glReticle} aria-hidden />
        {content}
      </div>
    </section>
  );
}

/**
 * The problem / fix / promise thesis as a moment, framed inside a real object.
 * Five treatments via ?thesis= (lighthouse | bottle | chart | billboard | glass).
 */
export function ThesisSection({ items }: { items: readonly Beat[] }) {
  const v = useVariant("thesis", THESIS_VARIANTS, "lighthouse");
  return (
    <div className={`${styles.wrap} ${styles[v]}`} data-thesis={v}>
      {items.map((t, i) => (
        <ThesisBeat key={t.label} variant={v} beat={t} i={i} />
      ))}
    </div>
  );
}
