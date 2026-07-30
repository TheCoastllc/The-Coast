"use client";

import { useEffect, useMemo, useRef } from "react";
import { COMPANY } from "@/lib/content/coast";
import { useVariant } from "@/components/visuals/useVariant";
import styles from "./StoryHeadline.module.css";

const STAGE_MODES = ["off", "on"] as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Split a phrase into word/char spans so each character can ride its own
 *  offset on the scroll scrub. Word wrappers keep natural line wrapping. */
function CharSplit({ text }: { text: string }) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className={styles.word}>
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className={`hchar ${styles.char}`}>
                {ch}
              </span>
            ))}
          </span>
          {/* the separator lives OUTSIDE the inline-block word so it can't collapse */}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/**
 * Fixed, scroll-scrubbed headline that morphs across the story in three beats:
 *   "The Coast" -> "Design The Future" -> the promise tagline.
 * Each beat is a per-character cascade (chars carry their own offset on the
 * same scrub), while blur rides the phrase wrapper so we never animate dozens
 * of filters per frame. Reads the same progress formula as StoryHero.
 */
export function StoryHeadline() {
  // ?stage=on build-off: as THE COAST ONE arrives, the promise line flips to
  // an outlined wordmark so she sails visibly THROUGH the letterforms
  // (the Ciao can-through-logo trick). Inert unless the flag is set.
  const stage = useVariant("stage", STAGE_MODES, "off");
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLParagraphElement>(null);
  const bRef = useRef<HTMLParagraphElement>(null);
  const cRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<Map<HTMLElement, HTMLElement[]>>(new Map());
  // 0->1 time ramp that cascades "The Coast" in on first paint (timed to land
  // as the intro curtain lifts), after which scroll owns the story.
  const aIntro = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (aRef.current) aRef.current.style.opacity = "0";
      if (bRef.current) bRef.current.style.opacity = "0";
      if (cRef.current) cRef.current.style.opacity = "1";
      if (cueRef.current) cueRef.current.style.opacity = "0";
      return;
    }

    const charsOf = (el: HTMLElement | null): HTMLElement[] => {
      if (!el) return [];
      const cache = charsRef.current;
      let list = cache.get(el);
      if (!list) {
        list = Array.from(el.querySelectorAll<HTMLElement>(".hchar"));
        cache.set(el, list);
      }
      return list;
    };

    /** Drive one phrase: wrapper carries opacity gate + blur, each char rides
     *  its own offset window inside the in/out progress. */
    const SPREAD = 0.45;
    const drive = (el: HTMLElement | null, tIn: number, tOut: number, lift: number) => {
      if (!el) return;
      const visible = tIn > 0.001 && tOut < 0.999;
      el.style.opacity = visible ? "1" : "0";
      el.style.filter = `blur(${10 * (1 - tIn) + 10 * tOut}px)`;
      el.style.transform = `translateY(${lift * (1 - tIn) * 0.4 - lift * tOut * 0.4}px)`;
      if (!visible) return;
      const chars = charsOf(el);
      const n = Math.max(1, chars.length - 1);
      for (let i = 0; i < chars.length; i++) {
        const off = (i / n) * SPREAD;
        const ci = clamp01((tIn * (1 + SPREAD) - off) / 1);
        const co = clamp01((tOut * (1 + SPREAD) - off) / 1);
        const eIn = ci * ci * (3 - 2 * ci);
        const eOut = co * co * (3 - 2 * co);
        chars[i].style.opacity = String(eIn * (1 - eOut));
        chars[i].style.transform = `translateY(${lift * (1 - eIn) - lift * 1.15 * eOut}px)`;
      }
    };

    let raf = 0;
    const apply = () => {
      const span = (window.innerHeight || 1) * 2.4;
      const p = clamp01(window.scrollY / span);

      // beat 1 - "The Coast" (visible on load, cascades away). A soft settle-in
      // on first paint: chars arrive over the first few percent of scroll-space
      // via an eased time ramp instead of scroll (so the page never loads blank).
      const aOut = smoothstep(0.16, 0.34, p);
      drive(aRef.current, aIntro.current, aOut, 44);

      // beat 2 - "Design The Future" arrives, then leaves
      const bIn = smoothstep(0.26, 0.46, p);
      const bOut = smoothstep(0.52, 0.68, p);
      drive(bRef.current, bIn, bOut, 48);

      // beat 3 - the promise rises and holds as the finale
      const cIn = smoothstep(0.64, 0.82, p);
      const cOut = smoothstep(0.92, 0.99, p);
      drive(cRef.current, cIn, cOut, 36);

      // ?stage=on: outline the promise while the boat crosses behind it
      if (wrapRef.current) {
        const through = stageRef.current === "on" && p > 0.74 && p < 0.94;
        if (through !== (wrapRef.current.dataset.outline === "true")) {
          wrapRef.current.dataset.outline = String(through);
        }
      }

      if (cueRef.current) cueRef.current.style.opacity = String(1 - smoothstep(0, 0.07, p));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    // Entrance ramp: cascade phrase A in over ~1.1s, starting as the curtain
    // lifts (~1.4s in). Runs its own rAF loop only until the ramp completes;
    // interaction can begin the scroll story at any time.
    let introRaf = 0;
    const t0 = performance.now();
    const introTick = (now: number) => {
      const t = (now - t0 - 1400) / 1100;
      const c = clamp01(t);
      aIntro.current = c * c * (3 - 2 * c);
      apply();
      if (t < 1) introRaf = requestAnimationFrame(introTick);
    };
    introRaf = requestAnimationFrame(introTick);

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(introRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden>
      <div className={styles.stack}>
        {/* Decorative, scroll-scrubbed morph phrases (the whole wrap is
            aria-hidden). These are NOT the page heading - the real, crawlable
            <h1> lives in HomeOcean so the homepage has exactly one keyword-
            bearing h1. */}
        <p ref={aRef} className={`${styles.phrase} no-marble`}>
          <CharSplit text="The Coast" />
        </p>
        <p ref={bRef} className={`${styles.phrase} ${styles.phraseB} no-marble`}>
          <CharSplit text="Design The Future" />
        </p>
        <p ref={cRef} className={`${styles.phrase} ${styles.phraseC}`}>
          <CharSplit text={`${COMPANY.promise}.`} />
        </p>
      </div>
      <span ref={cueRef} className={styles.cue}>
        Scroll
      </span>
    </div>
  );
}
