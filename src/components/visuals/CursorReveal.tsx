"use client";

import { EDITORIAL } from "@/lib/content/coast";
import styles from "./CursorReveal.module.css";

type Panel = { src: string; caption?: string; href?: string };

/**
 * Each panel shows a dimmed, abstracted image. A vivid "lens" of the real
 * image follows the cursor (CSS radial mask driven by --mx/--my). Move over a
 * panel and the picture comes alive only where you look.
 *
 * Pass `images` (e.g. case-study covers) to drive it from real work; defaults to
 * the editorial demo set.
 */
export function CursorReveal({
  images,
  columns,
  aspect,
}: {
  images?: Panel[];
  columns?: number;
  aspect?: string;
}) {
  const panels: Panel[] = images ?? EDITORIAL.slice(0, 6);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    // park the lens off-panel so it fades out
    e.currentTarget.style.setProperty("--mx", `-200px`);
    e.currentTarget.style.setProperty("--my", `-200px`);
  };

  return (
    <div
      className={styles.grid}
      style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
    >
      {panels.map((img, i) => {
        const inner = (
          <>
            <div className={styles.base} style={{ backgroundImage: `url(${img.src})` }} />
            <div className={styles.lens} style={{ backgroundImage: `url(${img.src})` }} />
            {img.caption && <span className={styles.caption}>{img.caption}</span>}
          </>
        );
        const common = {
          className: styles.panel,
          style: aspect ? { aspectRatio: aspect } : undefined,
          onMouseMove: onMove,
          onMouseLeave: onLeave,
        };
        return img.href ? (
          <a key={`${img.src}-${i}`} href={img.href} {...common} data-cursor-label="View">
            {inner}
          </a>
        ) : (
          <div key={`${img.src}-${i}`} {...common}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
