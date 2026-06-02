"use client";

import { EDITORIAL } from "@/lib/content/coast";
import styles from "./CursorReveal.module.css";

/**
 * Each panel shows a dimmed, abstracted image. A vivid "lens" of the real
 * image follows the cursor (CSS radial mask driven by --mx/--my). Move over a
 * panel and the picture comes alive only where you look.
 */
export function CursorReveal() {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // park the lens off-panel so it fades out
    e.currentTarget.style.setProperty("--mx", `-200px`);
    e.currentTarget.style.setProperty("--my", `-200px`);
  };

  return (
    <div className={styles.grid}>
      {EDITORIAL.slice(0, 6).map((img) => (
        <div
          key={img.src}
          className={styles.panel}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div className={styles.base} style={{ backgroundImage: `url(${img.src})` }} />
          <div className={styles.lens} style={{ backgroundImage: `url(${img.src})` }} />
          <span className={styles.caption}>{img.caption}</span>
        </div>
      ))}
    </div>
  );
}
