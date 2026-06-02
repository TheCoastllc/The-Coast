"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wraps chamber body content and reveals each `.section` as it scrolls into
 * view - fade + rise + de-blur. One ScrollTrigger per section, fires once.
 */
export function RevealGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".section", el);
      sections.forEach((s) => {
        gsap.set(s, { opacity: 0, y: 44, filter: "blur(6px)" });
        ScrollTrigger.create({
          trigger: s,
          start: "top 84%",
          once: true,
          onEnter: () =>
            gsap.to(s, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.1,
              ease: "power3.out",
            }),
        });
      });
      // refresh after fonts/layout settle
      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
