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
};

const TO: Record<RevealVariant, gsap.TweenVars> = {
  "mask-wipe": { clipPath: "inset(0 0% 0 0)", duration: 1.15, ease: "power4.inOut" },
  "rise-blur": { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" },
  "scale-in": { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" },
  "parallax-slide": { xPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
  "rotate3d": { rotateY: 0, y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
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

    return () => ctx.revert();
  }, [variant, delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
}
