"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PaintSweep.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Full-bleed brand-story band: the tri-color brush stroke is "painted" across
 * the viewport by a scroll-scrubbed clip-path wipe (left to right) while the
 * plate drifts slightly - as if the stroke happens live as you pass it.
 * Decorative (aria-hidden); reduced-motion shows the full painting statically.
 */
export function PaintSweep() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { clipPath: "inset(0 92% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top 88%", end: "center 45%", scrub: 0.4 },
        }
      );
      gsap.fromTo(
        img,
        { xPercent: -4, scale: 1.06 },
        {
          xPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`section ${styles.band}`} aria-hidden="true">
      <div ref={wrapRef} className={styles.frame}>
        <div
          ref={imgRef}
          className={styles.plate}
          style={{ backgroundImage: "url(/story/paint-sweep.jpg)" }}
        />
      </div>
    </section>
  );
}
