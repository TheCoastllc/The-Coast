"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Plate.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * An editorial image staged as an archival artifact (ironhill-style): a slide /
 * plate mount with a catalog label + caption, slightly tilted, that settles in
 * on scroll and parallax-drifts at its own speed. Full image color - no filter.
 */
export function Plate({
  src,
  code,
  title,
  meta,
  tilt = 0,
  parallax = 7,
  enter = "bottom",
  className,
}: {
  src: string;
  code: string;
  title: string;
  meta: string;
  tilt?: number;
  parallax?: number;
  enter?: "left" | "right" | "bottom" | "scale" | "rotate";
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // each plate enters from a different direction, settling into its tilt
      const FROM: Record<string, gsap.TweenVars> = {
        left: { opacity: 0, xPercent: -65, rotate: tilt + 4, filter: "blur(6px)" },
        right: { opacity: 0, xPercent: 65, rotate: tilt - 4, filter: "blur(6px)" },
        bottom: { opacity: 0, y: 110, rotate: tilt, filter: "blur(6px)" },
        scale: { opacity: 0, scale: 0.78, rotate: tilt, filter: "blur(6px)" },
        rotate: { opacity: 0, y: 80, rotate: tilt - 14, filter: "blur(6px)" },
      };
      gsap.fromTo(
        inner.current,
        FROM[enter] ?? FROM.bottom,
        {
          opacity: 1,
          xPercent: 0,
          x: 0,
          y: 0,
          scale: 1,
          rotate: tilt,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: outer.current, start: "top 85%", once: true },
        }
      );
      // parallax drift across the whole scroll of the section
      gsap.fromTo(
        outer.current,
        { yPercent: -parallax },
        {
          yPercent: parallax,
          ease: "none",
          scrollTrigger: { trigger: outer.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, outer);
    return () => ctx.revert();
  }, [tilt, parallax, enter]);

  return (
    <div ref={outer} className={`${styles.plate} ${className ?? ""}`}>
      <div ref={inner} className={styles.inner} style={{ rotate: `${tilt}deg` }} data-cursor-label="View">
        <div className={styles.labelStrip}>
          <span>{code}</span>
          <span className={styles.a}>A</span>
        </div>
        <div className={styles.frame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={title} className={styles.img} loading="lazy" decoding="async" />
        </div>
        <div className={styles.caption}>
          <span className={styles.title}>{title}</span>
          <span className={styles.meta}>{meta}</span>
        </div>
      </div>
    </div>
  );
}
