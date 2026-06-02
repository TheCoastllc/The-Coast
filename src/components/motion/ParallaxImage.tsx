"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MatteImage, MatteMode } from "@/components/ui/MatteImage";
import styles from "./ParallaxImage.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * A matte image that drifts slower than the scroll (parallax), scrubbed via
 * GSAP ScrollTrigger. The inner layer is over-sized so the drift never reveals
 * an edge. Respects reduced motion.
 */
export function ParallaxImage({
  src,
  alt,
  mode,
  amount = 12,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  mode?: MatteMode;
  amount?: number;
  className?: string;
  eager?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={wrap} className={`${styles.wrap} ${className ?? ""}`}>
      <div ref={inner} className={styles.inner}>
        <MatteImage src={src} alt={alt} mode={mode} eager={eager} />
      </div>
    </div>
  );
}
