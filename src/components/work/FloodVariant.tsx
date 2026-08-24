"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePointerFine, useReducedMotion } from "@/lib/perf";
import { WorkFrame } from "./WorkFrame";
import type { WorkProject } from "./WorkShowcase";

/** The muted flood video for the active rich project (lazy, one at a time). */
function FloodVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.src = src;
    v.load();
    v.play().catch(() => {});
    return () => {
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, [src]);
  return (
    <video
      ref={ref}
      className="wk-flood-video"
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden
    />
  );
}

function FloodStage({
  projects,
  activeId,
  hovering,
  mounted,
  fine,
  reduced,
  layerRef,
}: {
  projects: WorkProject[];
  activeId: string;
  hovering: boolean;
  mounted: Set<string>;
  fine: boolean;
  reduced: boolean;
  layerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="wk-flood-stage" ref={layerRef} aria-hidden>
      {projects
        .filter((p) => mounted.has(p.id))
        .map((p) => {
          const active = p.id === activeId;
          return (
            <div
              key={p.id}
              className="wk-flood-layer"
              data-active={active}
              data-dim={!hovering}
              style={{ ["--flood-color" as never]: p.color ?? "#0b1c2c" }}
            >
              <Image
                src={p.hero ?? p.cover}
                alt=""
                fill
                sizes="100vw"
                className="wk-flood-img"
                priority={p.id === projects[0].id}
              />
              <span className="wk-flood-grade" />
              <span className="wk-flood-tint" />
              {active && p.video && fine && !reduced && (
                <FloodVideo src={p.video} poster={p.cover} />
              )}
            </div>
          );
        })}
    </div>
  );
}

/**
 * "The Index Flood" (?work=flood). A bold editorial index of client names.
 * Hovering/focusing a name floods the full viewport behind the list with that
 * project's imagery, brand ambient, and (rich projects) muted video. Below the
 * index, the same full-bleed cinematic frames as the frames variant.
 * Cursor-follow parallax is lifted from TrustedBy's IndexVariant; all of it is
 * gated to fine pointers + motion-allowed, and the index is a real anchor list
 * so SEO / no-JS / touch all get complete content.
 */
export function FloodVariant({ projects }: { projects: WorkProject[] }) {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState<Set<string>>(() => new Set([projects[0]?.id]));
  const layerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const enter = (id: string) => {
    setActiveId(id);
    setHovering(true);
    setMounted((s) => (s.has(id) ? s : new Set(s).add(id)));
  };
  const leave = () => setHovering(false);

  // cursor-follow parallax on the active flood layer (fine + hovering + motion)
  useEffect(() => {
    if (!fine || !hovering || reduced) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;
      const el = layerRef.current?.querySelector<HTMLElement>('.wk-flood-layer[data-active="true"]');
      if (el) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        el.style.transform = `translate3d(${(p.x - cx) * 0.014}px, ${(p.y - cy) * 0.014}px, 0) scale(1.06)`;
      }
      raf = requestAnimationFrame(tick);
    };
    pos.current.x = pos.current.tx;
    pos.current.y = pos.current.ty;
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, hovering, reduced]);

  const active = projects.find((p) => p.id === activeId);

  return (
    <div className="wk-root wk-flood">
      <section className="wk-flood-hero" data-hovering={hovering}>
        <FloodStage
          projects={projects}
          activeId={activeId}
          hovering={hovering}
          mounted={mounted}
          fine={fine}
          reduced={reduced}
          layerRef={layerRef}
        />

        <div className="wk-flood-inner">
          <p className="wk-flood-eyebrow">The Coast Global — Selected Work</p>
          <ol className="wk-flood-index" onPointerLeave={leave}>
            {projects.map((p, i) => (
              <li
                key={p.id}
                className="wk-flood-row"
                data-active={p.id === activeId}
                onPointerEnter={() => enter(p.id)}
                onFocusCapture={() => enter(p.id)}
              >
                <Link
                  href={`/work/${p.id}`}
                  className="wk-flood-link"
                  data-cursor-label="Open"
                  aria-label={`Open ${p.client} case study`}
                >
                  <span className="wk-flood-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wk-flood-name">{p.client}</span>
                  <span className="wk-flood-meta">
                    {p.category}
                    {p.year ? ` · ${p.year}` : ""}
                  </span>
                  <span className="wk-flood-arrow" aria-hidden>
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          {active?.tagline && <p className="wk-flood-tagline">{active.tagline}</p>}
        </div>
      </section>

      {/* full-bleed cinematic frames below the index */}
      {projects.map((p, i) => (
        <WorkFrame key={p.id} p={p} index={i} total={projects.length} />
      ))}
    </div>
  );
}
