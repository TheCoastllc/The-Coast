"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: "mount" | "scroll";
  scrollStart?: string;
};

/**
 * Splits text into per-character <span>s and animates them in.
 * - trigger="mount" plays once on mount
 * - trigger="scroll" plays when the element enters the viewport
 */
export function CharReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.035,
  trigger = "scroll",
  scrollStart = "top 80%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>(".char");
    gsap.set(chars, { opacity: 0, y: 28, filter: "blur(10px)" });

    const animation = {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.9,
      stagger,
      ease: "power3.out",
      delay,
    };

    if (trigger === "mount") {
      gsap.to(chars, animation);
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: scrollStart,
        once: true,
        onEnter: () => gsap.to(chars, animation),
      });
    }
  }, [delay, stagger, trigger, scrollStart]);

  const chars = Array.from(children).map((ch, i) => (
    <span key={i} className="char">
      {ch === " " ? " " : ch}
    </span>
  ));

  return (
    <Tag ref={ref as never} className={className}>
      {chars}
    </Tag>
  );
}
