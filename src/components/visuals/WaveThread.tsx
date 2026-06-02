"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import styles from "./WaveThread.module.css";

function sinePath(h: number, amp: number, waves: number, phase: number) {
  const N = 260;
  let d = `M ${(50 + amp * Math.sin(phase)).toFixed(2)} 0`;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    const y = (t * h).toFixed(1);
    const x = (50 + amp * Math.sin(t * waves * Math.PI * 2 + phase)).toFixed(2);
    d += ` L ${x} ${y}`;
  }
  return d;
}

/**
 * Flowing waves threading down the archive (in place of a single line) - a nod
 * to the Coast. Layered sine strokes in the accent color, gently swaying, with
 * a flowing dotted "current" on the lead wave.
 */
export function WaveThread() {
  const ref = useRef<SVGSVGElement>(null);
  const paths = useMemo(
    () => [
      { d: sinePath(1000, 15, 6, 0), w: 1.5, o: 0.5, flow: true },
      { d: sinePath(1000, 11, 6, Math.PI * 0.5), w: 1, o: 0.3, flow: false },
      { d: sinePath(1000, 19, 5, Math.PI), w: 0.8, o: 0.18, flow: false },
    ],
    []
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(`.${styles.g}`, { x: 9, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(`.${styles.flow}`, { strokeDashoffset: -56, duration: 3, ease: "none", repeat: -1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} className={styles.wave} viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden>
      <g className={styles.g}>
        {paths.map((p, i) => (
          <path
            key={i}
            className={p.flow ? styles.flow : undefined}
            d={p.d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={p.w}
            opacity={p.o}
            vectorEffect="non-scaling-stroke"
            strokeDasharray={p.flow ? "2 13" : undefined}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}
