"use client";

import { useEffect, useRef } from "react";
import { useVariant } from "@/components/visuals/useVariant";
import styles from "./StageLight.module.css";

const STAGE_MODES = ["off", "on"] as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * ?stage=on build-off: theatrical stage lighting over the hero voyage - a
 * diagonal spotlight wedge from the sun's corner plus a soft floor pool where
 * the light lands (the Ciao-style "product on a lit stage" read). Pure CSS
 * gradients on two fixed layers; a single rAF scroll handler fades the rig
 * out as the hero retires so it never grades the content sections.
 */
export function StageLight() {
  const stage = useVariant("stage", STAGE_MODES, "off");
  const wedgeRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);

  // publish the flag for CSS consumers (the gradient course rail)
  useEffect(() => {
    if (stage !== "on") return;
    document.documentElement.dataset.stage = "on";
    return () => {
      delete document.documentElement.dataset.stage;
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "on") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      const vh = window.innerHeight || 1;
      const p = window.scrollY / vh;
      // full strength through the voyage, retire with the hero stage (~2.45-2.85vh)
      const strength = 1 - smoothstep(2.35, 2.8, p);
      // the wedge swings gently as the story advances - light follows the sun
      const swing = -8 + smoothstep(0, 2.2, p) * 14;
      if (wedgeRef.current) {
        wedgeRef.current.style.opacity = String(0.5 * strength);
        wedgeRef.current.style.transform = `rotate(${swing}deg)`;
      }
      if (poolRef.current) poolRef.current.style.opacity = String(0.4 * strength);
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
  }, [stage]);

  if (stage !== "on") return null;
  return (
    <>
      <div ref={wedgeRef} className={styles.wedge} aria-hidden />
      <div ref={poolRef} className={styles.pool} aria-hidden />
    </>
  );
}
