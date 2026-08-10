"use client";

import { useEffect, useRef } from "react";
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
  const firstRun = useRef(true);

  /* Land every client-side navigation at the top of the new page.
   *
   * GSAP's ScrollTrigger.refresh() - fired by RevealGroup when a chamber page
   * mounts - records a scroll offset, jumps to 0 to measure, then writes the
   * recorded offset back. After a route change that recorded value is the
   * PREVIOUS page's offset, clamped to the new (shorter) page's maximum, so
   * the new route opened scrolled to its own footer. An external QA audit
   * filed that as four Critical "page is blank until I refresh" defects
   * (/services, /about, /locations, /offers); the content was always rendered,
   * the viewport was just at the bottom of it. clearScrollMemory() alone does
   * not help because refresh() re-records after it, so instead we re-assert
   * the intended position after GSAP's write has landed.
   *
   * Declared FIRST and deliberately OUTSIDE the early-returns below: the
   * defect also reproduced on touch viewports, where Lenis bails out but GSAP
   * still runs. Skipped on first mount so hard loads, in-place refreshes and
   * #anchor deep links keep their scroll position. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (window.location.hash) return;
    const toTop = () => window.scrollTo(0, 0);
    toTop();
    const raf = requestAnimationFrame(toTop);
    const afterRefresh = window.setTimeout(toTop, 360);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(afterRefresh);
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
