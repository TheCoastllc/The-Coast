"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates the leading number of a stat value ("50+" -> 0..50+, "98%" -> 0..98%)
 * once when scrolled into view, then flashes the value gold for a beat.
 * Values with no leading number (e.g. "2-6 wk") skip counting and simply reveal.
 * Reduced-motion renders the final value immediately.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/^(\d+)([\s\S]*)$/);
    if (!match) return; // non-numeric value: leave as rendered

    const target = parseInt(match[1], 10);
    const suffix = match[2] ?? "";
    const state = { n: 0 };

    const ctx = gsap.context(() => {
      el.textContent = `0${suffix}`;
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(state, {
            n: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(state.n)}${suffix}`;
            },
            onComplete: () => {
              gsap.fromTo(
                el,
                { color: "#e6b24d", textShadow: "0 0 22px rgba(230,178,77,0.55)" },
                { color: "", textShadow: "", duration: 0.9, ease: "power2.out", clearProps: "color,textShadow" }
              );
            },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
