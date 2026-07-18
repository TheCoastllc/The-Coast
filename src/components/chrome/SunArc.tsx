"use client";

import { useEffect, useRef } from "react";
import { useVariant } from "@/components/visuals/useVariant";
import styles from "./SunArc.module.css";

/* ============================================================
   The Daylight Engine - the sun rising becomes the site's spine.
   Scroll progress -> time of day. One rAF publisher writes
   precomputed channels as CSS custom properties; a single fixed
   wash layer + a persistent sun disc consume them.
   TEMP build-off: ?sun=day|circle|golden (current = engine off).
   ============================================================ */

const SUN_MODES = ["current", "day", "circle", "golden"] as const;

type Phase = "predawn" | "firstlight" | "sunrise" | "golden" | "highsun" | "sunset";

const PHASE_LABEL: Record<Phase, string> = {
  predawn: "Before dawn",
  firstlight: "First light",
  sunrise: "Sunrise",
  golden: "Golden hour",
  highsun: "High sun",
  sunset: "Golden sunset",
};

function phaseFor(day: number, late: boolean): Phase {
  if (late) return "sunset";
  if (day < 0.14) return "predawn";
  if (day < 0.34) return "firstlight";
  if (day < 0.56) return "sunrise";
  if (day < 0.8) return "golden";
  return "highsun";
}

export function SunArc() {
  const mode = useVariant("sun", SUN_MODES, "current");
  const sunRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "current") {
      root.style.setProperty("--wash-rose", "0");
      root.style.setProperty("--wash-gold", "0");
      root.style.setProperty("--wash-bright", "0");
      root.style.setProperty("--wash-ember", "0");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const apply = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, window.scrollY / max);

      // the arc: how far into the day we are (0 night -> 1 full day)
      let day = p;
      let late = false; // circle mode's descent into sunset
      if (mode === "circle") {
        if (p < 0.55) {
          day = p / 0.55;
        } else {
          const d = (p - 0.55) / 0.45;
          day = 1 - d * 0.62; // descend toward a warm evening, never full night
          late = d > 0.35;
        }
      } else if (mode === "golden") {
        day = 0.52 + 0.1 * Math.sin(p * Math.PI); // live inside the hour
      }

      // precomputed wash channels (CSS can't multiply var*var)
      const rose = Math.max(0, day * (1 - day) * 4) * (late ? 0.4 : 1); // peaks at dawn
      const gold = Math.pow(day, 1.3) * (late ? 1.25 : 1);
      const bright = mode === "day" ? Math.pow(day, 2.2) : mode === "golden" ? 0.12 : late ? 0.05 : Math.pow(day, 2.2) * 0.7;
      const ember = late ? Math.min(1, (0.55 - day) * 1.8 + 0.55) : 0;

      root.style.setProperty("--day", day.toFixed(3));
      root.style.setProperty("--wash-rose", (rose * 0.6).toFixed(3));
      root.style.setProperty("--wash-gold", (gold * 0.55).toFixed(3));
      root.style.setProperty("--wash-bright", (bright * 0.4).toFixed(3));
      root.style.setProperty("--wash-ember", (ember * 0.5).toFixed(3));

      const phase = phaseFor(day, late);
      if (root.dataset.sunPhase !== phase) {
        root.dataset.sunPhase = phase;
        if (chipRef.current) chipRef.current.textContent = PHASE_LABEL[phase];
      }

      // the persistent sun: takes over once the hero stage has retired (~2.9vh)
      const vh = window.innerHeight || 1;
      const handoff = Math.min(1, Math.max(0, (window.scrollY / vh - 2.9) / 0.5));
      if (sunRef.current) {
        const x = 8 + day * 80; // vw across the sky
        const alt = mode === "circle" ? Math.sin(Math.min(1, p / 0.9) * Math.PI) : day;
        const y = 30 - 22 * alt; // vh: higher day = higher sun
        const scale = 0.7 + day * 0.7 + (late ? 0.35 : 0);
        sunRef.current.style.transform = `translate(${x}vw, ${y}vh) scale(${scale})`;
        sunRef.current.style.opacity = String(handoff * (0.5 + day * 0.5));
      }
      if (chipRef.current) chipRef.current.style.opacity = String(handoff);
    };

    if (reduce) {
      // static mid-morning: graded, sun parked, no listener
      window.requestAnimationFrame(() => {
        root.style.setProperty("--day", "0.6");
        root.style.setProperty("--wash-rose", "0.2");
        root.style.setProperty("--wash-gold", "0.3");
        root.style.setProperty("--wash-bright", "0.12");
        root.style.setProperty("--wash-ember", "0");
        root.dataset.sunPhase = "golden";
      });
      return;
    }

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete root.dataset.sunPhase;
    };
  }, [mode]);

  if (mode === "current") return null;

  return (
    <>
      {/* one wash layer grades the whole page from the --wash channels */}
      <div className={styles.wash} aria-hidden />
      {/* the sun itself, climbing the sky as the page scrolls */}
      <div ref={sunRef} className={styles.sun} aria-hidden>
        <span className={styles.sunCore} />
      </div>
      <span ref={chipRef} className={styles.chip} aria-hidden>
        Before dawn
      </span>
    </>
  );
}
