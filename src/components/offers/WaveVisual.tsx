"use client";

import { useRef, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { useDesktopOnlyWebGL, useHeroMountTrigger, useInView, useReducedMotion } from "@/lib/perf";
import styles from "./WaveVisual.module.css";

export const WAVE_VARIANTS = ["rising", "water", "chart"] as const;
export type WaveVariant = (typeof WAVE_VARIANTS)[number];

type Tier = { name: string; w: number };

const WaveWater = dynamic(() => import("./WaveWater").then((m) => ({ default: m.WaveWater })), {
  ssr: false,
});

type Props = {
  variant?: WaveVariant;
  score: number;
  waveName: string;
  scale: readonly Tier[];
};

/**
 * Default treatment: a real wave that swells and climbs from Stranded to
 * Lighthouse, the water rising to fill the brand's score, the active tier lit.
 * GPU-composited CSS (div + repeating SVG-background wave, translate3d) - renders
 * and animates on every device; static under reduced motion.
 */
function RisingWave({ score }: { score: number }) {
  const pct = Math.max(8, Math.min(100, score));
  return (
    <div className={styles.risingPanel}>
      <div className={styles.risingFill} style={{ "--fill": `${pct}%` } as CSSProperties}>
        <div className={styles.risingCaustic} aria-hidden />
        <div className={`${styles.risingSurf} ${styles.risingSurf3}`} aria-hidden />
        <div className={`${styles.risingSurf} ${styles.risingSurf2}`} aria-hidden />
        <div className={`${styles.risingSurf} ${styles.risingSurf1}`} aria-hidden />
      </div>
    </div>
  );
}

/** Refined version of the original instrument: ascending tier bars + a crest that
 *  draws across them on view. CSS-animated, no JS. */
function ChartWave({ waveName, scale }: Omit<Props, "variant" | "score">) {
  return (
    <svg
      className={styles.chart}
      viewBox="0 0 320 200"
      role="img"
      aria-label="The five Wave Rating tiers, weakest to strongest"
    >
      <defs>
        <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8B3A3A" />
          <stop offset="0.45" stopColor="#e6b24d" />
          <stop offset="1" stopColor="#7fd3c7" />
        </linearGradient>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(127,211,199,0.18)" />
          <stop offset="1" stopColor="rgba(127,211,199,0)" />
        </linearGradient>
      </defs>
      {scale.map((tier, i) => {
        const x = 18 + i * 58;
        const h = 18 + tier.w * 22;
        const y = 168 - h;
        const isResult = tier.name === waveName;
        const active = i >= 3 || isResult;
        return (
          <g key={tier.name} className={styles.chartBar} style={{ "--d": `${i * 0.1}s` } as CSSProperties}>
            <rect
              x={x}
              y={y}
              width={34}
              height={h}
              rx={4}
              fill={active ? "rgba(230,178,77,0.14)" : "rgba(118,130,142,0.1)"}
              stroke={isResult ? "#e6b24d" : active ? "rgba(230,178,77,0.6)" : "rgba(118,130,142,0.3)"}
              strokeWidth={isResult ? 2 : 1}
            />
            <circle cx={x + 17} cy={y - 9} r={isResult ? 3 : 2.2} fill={active ? "#e6b24d" : "#76828e"} />
          </g>
        );
      })}
      <path
        className={styles.chartCrest}
        d="M6 150 C 60 150, 80 96, 120 90 C 168 83, 196 58, 248 44 C 286 34, 304 26, 318 22"
        fill="none"
        stroke="url(#chartStroke)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M6 150 C 60 150, 80 96, 120 90 C 168 83, 196 58, 248 44 C 286 34, 304 26, 318 22 L318 168 L6 168 Z"
        fill="url(#chartFill)"
        opacity={0.7}
      />
    </svg>
  );
}

/** Water variant: real WebGL water on capable desktops (after interaction, in view);
 *  the rising wave is the base + the graceful fallback on mobile / reduced-motion. */
function WaterVariant({ score }: { score: number }) {
  const allowed = useDesktopOnlyWebGL();
  const trigger = useHeroMountTrigger();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "30% 0px");

  if (reduced || !allowed) return <RisingWave score={score} />;

  return (
    <div ref={ref} className={styles.waterPanel}>
      {trigger && inView ? <WaveWater /> : <RisingWave score={score} />}
    </div>
  );
}

export function WaveVisual({ variant = "rising", score, waveName, scale }: Props) {
  const graphic =
    variant === "chart" ? (
      <ChartWave waveName={waveName} scale={scale} />
    ) : variant === "water" ? (
      <WaterVariant score={score} />
    ) : (
      <RisingWave score={score} />
    );
  return (
    <div className={styles.wrap}>
      {graphic}
      <ol className={styles.risingScale}>
        {scale.map((t) => (
          <li
            key={t.name}
            className={`${styles.risingTier} ${t.name === waveName ? styles.risingTierOn : ""}`}
          >
            <span className={styles.risingDot} />
            {t.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
