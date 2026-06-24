"use client";

import { useEffect, useRef } from "react";
import { COMPANY } from "@/lib/content/coast";
import styles from "./StoryHeadline.module.css";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * Fixed, scroll-scrubbed headline that morphs across the story in three beats:
 *   "The Coast" -> "Design The Future" -> the promise tagline,
 * then clears out before the page content arrives. The tagline lands last, as
 * the boat meets the sun. Reads the same progress formula as StoryHero.
 */
export function StoryHeadline() {
  const aRef = useRef<HTMLParagraphElement>(null);
  const bRef = useRef<HTMLParagraphElement>(null);
  const cRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (aRef.current) aRef.current.style.opacity = "0";
      if (bRef.current) bRef.current.style.opacity = "0";
      if (cRef.current) cRef.current.style.opacity = "1";
      if (cueRef.current) cueRef.current.style.opacity = "0";
      return;
    }

    let raf = 0;
    const apply = () => {
      const span = (window.innerHeight || 1) * 2.4;
      const p = clamp01(window.scrollY / span);

      // beat 1 - "The Coast" leaves
      const aOut = smoothstep(0.16, 0.32, p);
      if (aRef.current) {
        aRef.current.style.opacity = String(1 - aOut);
        aRef.current.style.transform = `translateY(${-50 * aOut}px)`;
        aRef.current.style.filter = `blur(${10 * aOut}px)`;
      }

      // beat 2 - "Design The Future" arrives, then leaves
      const bIn = smoothstep(0.26, 0.42, p);
      const bOut = smoothstep(0.52, 0.66, p);
      if (bRef.current) {
        bRef.current.style.opacity = String(bIn * (1 - bOut));
        bRef.current.style.transform = `translateY(${50 * (1 - bIn) - 50 * bOut}px)`;
        bRef.current.style.filter = `blur(${10 * (1 - bIn) + 10 * bOut}px)`;
      }

      // beat 3 - the promise rises and holds as the finale
      const cIn = smoothstep(0.64, 0.8, p);
      const cOut = smoothstep(0.92, 0.99, p);
      if (cRef.current) {
        cRef.current.style.opacity = String(cIn * (1 - cOut));
        cRef.current.style.transform = `translateY(${36 * (1 - cIn) - 36 * cOut}px)`;
        cRef.current.style.filter = `blur(${8 * (1 - cIn) + 8 * cOut}px)`;
      }

      if (cueRef.current) cueRef.current.style.opacity = String(1 - smoothstep(0, 0.07, p));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden>
      <div className={styles.stack}>
        {/* Decorative, scroll-scrubbed morph phrases (the whole wrap is
            aria-hidden). These are NOT the page heading - the real, crawlable
            <h1> lives in HomeOcean so the homepage has exactly one keyword-
            bearing h1. */}
        <p ref={aRef} className={`${styles.phrase} no-marble`}>
          The Coast
        </p>
        <p ref={bRef} className={`${styles.phrase} ${styles.phraseB} no-marble`}>
          Design The Future
        </p>
        <p ref={cRef} className={`${styles.phrase} ${styles.phraseC}`}>
          {COMPANY.promise}.
        </p>
      </div>
      <span ref={cueRef} className={styles.cue}>
        Scroll
      </span>
    </div>
  );
}
