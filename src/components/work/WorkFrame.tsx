"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MatteImage } from "@/components/ui/MatteImage";
import { useInView, usePointerFine, useReducedMotion } from "@/lib/perf";
import type { WorkProject } from "./WorkShowcase";
import { MomentFilmstrip } from "./MomentFilmstrip";

/**
 * One full-bleed cinematic project frame. The imagery bleeds edge to edge (NO
 * rounded box), graded so mixed website screenshots read as one film; the
 * project's brand color is re-injected as ambient light + a bottom scrim so the
 * enormous name stays legible. Rich projects play their muted video while the
 * frame is on screen (one decoder at a time, lazy src, never on touch/reduced).
 * Shared by the frames + flood variants (and mirrored as the reel's stack).
 */
export function WorkFrame({
  p,
  index,
  total,
  eager = false,
  noVideo = false,
}: {
  p: WorkProject;
  index: number;
  total: number;
  eager?: boolean;
  /** reel runway passes this so only the fixed overlay owns the video decoder */
  noVideo?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, "-10% 0px");
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  const wantsVideo = Boolean(p.video) && fine && !reduced && !noVideo;

  // latch the entrance reveal the first time the frame is near the viewport
  useEffect(() => {
    if (inView) setRevealed(true);
  }, [inView]);

  // one decoder at a time: load + play only while on screen, pause + release off
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !wantsVideo) return;
    if (inView) {
      if (!v.getAttribute("src") && p.video) {
        v.setAttribute("src", p.video);
        v.load();
      }
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, wantsVideo, p.video]);

  const num = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section
      ref={ref}
      className="wk-frame"
      data-revealed={revealed}
      data-playing={wantsVideo && inView}
      style={{ ["--frame-color" as never]: p.color ?? "#0b1c2c" }}
    >
      {/* full-bleed graded still */}
      <MatteImage
        className="wk-frame-bg"
        src={p.hero ?? p.cover}
        alt={`${p.client} - ${p.category ?? "case study"}`}
        mode="grain-subtle"
        eager={eager}
        sizes="100vw"
      />
      {/* rich projects: muted video crossfades over the still while on screen */}
      {wantsVideo && (
        <video
          ref={videoRef}
          className="wk-frame-video"
          muted
          loop
          playsInline
          preload="none"
          poster={p.cover}
          aria-hidden
        />
      )}
      {/* brand-color ambient + legibility scrim */}
      <span className="wk-frame-glow" aria-hidden />

      <div className="wk-frame-text">
        <div className="wk-frame-num">{num}</div>
        {/* plain h2 revealed via the [data-revealed] CSS transition (the
            IntersectionObserver latch above) - deliberately NO CharReveal, so
            every /work variant stays ScrollTrigger-free. True per-char kinetic
            type is a finish-pass upgrade for the chosen direction. */}
        <h2 className="wk-frame-name">{p.client}</h2>
        {p.tagline && <p className="wk-frame-tagline">{p.tagline}</p>}
        {p.role && p.role.length > 0 && (
          <div className="wk-frame-roles">
            {p.role.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
        )}
        <div className="wk-frame-ctas">
          <Link href={`/work/${p.id}`} className="wk-cta" data-cursor-label="Open case">
            {p.ready ? "Open case" : "Preview"} <span aria-hidden>→</span>
          </Link>
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wk-cta wk-cta-ghost"
              data-cursor-label="Visit"
            >
              Live site
            </a>
          )}
        </div>
      </div>

      {p.moments.length >= 3 && <MomentFilmstrip moments={p.moments} />}
    </section>
  );
}
