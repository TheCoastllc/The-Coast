"use client";

import { useEffect } from "react";
import { usePremiumActive } from "./usePremium";

/**
 * Premium "lamp-glow": as the pointer moves over a .glass card, set --mx/--my on
 * that card so the CSS radial highlight (globals.css) follows the cursor.
 * Hover-delegated + rAF-throttled = one card at a time, perf-safe.
 */
export function CardLampGlow() {
  const active = usePremiumActive();
  useEffect(() => {
    if (!active.has("lampglow")) return;
    let raf = 0;
    let last: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.(".glass") as HTMLElement | null;
      if (!card) return;
      last = card;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!last) return;
        const r = last.getBoundingClientRect();
        last.style.setProperty("--mx", `${e.clientX - r.left}px`);
        last.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active]);
  return null;
}
