"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FillText.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Headline that fills word-by-word with color as the block scrolls through
 * (ironhill's signature). Words start dim and brighten on scrub.
 */
export function FillText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(`.${styles.word}`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [text]);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className={styles.word}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
