"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

/**
 * Custom COMPASS cursor.
 * - A small compass rose follows the pointer with light easing.
 * - The needle swings toward your direction of travel, settles to north when idle,
 *   and LOCKS ON (points at) interactive elements on hover.
 * - A click pings a sonar ring. Over [data-cursor-label] elements it reveals a label.
 *
 * Perf: the rAF loop only runs while the pointer is moving (and the easing is still
 * settling) and stops when idle or the tab is hidden, so it never steals frames from
 * the WebGL scenes - which is what made it feel delayed.
 */
export function Cursor() {
  const compassRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let sx = mx;
    let sy = my;
    let pmx = mx;
    let angle = -90; // needle angle (atan2 space; -90 = north/up)
    let vel = 0; // needle angular velocity (damped spring back to north)
    let raf = 0;
    let running = false;
    let lastMove = performance.now();
    let hoverState: "default" | "active" | "label" = "default";
    let labelText = "";
    let ringIdx = 0;

    const settled = () =>
      Math.abs(mx - sx) < 0.15 &&
      Math.abs(my - sy) < 0.15 &&
      Math.abs(angle + 90) < 0.4 &&
      Math.abs(vel) < 0.02;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
      kick();
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const labelEl = t.closest<HTMLElement>("[data-cursor-label]");
      const actEl = t.closest<HTMLElement>("a, button, [data-cursor='active'], input, textarea");

      let next: typeof hoverState = "default";
      let nextLabel = "";
      if (labelEl) {
        next = "label";
        nextLabel = labelEl.dataset.cursorLabel ?? "";
      } else if (actEl) {
        next = "active";
      }
      if (next !== hoverState) {
        hoverState = next;
        compassRef.current?.setAttribute("data-state", next);
        coreRef.current?.setAttribute("data-state", next);
      }
      if (next === "label" && nextLabel !== labelText) {
        labelText = nextLabel;
        if (labelRef.current) labelRef.current.textContent = nextLabel;
      }
    };

    const ping = (x: number, y: number) => {
      const rings = ringsRef.current;
      if (!rings) return;
      const el = rings.children[ringIdx % rings.children.length] as HTMLElement;
      ringIdx++;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.classList.remove(styles.ping);
      void el.offsetWidth; // reflow to restart the animation
      el.classList.add(styles.ping);
    };
    const onDown = (e: MouseEvent) => {
      compassRef.current?.setAttribute("data-press", "true");
      ping(e.clientX, e.clientY);
    };
    const onUp = () => compassRef.current?.setAttribute("data-press", "false");

    const tick = () => {
      sx += (mx - sx) * 0.2;
      sy += (my - sy) * 0.2;
      if (compassRef.current) {
        compassRef.current.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%)`;
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }

      // real compass: the needle holds NORTH, only jiggling as it is carried
      const dx = mx - pmx;
      pmx = mx;
      vel += dx * 0.05; // being carried nudges the needle
      vel += (-90 - angle) * 0.05; // spring back to north
      vel *= 0.85; // damping
      angle = Math.max(-145, Math.min(-35, angle + vel));
      if (needleRef.current) needleRef.current.style.transform = `rotate(${angle + 90}deg)`;

      // stop the loop once the pointer is idle and the easing has settled
      if (performance.now() - lastMove > 450 && settled()) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    function kick() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        lastMove = performance.now();
        kick();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("visibilitychange", onVis);
    kick(); // settle to the initial position, then idle-stop

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={compassRef} className={styles.compass} data-state="default" data-press="false" aria-hidden>
        <svg className={styles.rose} viewBox="-16 -16 32 32">
          <circle cx="0" cy="0" r="14.5" className={styles.ring} />
          <line x1="0" y1="-14.5" x2="0" y2="-9" className={styles.tickN} />
          <line x1="0" y1="14.5" x2="0" y2="11" className={styles.tick} />
          <line x1="-14.5" y1="0" x2="-11" y2="0" className={styles.tick} />
          <line x1="14.5" y1="0" x2="11" y2="0" className={styles.tick} />
        </svg>
        <div ref={needleRef} className={styles.needle} />
        <span ref={labelRef} className={styles.label} />
      </div>
      <div ref={coreRef} className={styles.core} data-state="default" aria-hidden />
      <div ref={ringsRef} className={styles.rings} aria-hidden>
        <span className={styles.sonar} />
        <span className={styles.sonar} />
        <span className={styles.sonar} />
      </div>
    </>
  );
}
