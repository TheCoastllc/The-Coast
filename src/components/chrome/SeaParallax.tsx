"use client";

import { useEffect } from "react";
import { usePremiumActive } from "./usePremium";

/**
 * Premium "depth": publishes scrollY as a --sy custom property on the root so
 * the fixed ocean backdrop (.marine) drifts with scroll for a parallax depth
 * cue. One rAF-throttled scroll listener; gated to the "depth" flag.
 */
export function SeaParallax() {
  const active = usePremiumActive();
  useEffect(() => {
    if (!active.has("depth")) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--sy", String(window.scrollY));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [active]);
  return null;
}
