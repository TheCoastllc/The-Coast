"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/perf";
import { PRODUCTS } from "@/lib/content/coast";
import styles from "./ColonyFlagship.module.css";

/**
 * The Colony flagship moment - the studio's own product, given a full-bleed
 * showcase instead of a card in the shelf. Visually quotes colonyapp.ai's own
 * hero (giant serif wordmark inside a gold particle ring on near-black), so a
 * visitor who clicks through lands somewhere that feels continuous.
 *
 * The particles ARE the concept: a scattered colony that organises itself into
 * orbit - "start with an idea, finish with a project" performed, not claimed.
 * Each particle drifts from a random seed into a slot on one of two rings and
 * keeps orbiting; a fine pointer stirs them locally and they re-form.
 *
 * Perf contract: plain 2D canvas, ~420 particles, dpr-capped at 2, the rAF
 * only runs while the section is on screen (IntersectionObserver), and under
 * reduced motion a static ring is painted once.
 */

const COLONY = PRODUCTS.find((p) => p.key === "colony")!;

type P = {
  x: number; y: number;        // current
  ring: number;                 // orbit radius (fraction of base R)
  angle: number; speed: number; // orbit slot
  size: number; alpha: number;
  hue: string;
  settle: number;               // 0 scattered -> 1 in orbit
};

const GOLDS = ["#c9a24a", "#e0b76a", "#a57f2e", "#f0d9a8"];

export function ColonyFlagship() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, R = 0;
    const fit = () => {
      W = wrap.clientWidth; H = wrap.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.34;
    };
    fit();

    const N = Math.min(420, Math.round((W * H) / 3400));
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const parts: P[] = Array.from({ length: N }, (_, i) => ({
      x: rand(0, W), y: rand(0, H),
      ring: i % 3 === 0 ? rand(0.62, 0.78) : rand(0.94, 1.12),
      angle: rand(0, Math.PI * 2),
      speed: rand(0.0012, 0.0032) * (Math.random() < 0.5 ? 1 : -1),
      size: rand(0.6, 1.7),
      alpha: rand(0.25, 0.85),
      hue: GOLDS[i % GOLDS.length],
      settle: 0,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    const paintStatic = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const cx = W / 2 + Math.cos(p.angle) * R * p.ring;
        const cy = H / 2 + Math.sin(p.angle) * R * p.ring * 0.42;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.hue;
        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      paintStatic();
      const ro = new ResizeObserver(() => { fit(); paintStatic(); });
      ro.observe(wrap);
      return () => ro.disconnect();
    }

    let raf = 0;
    let running = false;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.settle = Math.min(1, p.settle + 0.004);          // the colony organises
        p.angle += p.speed;
        const ox = W / 2 + Math.cos(p.angle) * R * p.ring;
        const oy = H / 2 + Math.sin(p.angle) * R * p.ring * 0.42; // elliptical, like a ring seen at an angle
        // ease from scattered seed toward the orbit slot
        p.x += (ox - p.x) * (0.012 + 0.05 * p.settle);
        p.y += (oy - p.y) * (0.012 + 0.05 * p.settle);
        // a fine pointer stirs the colony locally
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 8100) {
          const d = Math.sqrt(d2) || 1;
          const push = (1 - d / 90) * 14;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
        ctx.globalAlpha = p.alpha * (0.5 + 0.5 * p.settle);
        ctx.fillStyle = p.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }, { rootMargin: "120px" });
    io.observe(wrap);

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className={styles.stage} data-mo="item">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.liveDot} aria-hidden />
          Our product · {COLONY.statusLabel}
        </p>
        <h3 className={styles.wordmark}>Colony</h3>
        <p className={styles.line}>{COLONY.line}</p>
        <p className={styles.pitch}>
          The AI project platform built by The Coast Global. Tell it what&rsquo;s on your
          mind - an idea, a client brief, a week that&rsquo;s already too full - and it turns
          that into a real plan, then sticks around until the thing actually gets done.
        </p>
        <div className={styles.chips} aria-hidden>
          <span className={styles.chip}>Smart plans</span>
          <span className={styles.chip}>Daily workflow</span>
          <span className={styles.chip}>Teams &amp; client work</span>
        </div>
        <div className={styles.ctaRow}>
          <a
            className={styles.cta}
            href={COLONY.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="Visit"
            data-mo="magnetic"
          >
            Try Colony free
            <span aria-hidden>→</span>
          </a>
          <span className={styles.domain}>colonyapp.ai</span>
        </div>
      </div>
    </div>
  );
}
