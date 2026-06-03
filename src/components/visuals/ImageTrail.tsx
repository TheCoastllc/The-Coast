"use client";

import { useEffect, useRef } from "react";
import { EDITORIAL } from "@/lib/content/coast";
import styles from "./ImageTrail.module.css";

const POOL = 16;
const THRESHOLD = 70; // px of movement before the next image spawns

/**
 * Images stream off the cursor in its wake and dissolve - a kinetic trail. A
 * recycled pool of <img> elements is repositioned and re-animated as the pointer
 * moves. Full color, no filter.
 *
 * `images` drives the wake (e.g. case-study covers); defaults to the editorial
 * set. `contained` makes it an absolute layer inside a positioned parent (the
 * wake only spawns over that region) instead of a full-viewport takeover - used
 * to sit behind a section like the clients band.
 */
export function ImageTrail({
  images,
  contained = false,
}: {
  images?: string[];
  contained?: boolean;
}) {
  const srcs = images ?? EDITORIAL.map((e) => e.src);
  const wrap = useRef<HTMLDivElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const idx = useRef(0);
  const last = useRef({ x: 0, y: 0, set: false });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const spawn = (x: number, y: number) => {
      const img = imgs.current[idx.current % POOL];
      idx.current++;
      if (!img) return;
      const rot = (Math.random() - 0.5) * 16;
      img.style.transition = "none";
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.opacity = "1";
      img.style.transform = `translate(-50%, -50%) scale(0.55) rotate(${rot}deg)`;
      // force reflow so the next transition runs
      void img.offsetWidth;
      img.style.transition = "opacity 1s ease-out, transform 1s cubic-bezier(0.16,1,0.3,1)";
      img.style.opacity = "0";
      img.style.transform = `translate(-50%, -50%) scale(1.08) rotate(${rot}deg)`;
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // contained: only react to movement over this region
      if (contained && (x < 0 || y < 0 || x > r.width || y > r.height)) return;
      if (!last.current.set) {
        last.current = { x, y, set: true };
        return;
      }
      const dx = x - last.current.x;
      const dy = y - last.current.y;
      if (Math.hypot(dx, dy) < THRESHOLD) return;
      last.current = { x, y, set: true };
      spawn(x, y);
    };

    // contained mode listens on window (its own layer is pointer-events:none)
    const target: Window | HTMLElement = contained ? window : el;
    target.addEventListener("pointermove", onMove as EventListener);
    return () => target.removeEventListener("pointermove", onMove as EventListener);
  }, [contained]);

  return (
    <div ref={wrap} className={`${styles.wrap} ${contained ? styles.contained : ""}`}>
      {Array.from({ length: POOL }).map((_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          ref={(el) => {
            if (el) imgs.current[i] = el;
          }}
          src={srcs[i % srcs.length]}
          alt=""
          className={styles.trailImg}
          draggable={false}
        />
      ))}
      {!contained && <div className={styles.hint}>Move your cursor</div>}
    </div>
  );
}
