"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollThread.module.css";

const BUOYS = [0.18, 0.36, 0.54, 0.72, 0.9];

/**
 * The plotted voyage course on the right edge: a dashed rhumb line, waypoint
 * buoys, and the boat as a position marker that descends as you scroll.
 */
export function ScrollThread() {
  const barRef = useRef<HTMLDivElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
        if (boatRef.current) boatRef.current.style.top = `${p * 100}%`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden>
      <div className={styles.course} />
      <div ref={barRef} className={styles.bar} />
      {BUOYS.map((b) => (
        <span key={b} className={styles.buoy} style={{ top: `${b * 100}%` }} />
      ))}
      <div ref={boatRef} className={styles.boat}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/story/coast-one-side.png" alt="" width={34} height={34} />
      </div>
    </div>
  );
}
