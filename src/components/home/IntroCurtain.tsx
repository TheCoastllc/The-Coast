"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/chrome/Mark";
import styles from "./IntroCurtain.module.css";

/**
 * Premium intro: a full-screen cinematic curtain that opens the experience and
 * lifts to reveal the hero. The Coast lockup + a gold horizon line + a tagline,
 * then it fades/rises away after a beat. Skippable (click / scroll / key) and
 * skipped entirely under reduced-motion. Shown on every full load of the home.
 */
export function IntroCurtain() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const done = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone");
      return;
    }
    document.documentElement.style.overflow = "hidden"; // hold the page while the curtain is up

    const leave = () => {
      if (done.current) return;
      done.current = true;
      document.documentElement.style.overflow = "";
      setPhase("out");
      window.setTimeout(() => setPhase("gone"), 1150); // match the exit transition
    };

    const auto = window.setTimeout(leave, 2600);
    const opts = { passive: true } as const;
    window.addEventListener("pointerdown", leave);
    window.addEventListener("wheel", leave, opts);
    window.addEventListener("touchstart", leave, opts);
    window.addEventListener("keydown", leave);
    return () => {
      clearTimeout(auto);
      document.documentElement.style.overflow = "";
      window.removeEventListener("pointerdown", leave);
      window.removeEventListener("wheel", leave);
      window.removeEventListener("touchstart", leave);
      window.removeEventListener("keydown", leave);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`${styles.curtain} ${phase === "out" ? styles.out : ""}`} aria-hidden>
      <div className={styles.inner}>
        <span className={styles.markWrap}>
          <Mark size={70} />
        </span>
        <span className={styles.line} />
        <span className={styles.tag}>Design the Future</span>
      </div>
      <span className={styles.coords}>28.0000°N · 50.0000°W</span>
      <span className={styles.enter}>Enter</span>
    </div>
  );
}
