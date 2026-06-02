"use client";

import { RefObject, useEffect, useRef, useState } from "react";

/**
 * Adaptive quality so the WebGL scenes stay smooth on weak/old devices.
 * Tier is detected once on mount from cores / memory / pointer / DPR.
 */
export type Quality = {
  tier: "low" | "mid" | "high";
  dpr: [number, number];
  seaSegments: number;
  postfx: boolean;
  clouds: number;
};

const HIGH: Quality = { tier: "high", dpr: [1, 2], seaSegments: 190, postfx: true, clouds: 6 };
const MID: Quality = { tier: "mid", dpr: [1, 2], seaSegments: 130, postfx: true, clouds: 5 };
const LOW: Quality = { tier: "low", dpr: [1, 1], seaSegments: 80, postfx: false, clouds: 3 };

function detect(): Quality {
  if (typeof navigator === "undefined" || typeof window === "undefined") return MID;
  const cores = navigator.hardwareConcurrency || 4;
  // deviceMemory is Chrome-only; default to a middling 4GB
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const dpr = window.devicePixelRatio || 1;

  let score = 0;
  if (cores <= 4) score += 1;
  if (cores <= 2) score += 1;
  if (mem <= 4) score += 1;
  if (mem <= 2) score += 1;
  if (coarse) score += 1; // phones/tablets
  if (dpr >= 3) score += 1; // very high-DPR taxes fill-rate

  if (score >= 4) return LOW;
  if (score >= 2) return MID;
  return HIGH;
}

export function useQuality(): Quality {
  const [q, setQ] = useState<Quality>(MID);
  useEffect(() => {
    setQ(detect());
  }, []);
  return q;
}

/**
 * True ONLY on devices that should run WebGL: a fine pointer (desktop), a
 * non-low tier, and motion allowed. SSR-safe - returns false until mounted, so
 * the heavy three.js chunk is never even requested on touch / low-end devices.
 * Gate every dynamic WebGL import behind this so phones ship zero three.js.
 */
export function useWebGLAllowed(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setOk(!reduced && !coarse && detect().tier !== "low");
  }, []);
  return ok;
}

/**
 * True while the page is scrolled within `maxViewports` of the top. Used to
 * freeze the fixed hero canvas (frameloop "never") once content covers it, so
 * it stops burning GPU cycles. Only re-renders on the boolean transition.
 */
export function useActiveByScroll(maxViewports: number): boolean {
  const [active, setActive] = useState(true);
  const cur = useRef(true);
  useEffect(() => {
    const check = () => {
      const vh = window.innerHeight || 1;
      const next = window.scrollY < vh * maxViewports;
      if (next !== cur.current) {
        cur.current = next;
        setActive(next);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [maxViewports]);
  return active;
}

/**
 * True when the referenced element is near/in the viewport. Used to run a
 * section's canvas only when it matters.
 */
export function useInView(ref: RefObject<HTMLElement | null>, rootMargin = "40% 0px"): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
