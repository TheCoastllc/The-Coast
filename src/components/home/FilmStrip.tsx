"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktopOnlyWebGL, useHeroMountTrigger, useInView, useReducedMotion } from "@/lib/perf";
import { useVariant } from "@/components/visuals/useVariant";
import styles from "./FilmStrip.module.css";

const FILM_MODES = ["off", "on"] as const;

/** Frame manifest - two tiers, RIGHT-SIZED to real device pixels rather than
 *  to the master's native resolution:
 *    uhd 2880w q76 - a retina 1440 canvas is 2880 device px, so the previous
 *                    3840w tier was 1.33x oversampled and cost 9.5MB for no
 *                    visible gain; this tier is 6.2MB.
 *    hd  1920w q78 - laptop-class; 5.7MB -> 4.4MB, verified indistinguishable
 *                    from q84 on a 1:1 crop of the hull and gold trim.
 *  Picked once at load time. */
const FRAME_COUNT = 60;
const frameDir = () =>
  Math.min(2, window.devicePixelRatio || 1) * window.innerWidth > 2200
    ? "film-uhd3"
    : "film-hd3";
const frameSrc = (i: number, dir: string) =>
  `/story/${dir}/frame-${String(i).padStart(3, "0")}.webp`;

/* The handoff choreography. HeroStage retires over 2.40-2.62vh of scroll; in
 * the same breath this layer fades in (raw .09-.13 = 2.405-2.585vh), so the
 * hero's descended sun match-cuts into the film's sunrise with NO dead gap -
 * one continuous story: sun meets the horizon, the flagship arrives.
 * The 60-frame turn is remapped onto the VISIBLE window so the full
 * bow-to-broadside plays on screen, never behind a transparent layer. */
const FADE_IN_A = 0.095;
const FADE_IN_B = 0.128;
const FADE_OUT_A = 0.78;
const FADE_OUT_B = 0.9;
const FRAME_WIN_A = 0.13;
const FRAME_WIN_B = 0.86;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * Apple-style scroll-scrubbed film, ON by default on desktop (?film=off kills
 * it). A stack of prerendered 4K film frames (the flagship turning bow ->
 * broadside) painted onto a fixed canvas; the spacer section provides the
 * scroll runway and the scroll position picks the frame.
 *
 * Smoothness contract (David: "seamless, lazy loading and fast"):
 *  - frames decode OFF the paint path (img.decode() before they enter the pool)
 *  - loading is PRIORITIZED radially around the frame under the scroll position,
 *    so wherever you scrub, the nearest frames are always the next to arrive
 *  - a rAF loop eases the painted index toward the scroll target, so even
 *    coarse wheel deltas render as a glide, and a missing frame never freezes
 *    the canvas (nearest loaded frame paints instead)
 */
export function FilmStrip() {
  const film = useVariant("film", FILM_MODES, "on");
  const webgl = useDesktopOnlyWebGL();
  const interacted = useHeroMountTrigger();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetRef = useRef(0); // frame index under the scroll position
  const shownRef = useRef(0); // eased index actually painted
  const lastPainted = useRef(-1);
  const near = useInView(sectionRef, "60% 0px");
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  const active = film === "on" && webgl && interacted;

  // prioritized lazy loader: 6 workers, each always fetching the unloaded
  // frame CLOSEST to the current scroll target; every frame is decoded before
  // it becomes paintable so the paint path never janks
  useEffect(() => {
    if (!active || !near) return;
    let cancelled = false;
    const frames = framesRef.current;
    if (frames.length === 0) frames.length = FRAME_COUNT;
    const dir = frameDir();
    const pending = new Set<number>();
    const nextIndex = (): number => {
      const t = targetRef.current;
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (frames[i] || pending.has(i)) continue;
        const d = Math.abs(i - t);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    };
    const load = async (i: number) => {
      pending.add(i);
      try {
        const img = new Image();
        img.src = frameSrc(i, dir);
        await img.decode();
        if (!cancelled) {
          frames[i] = img;
          if (i === 0) setFirstFrameReady(true);
        }
      } catch {
        /* skip on error - nearest-loaded painting covers the hole */
      } finally {
        pending.delete(i);
      }
    };
    const worker = async () => {
      while (!cancelled) {
        const i = nextIndex();
        if (i < 0) return;
        await load(i);
      }
    };
    // frame 0 first (the match-cut poster), then the swarm
    load(0).then(() => {
      for (let w = 0; w < 6; w++) worker();
    });
    return () => {
      cancelled = true;
    };
  }, [active, near]);

  // scroll -> target; rAF eases painted index toward it and blits cover-fit
  useEffect(() => {
    if (!active || !firstFrameReady) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const nearestLoaded = (index: number): HTMLImageElement | null => {
      const frames = framesRef.current;
      if (frames[index]) return frames[index];
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (frames[index - d]) return frames[index - d];
        if (frames[index + d]) return frames[index + d];
      }
      return null;
    };

    const paint = (index: number, force = false) => {
      const img = nearestLoaded(index);
      if (!img) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      const resized = canvas.width !== w || canvas.height !== h;
      if (resized) {
        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      if (!resized && !force && lastPainted.current === index) return;
      lastPainted.current = index;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const applyScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = clamp01((vh - r.top) / (r.height + vh));
      if (layerRef.current) {
        layerRef.current.style.opacity = String(
          smoothstep(FADE_IN_A, FADE_IN_B, raw) * (1 - smoothstep(FADE_OUT_A, FADE_OUT_B, raw))
        );
      }
      if (copyRef.current) {
        copyRef.current.style.opacity = String(
          smoothstep(0.4, 0.5, raw) * (1 - smoothstep(0.74, 0.84, raw))
        );
      }
      const shown = clamp01((raw - FRAME_WIN_A) / (FRAME_WIN_B - FRAME_WIN_A));
      targetRef.current = reduced ? FRAME_COUNT - 1 : shown * (FRAME_COUNT - 1);
    };

    let raf = 0;
    const tick = () => {
      // glide toward the scroll target: coarse wheel deltas render as motion,
      // not jumps. Snap when close so we always settle on the exact frame.
      const diff = targetRef.current - shownRef.current;
      shownRef.current = Math.abs(diff) < 0.35 ? targetRef.current : shownRef.current + diff * 0.28;
      paint(Math.round(shownRef.current));
      raf = requestAnimationFrame(tick);
    };

    applyScroll();
    shownRef.current = targetRef.current;
    paint(Math.round(shownRef.current), true);
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", applyScroll, { passive: true });
    window.addEventListener("resize", applyScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", applyScroll);
      window.removeEventListener("resize", applyScroll);
    };
  }, [active, firstFrameReady, reduced]);

  if (film !== "on") return null;
  if (!webgl || !interacted) return null;

  return (
    <>
      {/* scroll runway - the film's length in scroll distance */}
      <section ref={sectionRef} className={styles.section} aria-hidden />
      <div
        ref={layerRef}
        className={styles.layer}
        style={{ display: near ? "block" : "none" }}
      >
        <canvas ref={canvasRef} className={styles.canvas} />
        <div ref={copyRef} className={styles.copy}>
          <p className={styles.eyebrow}>The Craft</p>
          <p className={styles.line}>{"Bring us a drop, we'll deliver the ocean."}</p>
        </div>
      </div>
    </>
  );
}
