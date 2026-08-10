"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RevealVariant } from "./revealVariants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type { RevealVariant };

const FROM: Record<RevealVariant, gsap.TweenVars> = {
  "mask-wipe": { clipPath: "inset(0 100% 0 0)" },
  "rise-blur": { y: 64, opacity: 0, filter: "blur(12px)" },
  "scale-in": { scale: 0.82, opacity: 0 },
  "parallax-slide": { xPercent: 12, opacity: 0 },
  "rotate3d": { rotateY: 26, y: 48, opacity: 0, transformPerspective: 900 },
  "mask-up": { clipPath: "inset(102% 0 -8% 0)", y: 34 },
};

const TO: Record<RevealVariant, gsap.TweenVars> = {
  "mask-wipe": { clipPath: "inset(0 0% 0 0)", duration: 1.15, ease: "power4.inOut" },
  "rise-blur": { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" },
  "scale-in": { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" },
  "parallax-slide": { xPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
  "rotate3d": { rotateY: 0, y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
  "mask-up": { clipPath: "inset(-8% 0 -8% 0)", y: 0, duration: 1.05, ease: "power4.out" },
};

/**
 * Reveals its children once when scrolled into view, with a per-instance
 * variant so each element on the page appears in its own way (ironhill feel).
 * gsap.context + revert keeps it StrictMode-safe; fromTo is deterministic.
 */
export function Reveal({
  variant = "rise-blur",
  delay = 0,
  className,
  children,
}: {
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, FROM[variant], {
        ...TO[variant],
        delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);

    /* FAIL-SAFE - the reason an external QA audit reported "blank pages that
     * fix themselves on refresh". Every FROM state above starts the element
     * invisible (opacity 0 / clipped), so if its ScrollTrigger never fires the
     * content stays permanently hidden while sitting in the DOM. That can
     * happen after a client-side route change, when ScrollTrigger still holds
     * the previous page's geometry. An animation must never be able to
     * withhold content: if this element is on screen and still invisible
     * shortly after mount, drop the animation and show it. */
    const failsafe = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight && r.bottom > 0 && r.width > 0;
      if (onScreen && Number(getComputedStyle(el).opacity) < 0.05) {
        gsap.set(el, { clearProps: "all" });
      }
    }, 1400);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [variant, delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
}
