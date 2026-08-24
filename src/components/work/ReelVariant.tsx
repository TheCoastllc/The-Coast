"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  useHeroMountTrigger,
  useInView,
  usePointerFine,
  useReducedMotion,
} from "@/lib/perf";
import { WorkFrame } from "./WorkFrame";
import type { WorkProject } from "./WorkShowcase";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** One cross-dissolving full-bleed panel in the fixed overlay. */
function ReelPanel({ p, index, total }: { p: WorkProject; index: number; total: number }) {
  return (
    <div className="wk-reel-panel" data-reel-panel={index} style={{ ["--frame-color" as never]: p.color ?? "#0b1c2c" }}>
      <Image src={p.hero ?? p.cover} alt="" fill sizes="100vw" className="wk-reel-img" priority={index === 0} />
      <span className="wk-reel-grade" aria-hidden />
      <span className="wk-reel-glow" aria-hidden />
      {p.video && <video className="wk-reel-video" muted loop playsInline preload="none" poster={p.cover} aria-hidden />}
      <div className="wk-reel-text">
        <div className="wk-reel-num">
          {String(index + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span>
        </div>
        <h2 className="wk-reel-name">{p.client}</h2>
        {p.tagline && <p className="wk-reel-tagline">{p.tagline}</p>}
        <div className="wk-reel-ctas">
          <Link href={`/work/${p.id}`} className="wk-cta" data-cursor-label="Open case">
            {p.ready ? "Open case" : "Preview"} <span aria-hidden>→</span>
          </Link>
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="wk-cta wk-cta-ghost" data-cursor-label="Visit">
              Live site
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * "The Cinematic Reel" (?work=reel). Scroll becomes film: full-bleed projects
 * cross-dissolve into one another. Engine copied from FilmStrip - a real N×100svh
 * runway (the WorkFrame stack, which is also the SSR / mobile / reduced-motion
 * content) plus a position:fixed overlay that dissolves panels by scroll
 * progress. PURE rAF + getBoundingClientRect: no ScrollTrigger, so /work stays
 * immune to the scroll-restore bug.
 */
export function ReelVariant({ projects }: { projects: WorkProject[] }) {
  const N = projects.length;
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const interacted = useHeroMountTrigger();
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const near = useInView(wrapRef, "40% 0px");
  const targetRef = useRef(0);
  const shownRef = useRef(0);
  const [active, setActive] = useState(true);

  const enhance = fine && !reduced && interacted;

  useEffect(() => {
    if (!enhance || !near) {
      setActive(false);
      return;
    }
    setActive(true);
    const layer = layerRef.current;
    const wrap = wrapRef.current;
    if (!layer || !wrap) return;
    const panels = Array.from(layer.querySelectorAll<HTMLElement>(".wk-reel-panel"));
    const videos = panels.map((p) => p.querySelector<HTMLVideoElement>("video"));

    const REEL_A = 0.06;
    const REEL_B = 0.94;
    const HOLD = 0.7;

    const applyScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = clamp01((vh - r.top) / (r.height + vh));
      const p = clamp01((raw - REEL_A) / (REEL_B - REEL_A));
      targetRef.current = p * (N - 1);
      // fade the whole overlay out at the very start + end so the real runway
      // frame (and the footer past it) hand off cleanly - the overlay panel and
      // the runway frame beneath it are identical content, so it's seamless
      layer.style.opacity = String(
        smoothstep(0.015, 0.05, raw) * (1 - smoothstep(0.94, 0.985, raw))
      );
    };

    let raf = 0;
    let lastActiveVideo = -1;
    const tick = () => {
      const diff = targetRef.current - shownRef.current;
      shownRef.current = Math.abs(diff) < 0.35 ? targetRef.current : shownRef.current + diff * 0.28;
      const show = shownRef.current;
      const i = Math.floor(show);
      const f = show - i;
      // windowed cross-dissolve: only i-1..i+1 composite
      for (let k = 0; k < N; k++) {
        let o = 0;
        if (k === i) o = 1 - smoothstep(HOLD, 1, f);
        else if (k === i + 1) o = smoothstep(HOLD, 1, f);
        panels[k].style.opacity = String(o);
        panels[k].style.visibility = o < 0.002 ? "hidden" : "visible";
      }
      // one active decoder: the settled panel
      const activeIdx = f < 0.5 ? i : Math.min(N - 1, i + 1);
      if (activeIdx !== lastActiveVideo) {
        videos.forEach((v, k) => {
          if (!v) return;
          if (k === activeIdx && projects[k].video) {
            if (!v.getAttribute("src")) {
              v.setAttribute("src", projects[k].video!);
              v.load();
            }
            v.play().catch(() => {});
            v.parentElement?.setAttribute("data-playing", "true");
          } else {
            v.pause();
            v.parentElement?.setAttribute("data-playing", "false");
          }
        });
        lastActiveVideo = activeIdx;
      }
      layer.dataset.pos = show.toFixed(3);
      document.documentElement.dataset.reelIndex = String(i);
      raf = requestAnimationFrame(tick);
    };

    applyScroll();
    shownRef.current = targetRef.current;
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", applyScroll, { passive: true });
    window.addEventListener("resize", applyScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", applyScroll);
      window.removeEventListener("resize", applyScroll);
      videos.forEach((v) => v?.pause());
    };
  }, [enhance, near, N, projects]);

  return (
    <div className="wk-root wk-reel" data-reel-active={active}>
      {/* the runway = real full-bleed frame stack (SSR / mobile / reduced content) */}
      <div ref={wrapRef} className="wk-reel-runway" data-reel-wrap data-reel-count={N}>
        {projects.map((p, i) => (
          <WorkFrame key={p.id} p={p} index={i} total={N} eager={i === 0} noVideo />
        ))}
      </div>

      {/* desktop-only fixed cross-dissolve overlay */}
      {enhance && (
        <div ref={layerRef} className="wk-reel-layer" data-reel-layer aria-hidden>
          {projects.map((p, i) => (
            <ReelPanel key={p.id} p={p} index={i} total={N} />
          ))}
        </div>
      )}
    </div>
  );
}
