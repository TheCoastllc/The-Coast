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
// Phones: light enough to run the REAL WebGL hero smoothly - no postfx, low geo, capped DPR.
const MOBILE: Quality = { tier: "low", dpr: [1, 1.5], seaSegments: 54, postfx: false, clouds: 3 };

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

/** Quality for the HERO canvas: a light MOBILE profile on touch devices, the full
 *  detected tier on desktop - so the real WebGL hero runs fast on phones. */
export function useHeroQuality(): Quality {
  const [q, setQ] = useState<Quality>(MID);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setQ(window.matchMedia("(pointer: coarse)").matches ? MOBILE : detect());
  }, []);
  return q;
}

/**
 * Whether to load the HERO WebGL. Allowed on mobile too (the hero runs a light
 * MOBILE profile via useHeroQuality) and is lazy-loaded so the static hero paints
 * first. Only reduced-motion / data-saver opt out. SSR-safe (false until mounted).
 */
export function useWebGLAllowed(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    setOk(!reduced && !saveData);
  }, []);
  return ok;
}

/**
 * Whether to load SECONDARY / ambient WebGL (chamber motes, the folding-boat
 * finale). Capable desktops only - phones spend their whole budget on the hero.
 */
export function useDesktopOnlyWebGL(): boolean {
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
 * True once the page has finished its initial load AND the main thread goes idle.
 * Used to defer mounting heavy WebGL (chunk download + shader compile + GPU init)
 * OFF the critical load path - so first paint / LCP / TBT are never taxed by it.
 * The crisp CSS hero shows instantly; the real WebGL fades in a beat later. Has a
 * hard timeout fallback so it always eventually fires. SSR-safe (false until idle).
 */
export function useIdleReady(timeout = 2200): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let done = false;
    const cap = { id: 0 as number | ReturnType<typeof setTimeout> };
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    const schedule = () => {
      const ric = (
        window as Window & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback;
      if (ric) ric(go, { timeout });
      else setTimeout(go, 200);
    };
    // wait for the load event so first paint + LCP land before three.js touches the CPU
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    // hard cap: never let the hero hang on a busy thread that never goes idle
    cap.id = setTimeout(go, timeout + 1800);
    return () => clearTimeout(cap.id as ReturnType<typeof setTimeout>);
  }, [timeout]);
  return ready;
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
