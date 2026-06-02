"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import styles from "./Wave.module.css";

function hLine(y: number, amp: number, waves: number, phase: number) {
  const N = 110;
  let d = `M 0 ${(y + amp * Math.sin(phase)).toFixed(2)}`;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    const x = (t * 100).toFixed(2);
    const yy = (y + amp * Math.sin(t * waves * 2 * Math.PI + phase)).toFixed(2);
    d += ` L ${x} ${yy}`;
  }
  return d;
}

/** IDEA 2 - "Wave field": stacked contour lines, like a topographic sea. */
export function WaveField() {
  const ref = useRef<SVGSVGElement>(null);
  const lines = useMemo(() => {
    const arr: { d: string; o: number }[] = [];
    const count = 34;
    for (let i = 0; i < count; i++) {
      const y = (i + 0.5) * (1000 / count);
      arr.push({ d: hLine(y, 7, 3, i * 0.55), o: 0.1 + (i % 4 === 0 ? 0.08 : 0) });
    }
    return arr;
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(`.${styles.field}`, { x: 10, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <svg ref={ref} className={styles.layer} viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden>
      <g className={styles.field}>
        {lines.map((l, i) => (
          <path key={i} d={l.d} fill="none" stroke="var(--color-accent)" strokeWidth="0.65" opacity={l.o} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
