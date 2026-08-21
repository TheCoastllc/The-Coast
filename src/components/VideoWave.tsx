"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/perf";

/**
 * The Coast Global brand wave clip (curling wave + figure, "Design the Future").
 * Fills its container - the parent sets size/aspect. Decorative (aria-hidden);
 * muted loop. The poster shows instantly.
 *
 * The clip ships at FULL original quality (the video bitstream is untouched -
 * only the useless AAC track on this muted element was stripped), so the weight
 * is managed entirely by not fetching it unless it will actually be watched:
 *
 *   - preload="none" and no <source> until activated, so the browser cannot
 *     speculatively fetch it;
 *   - it must be genuinely ON SCREEN (25% visible), not merely approaching -
 *     the old 200px rootMargin started a ~2MB download for people who never
 *     reached it;
 *   - it must STAY visible for a moment (DWELL_MS) before we commit, so anyone
 *     scrolling past the section pays nothing;
 *   - skipped entirely on Save-Data or a 2g/3g connection;
 *   - skipped under reduced motion, and paused whenever it leaves the viewport.
 */
const DWELL_MS = 700;

/** Phones hold the poster instead of spending ~2MB on a decorative loop.
 *  This is a deliberate product call, not a side effect of the visibility
 *  threshold: the clip ships at full original quality, so the only way to keep
 *  a phone light is to not send it. Delete this check to restore video on
 *  mobile - everything else keeps working. */
function viewportWantsVideo(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 768px)").matches;
}
/** Fraction of the clip that must be on screen before it counts as "being
 *  watched". Desktop runs Lenis smooth-scroll, which stretches a brisk pass
 *  into a slow one, so a low bar let a fast scroll-through still trigger a
 *  ~2MB fetch. */
const VISIBLE_FRACTION = 0.45;

/** Respect the user's data preferences: never spend ~2MB on decoration when
 *  they have asked for less, or when the connection cannot afford it. */
function connectionAllowsVideo(): boolean {
  if (typeof navigator === "undefined") return true;
  const c = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!c) return true;
  if (c.saveData) return false;
  if (c.effectiveType && /(^|-)2g$|^3g$/.test(c.effectiveType)) return false;
  return true;
}
export function VideoWave({
  className,
  style,
  fit = "cover",
  rounded = true,
}: {
  className?: string;
  style?: CSSProperties;
  fit?: "cover" | "contain";
  rounded?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  // Fetch the clip only once it is actually on screen AND has stayed there.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // poster holds, nothing fetched
    if (reduced || !connectionAllowsVideo() || !viewportWantsVideo()) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    let dwell: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // commit only if it is still on screen after the dwell - a fast
          // scroll past the section should cost nothing
          dwell = setTimeout(() => {
            setActive(true);
            el.play().catch(() => {});
          }, DWELL_MS);
        } else {
          if (dwell) clearTimeout(dwell);
          el.pause();
        }
      },
      { threshold: VISIBLE_FRACTION }
    );
    io.observe(el);
    return () => {
      if (dwell) clearTimeout(dwell);
      io.disconnect();
    };
  }, [reduced]);

  // Once activated, load the source and (unless reduced motion) play it.
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    el.load();
    if (!reduced) el.play().catch(() => {});
  }, [active, reduced]);

  return (
    <video
      ref={ref}
      className={className}
      aria-hidden="true"
      loop
      muted
      playsInline
      preload="none"
      poster="/cbi-wave-poster.jpg"
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        display: "block",
        borderRadius: rounded ? 16 : 0,
        ...style,
      }}
    >
      {active ? <source src="/cbi-wave-hq.mp4" type="video/mp4" /> : null}
    </video>
  );
}
