"use client";

import { useEffect, useRef } from "react";
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

function BeatContent({ beat, i }: { beat: Beat; i: number }) {
  return (
    <div className={styles.content}>
      <p className={styles.label}>{beat.label}</p>
      <h2 className={`${styles.title} no-marble`}>{renderTitle(beat.title, KEYWORDS[i] ?? "")}</h2>
      <p className={styles.body}>{beat.body}</p>
    </div>
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

/**
 * Glass treatment: a gold-rimmed water lens that follows the cursor over a
 * fully readable headline, magnifying and refracting the text beneath it.
 * Resting state (no pointer / touch / no-JS) is just the readable headline.
 */
function GlassLensBeat({ beat, i }: { beat: Beat; i: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    // Only a fine pointer gets the loupe; touch keeps the plain readable headline.
    if (window.matchMedia?.("(hover: none)").matches) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    const center = (): [number, number] => {
      const r = el.getBoundingClientRect();
      return [r.width / 2, r.height / 2];
    };
    const set = (x: number, y: number) => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    [cx, cy] = center();
    [tx, ty] = [cx, cy];
    set(cx, cy);

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      set(cx, cy);
      // keep following while the lens is active or still easing toward the target
      raf =
        el.dataset.lens === "on" || Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4
          ? requestAnimationFrame(tick)
          : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (el.dataset.lens !== "on") el.dataset.lens = "on";
      kick();
    };
    const onLeave = () => {
      el.dataset.lens = "off";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className={`${styles.beat} ${styles.glassBeat}`} data-i={i} data-lens="off">
      <div className={styles.base}>
        <BeatContent beat={beat} i={i} />
      </div>
      <div className={styles.zoomLayer} aria-hidden>
        <div className={styles.zoomInner}>
          <BeatContent beat={beat} i={i} />
        </div>
      </div>
      <span className={styles.lensRim} aria-hidden />
    </section>
  );
}

function ThesisBeat({ variant, beat, i }: { variant: ThesisVariant; beat: Beat; i: number }) {
  const content = <BeatContent beat={beat} i={i} />;

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
        <div className={styles.bbCity} aria-hidden>
          <span className={styles.bbAd} data-ad="l" />
          <span className={styles.bbAd} data-ad="r" />
          <span className={styles.bbAd} data-ad="b" />
          <span className={styles.bbTicker} />
        </div>
        <div className={styles.bbScreen}>
          <span className={styles.bbBrand} aria-hidden>THE COAST</span>
          <div className={styles.bbScreenInner}>{content}</div>
        </div>
        <div className={styles.bbReflect} aria-hidden />
      </section>
    );
  }
  // glass - interactive water-lens magnifier
  return <GlassLensBeat beat={beat} i={i} />;
}

/**
 * The problem / fix / promise thesis as a moment, framed inside a real object.
 * Five treatments via ?thesis= (lighthouse | bottle | chart | billboard | glass).
 */
export function ThesisSection({ items }: { items: readonly Beat[] }) {
  const v = useVariant("thesis", THESIS_VARIANTS, "glass");

  return (
    <div className={`${styles.wrap} ${styles[v]}`} data-thesis={v}>
      {v === "glass" && (
        <svg className={styles.svgDefs} aria-hidden width="0" height="0">
          <filter id="waterLens" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="7" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="18s"
                values="0.009 0.013;0.013 0.009;0.009 0.013"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      {items.map((t, i) => (
        <ThesisBeat key={t.label} variant={v} beat={t} i={i} />
      ))}
    </div>
  );
}
