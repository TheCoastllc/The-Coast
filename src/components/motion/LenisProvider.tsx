"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Smooth scroll for the whole app, integrated with GSAP:
 *  - Lenis is driven by GSAP's single ticker (one shared rAF loop, less overhead)
 *  - ScrollTrigger.update runs on every Lenis scroll, so parallax + reveals
 *    track the smooth scroll with zero lag
 *  - lagSmoothing(0) keeps scroll-linked motion aligned to scroll position even
 *    when a weak device drops frames
 *  - prefers-reduced-motion falls back to native scroll
 */
export function LenisProvider() {
  const pathname = usePathname();

  /* Route-change re-measure. Declared FIRST so it runs before the Lenis effect
   * below re-creates the instance. ScrollTrigger caches every trigger's start/
   * end against the document it measured; after a client-side navigation swaps
   * the page it can still be holding the PREVIOUS page's geometry, so reveal
   * triggers may never fire and content stays at opacity 0 - the "blank page
   * until refresh" defect. This runs on EVERY navigation, deliberately outside
   * the early-returns below, because reduced-motion, touch and /portal all skip
   * Lenis but still have reveals that need correct measurements. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    // after the new DOM paints, then again once fonts/images settle
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices keep crisp native scroll - Lenis smoothing layered over native
    // momentum is what causes the jank on phones.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // App-like areas keep native scroll (forms, file lists, dashboards).
    if (pathname && (pathname.startsWith("/portal") || pathname.startsWith("/studio"))) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // touch left native (no syncTouch) so phones stay crisp + responsive
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
