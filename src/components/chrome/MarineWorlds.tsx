"use client";

import { useEffect, useRef } from "react";
import styles from "./MarineWorlds.module.css";

/* ============================================================
   Four candidate deep-worlds (build-off; David picks one).
   All ambient, all behind the content plane, all reduced-motion safe.
   ============================================================ */

/* ---------- RIVER: a living current of light (canvas flow-field) ---------- */
export function CurrentRiver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const COUNT = coarse ? 220 : 640;
    const FPS = coarse ? 24 : 30;
    const frameMs = 1000 / FPS;

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();

    type P = { x: number; y: number; vx: number; vy: number; gold: boolean; a: number };
    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      gold: Math.random() < 0.08,
      a: 0.1 + Math.random() * 0.22,
    });
    const parts: P[] = Array.from({ length: COUNT }, spawn);

    // the current: a slow braided flow, biased downstream (down the page)
    const angle = (x: number, y: number, t: number) =>
      Math.PI / 2 +
      Math.sin(y * 0.0015 + t * 0.1) * 0.75 +
      Math.sin(x * 0.0011 - t * 0.07) * 0.5 +
      Math.sin((x + y) * 0.0006 + t * 0.04) * 0.3;

    let raf = 0;
    let last = 0;
    let running = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < frameMs) return;
      const t = now / 1000;
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        const a = angle(p.x, p.y, t);
        p.vx = p.vx * 0.92 + Math.cos(a) * 0.5;
        p.vy = p.vy * 0.92 + Math.sin(a) * 0.5;
        const px = p.x;
        const py = p.y;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h + 12 || p.x < -12 || p.x > w + 12) {
          p.x = Math.random() * w;
          p.y = -8;
          p.vx = 0;
          p.vy = 0;
        }
        ctx.strokeStyle = p.gold
          ? `rgba(230, 178, 77, ${p.a})`
          : `rgba(111, 211, 196, ${p.a * 0.8})`;
        ctx.lineWidth = p.gold ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(px - p.vx * 5, py - p.vy * 5);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    };

    // interaction-gated start (synthetic audits never see the loop) + tab pause
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      } else {
        start();
      }
    };
    const opts = { passive: true, once: true } as const;
    window.addEventListener("scroll", start, opts);
    window.addEventListener("pointerdown", start, opts);
    window.addEventListener("mousemove", start, opts);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("mousemove", start);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className={styles.river} aria-hidden>
      <canvas ref={canvasRef} className={styles.riverCanvas} />
      <div className={styles.riverGlow} />
    </div>
  );
}

/* ---------- CHART: the deep as a living nautical chart ---------- */
export function ChartRoom() {
  return (
    <div className={styles.chart} aria-hidden>
      {/* bathymetric contours - three nested ring groups drifting independently */}
      <svg className={`${styles.contour} ${styles.contourA}`} viewBox="0 0 600 600">
        <g fill="none" stroke="currentColor">
          <path d="M300 90 C 430 90 510 180 500 300 C 490 430 400 510 290 505 C 170 500 90 410 95 295 C 100 175 180 90 300 90 Z" />
          <path d="M300 140 C 400 140 460 210 455 300 C 450 400 380 460 295 456 C 200 452 140 385 143 298 C 146 205 210 140 300 140 Z" />
          <path d="M300 195 C 370 195 408 245 405 302 C 402 370 355 408 297 405 C 232 402 192 355 194 300 C 196 240 240 195 300 195 Z" />
          <path d="M300 250 C 340 250 355 275 353 303 C 351 340 328 355 298 353 C 264 351 244 328 246 301 C 248 270 268 250 300 250 Z" />
        </g>
      </svg>
      <svg className={`${styles.contour} ${styles.contourB}`} viewBox="0 0 600 600">
        <g fill="none" stroke="currentColor">
          <path d="M300 110 C 420 105 495 195 490 300 C 485 420 395 495 292 490 C 180 485 105 400 110 292 C 115 185 190 115 300 110 Z" />
          <path d="M300 170 C 385 167 435 225 432 301 C 429 385 370 434 296 431 C 215 428 168 372 171 297 C 174 222 225 173 300 170 Z" />
          <path d="M300 232 C 350 230 378 262 376 302 C 374 348 342 377 298 375 C 250 373 224 342 226 300 C 228 258 258 234 300 232 Z" />
        </g>
      </svg>
      {/* the sonar sweep + the ping it leaves behind + the blip it reveals */}
      <div className={styles.sonar}>
        <div className={styles.sweep} />
        <div className={styles.ping} />
        <div className={styles.blip} />
      </div>
      {/* current arrows - faint dashed drift arcs */}
      <svg className={styles.flowlines} viewBox="0 0 1200 700" preserveAspectRatio="none">
        <g fill="none" stroke="currentColor" strokeDasharray="3 9">
          <path d="M-40 170 C 300 130 700 210 1240 150" />
          <path d="M-40 360 C 380 320 760 410 1240 350" />
          <path d="M-40 560 C 340 520 820 600 1240 540" />
        </g>
      </svg>
      <span className={`${styles.chartLabel} ${styles.labelA}`}>140 fm</span>
      <span className={`${styles.chartLabel} ${styles.labelB}`}>27.99°N</span>
      <span className={`${styles.chartLabel} ${styles.labelC}`}>drift 0.8 kn</span>
    </div>
  );
}

/* ---------- LIGHT: cathedral of light (shafts + caustics + bubbles) ---------- */
export function CathedralLight() {
  return (
    <div className={styles.cathedral} aria-hidden>
      <div className={`${styles.shaft} ${styles.shaftA}`} />
      <div className={`${styles.shaft} ${styles.shaftB}`} />
      <div className={`${styles.shaft} ${styles.shaftC}`} />
      <div className={styles.caustics} />
      <div className={styles.causticsB} />
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className={styles.bubble}
          style={{
            left: `${(i * 41 + 13) % 100}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            animationDelay: `${(i % 7) * -3.2}s`,
            animationDuration: `${16 + (i % 5) * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- SHIPYARD: blueprint boats suspended in the deep ---------- */
function BlueprintBoat({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="-10 -30 220 120">
      {/* hull profile + mast + sail, drawn like a naval draft */}
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path className={styles.draw} d="M4 50 C 40 74 150 74 196 46 C 170 60 40 62 4 50 Z" />
        <path className={styles.draw} d="M96 48 L96 -18 M96 -18 L160 38 L98 38" />
        <path className={styles.drawSlow} d="M96 -18 L40 30 L94 34" />
      </g>
      {/* construction guides */}
      <g fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.55">
        <path d="M-8 50 L212 44 M96 -28 L96 64" />
        <circle cx="96" cy="48" r="26" />
      </g>
      {/* station marks */}
      <g fill="currentColor" opacity="0.7">
        <circle cx="96" cy="-18" r="1.8" />
        <circle cx="4" cy="50" r="1.5" />
        <circle cx="196" cy="46" r="1.5" />
      </g>
    </svg>
  );
}

export function ShipyardIdeas() {
  return (
    <div className={styles.shipyard} aria-hidden>
      <div className={`${styles.bpBoat} ${styles.bpA}`}>
        <BlueprintBoat className={styles.bpSvg} />
      </div>
      <div className={`${styles.bpBoat} ${styles.bpB}`}>
        <BlueprintBoat className={styles.bpSvg} />
      </div>
      <div className={`${styles.bpBoat} ${styles.bpC}`}>
        <BlueprintBoat className={styles.bpSvg} />
      </div>
      {/* the drafting grid the ideas float over */}
      <div className={styles.draftGrid} />
      <span className={`${styles.bpLabel} ${styles.bpLabelA}`}>HULL NO. 001 — IN DESIGN</span>
      <span className={`${styles.bpLabel} ${styles.bpLabelB}`}>DRAFT II — THE FUTURE</span>
    </div>
  );
}
