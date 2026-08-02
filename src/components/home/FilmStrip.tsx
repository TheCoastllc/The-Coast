"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktopOnlyWebGL, useHeroMountTrigger, useInView, useReducedMotion } from "@/lib/perf";
import { useVariant } from "@/components/visuals/useVariant";
import styles from "./FilmStrip.module.css";

const FILM_MODES = ["off", "on"] as const;

/** Frame manifest - written by the slicing pipeline (scripts/slice-film.ts). */
const FRAME_COUNT = 60;
const frameSrc = (i: number) => `/story/film/frame-${String(i).padStart(3, "0")}.webp`;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * ?film=on build-off: an Apple-style scroll-linked image sequence. A stack of
 * prerendered film frames (the flagship turning bow -> broadside) painted onto
 * a fixed canvas; the spacer section provides the scroll runway and the scroll
 * position picks the frame - scrub down, she turns; scrub up, she turns back.
 * Same fixed-layer + spacer pattern as the FoldingBoat finale; frames are
 * fetched lazily VideoWave-style only when the section approaches, and the
 * whole component renders nothing on touch/low-end devices or without the flag.
 */
export function FilmStrip() {
  const film = useVariant("film", FILM_MODES, "off");
  const webgl = useDesktopOnlyWebGL();
  const interacted = useHeroMountTrigger();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lastPainted = useRef(-1);
  const near = useInView(sectionRef, "60% 0px");
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  const active = film === "on" && webgl && interacted;

  // lazy frame loader: first frame immediately, the rest in small chunks so
  // the browser never sees a 60-request burst
  useEffect(() => {
    if (!active || !near) return;
    let cancelled = false;
    const frames = framesRef.current;
    if (frames.length === 0) frames.length = FRAME_COUNT;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (frames[i]) return resolve();
        const img = new Image();
        img.onload = () => {
          if (!cancelled) frames[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(i);
      });
    (async () => {
      await load(0);
      if (!cancelled) setFirstFrameReady(true);
      const CHUNK = 8;
      for (let start = 1; start < FRAME_COUNT && !cancelled; start += CHUNK) {
        await Promise.all(
          Array.from({ length: Math.min(CHUNK, FRAME_COUNT - start) }, (_, k) => load(start + k))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active, near]);

  // paint = cover-fit blit of the chosen frame; scroll drives the frame index
  useEffect(() => {
    if (!active || !firstFrameReady) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const paint = (index: number) => {
      const img = framesRef.current[index] ?? framesRef.current[lastPainted.current] ?? framesRef.current[0];
      if (!img) return;
      if (framesRef.current[index]) lastPainted.current = index;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    let raf = 0;
    const apply = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = clamp01((vh - r.top) / (r.height + vh));
      if (layerRef.current) {
        // exit completes BEFORE the next section's copy becomes readable -
        // no double exposure with the incoming thesis block
        layerRef.current.style.opacity = String(
          smoothstep(0.02, 0.1, raw) * (1 - smoothstep(0.78, 0.9, raw))
        );
      }
      if (copyRef.current) {
        copyRef.current.style.opacity = String(
          smoothstep(0.35, 0.5, raw) * (1 - smoothstep(0.72, 0.82, raw))
        );
      }
      const index = reduced ? FRAME_COUNT - 1 : Math.round(raw * (FRAME_COUNT - 1));
      paint(index);
    };
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
          <p className={styles.line}>You are steering this.</p>
        </div>
      </div>
    </>
  );
}
