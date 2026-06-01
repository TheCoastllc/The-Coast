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
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
