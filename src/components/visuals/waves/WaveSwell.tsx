"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import styles from "./Wave.module.css";

// a filled wavy vertical ribbon (a swell), not a line
function ribbon(h: number, x0: number, w: number, amp: number, waves: number, phase: number) {
  const N = 170;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = (t * h).toFixed(1);
    const xl = (x0 + amp * Math.sin(t * waves * 2 * Math.PI + phase)).toFixed(2);
    d += i === 0 ? `M ${xl} ${y}` : ` L ${xl} ${y}`;
  }
  for (let i = N; i >= 0; i--) {
    const t = i / N;
    const y = (t * h).toFixed(1);
    const xr = (x0 + w + amp * Math.sin(t * waves * 2 * Math.PI + phase + 0.8)).toFixed(2);
    d += ` L ${xr} ${y}`;
  }
  return d + " Z";
}

/** IDEA 1 - "Swell": a bold, filled, flowing wave ribbon (gradient water). */
export function WaveSwell() {
  const ref = useRef<SVGSVGElement>(null);

  const bands = useMemo(
    () => ({
      b1: ribbon(1000, 42, 16, 15, 5.5, 0),
      b2: ribbon(1000, 36, 26, 22, 4.5, 1.4),
      // teal companion swell, offset and phased so it flows beside the orange
      teal: ribbon(1000, 54, 18, 18, 5.0, 2.3),
    }),
    []
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(`.${styles.b1}`, { x: 16, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(`.${styles.b2}`, { x: -20, duration: 8.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(`.${styles.b3}`, { x: 22, duration: 7.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} className={styles.layer} viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="swellGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="swellTeal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-teal)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-teal)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--color-teal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className={styles.b1} d={bands.b1} fill="url(#swellGrad)" opacity={0.26} />
      <path className={styles.b2} d={bands.b2} fill="url(#swellGrad)" opacity={0.13} />
      <path className={styles.b3} d={bands.teal} fill="url(#swellTeal)" opacity={0.22} />
    </svg>
  );
}
