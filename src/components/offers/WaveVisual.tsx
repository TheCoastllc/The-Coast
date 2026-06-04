"use client";

import { useRef, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { useDesktopOnlyWebGL, useHeroMountTrigger, useInView, useReducedMotion } from "@/lib/perf";
import styles from "./WaveVisual.module.css";

export const WAVE_VARIANTS = ["swell", "crest", "curl", "rising", "water", "chart"] as const;
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

/** score (0-100) -> how high the water sits in the panel. */
const level = (score: number) => Math.max(0.16, Math.min(0.94, score / 100));

/** SWELL - layered rolling ocean swells drifting across the panel, the water body
 *  rising to the brand's score. Each band tiles (640-wide path over a 320 viewBox)
 *  and drifts seamlessly. Pure SVG + CSS - renders + animates on every device. */
function SwellWave({ score }: { score: number }) {
  const lift = { ["--lift" as string]: `${(0.6 - level(score)) * 130}px` } as CSSProperties;
  return (
    <div className={styles.wavePanel}>
      <svg className={styles.waveSvg} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="swFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f74b4" />
            <stop offset="0.5" stopColor="#0e3056" />
            <stop offset="1" stopColor="#040f1e" />
          </linearGradient>
        </defs>
        <g className={styles.swellLift} style={lift}>
          <g className={styles.swellBack}>
            <path d="M0 104 C 53 90 107 90 160 104 C 213 118 267 118 320 104 C 373 90 427 90 480 104 C 533 118 587 118 640 104 L640 240 L0 240 Z" fill="#0c2c4a" opacity="0.55" />
          </g>
          <g className={styles.swellMid}>
            <path d="M0 116 C 47 99 93 99 140 116 C 187 133 233 133 280 116 C 327 99 373 99 420 116 C 467 133 513 133 560 116 L560 240 L0 240 Z" fill="#1a4e88" opacity="0.82" />
          </g>
          <g className={styles.swellFront}>
            <path d="M0 130 C 60 108 100 108 160 130 C 220 152 260 152 320 130 C 380 108 420 108 480 130 C 540 152 580 152 640 130 L640 240 L0 240 Z" fill="url(#swFill)" />
            <path className={styles.swellCrest} d="M0 130 C 60 108 100 108 160 130 C 220 152 260 152 320 130 C 380 108 420 108 480 130 C 540 152 580 152 640 130" fill="none" stroke="#a9eae0" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** CREST - a single elegant swell rising to a luminous, foam-tipped peak. */
function CrestWave({ score }: { score: number }) {
  const lift = { ["--lift" as string]: `${(0.6 - level(score)) * 120}px` } as CSSProperties;
  return (
    <div className={styles.wavePanel}>
      <svg className={styles.waveSvg} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="crFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f74b4" />
            <stop offset="0.55" stopColor="#0e3056" />
            <stop offset="1" stopColor="#040f1e" />
          </linearGradient>
          <radialGradient id="crFoam" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(220,247,242,0.95)" />
            <stop offset="1" stopColor="rgba(220,247,242,0)" />
          </radialGradient>
        </defs>
        <g className={styles.crestBob} style={lift}>
          <path d="M0 158 C 52 158 92 74 154 66 C 214 59 266 104 320 92 L320 240 L0 240 Z" fill="url(#crFill)" />
          <path className={styles.crestLine} d="M0 158 C 52 158 92 74 154 66 C 214 59 266 104 320 92" fill="none" stroke="#a9eae0" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse className={styles.crestFoam} cx="150" cy="66" rx="30" ry="9" fill="url(#crFoam)" />
          <circle className={styles.spray1} cx="138" cy="50" r="2.2" fill="#dff6f1" />
          <circle className={styles.spray2} cx="164" cy="46" r="1.6" fill="#dff6f1" />
          <circle className={styles.spray3} cx="151" cy="38" r="1.9" fill="#dff6f1" />
        </g>
      </svg>
    </div>
  );
}

/** CURL - a breaking wave: the face rises and the lip curls over into a barrel,
 *  foam on the crest + a little spray. The most iconic "wave". */
function CurlWave(_props: { score: number }) {
  return (
    <div className={styles.wavePanel}>
      <svg className={styles.waveSvg} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="cuFace" x1="0.1" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#3a86c8" />
            <stop offset="0.5" stopColor="#13427c" />
            <stop offset="1" stopColor="#061a33" />
          </linearGradient>
          <linearGradient id="cuBarrel" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#020b16" />
            <stop offset="1" stopColor="#0f3a66" />
          </linearGradient>
        </defs>
        <g className={styles.curlGroup}>
          {/* still water */}
          <path d="M0 168 C 70 160 110 162 150 166 C 210 172 270 168 320 160 L320 240 L0 240 Z" fill="#08233f" opacity="0.7" />
          {/* the wave face + curling lip */}
          <path
            d="M40 240 C 30 170 60 96 140 70 C 196 52 252 64 286 96 C 256 78 214 80 192 108 C 176 130 188 156 218 156 C 244 156 256 132 240 116 C 268 128 286 154 300 240 Z"
            fill="url(#cuFace)"
          />
          {/* barrel hollow */}
          <path
            d="M140 70 C 196 52 252 64 286 96 C 256 78 214 80 192 108 C 176 130 188 156 218 156 C 190 150 168 128 176 102 C 184 80 160 72 140 70 Z"
            fill="url(#cuBarrel)"
            opacity="0.85"
          />
          {/* foam lip */}
          <path className={styles.curlFoam} d="M138 70 C 200 50 256 64 290 96" fill="none" stroke="#e2f6f1" strokeWidth="3.4" strokeLinecap="round" />
          <circle className={styles.spray1} cx="168" cy="54" r="2.4" fill="#e2f6f1" />
          <circle className={styles.spray2} cx="214" cy="48" r="1.8" fill="#e2f6f1" />
          <circle className={styles.spray3} cx="258" cy="60" r="2.1" fill="#e2f6f1" />
        </g>
      </svg>
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

export function WaveVisual({ variant = "swell", score, waveName, scale }: Props) {
  const graphic =
    variant === "swell" ? (
      <SwellWave score={score} />
    ) : variant === "crest" ? (
      <CrestWave score={score} />
    ) : variant === "curl" ? (
      <CurlWave score={score} />
    ) : variant === "chart" ? (
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
