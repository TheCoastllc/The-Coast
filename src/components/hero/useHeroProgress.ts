"use client";

import { useEffect, useRef, MutableRefObject } from "react";

/**
 * Scroll progress 0 -> 1 across `viewports` screen-heights of scroll.
 * Read inside R3F useFrame to drive camera + scene choreography.
 * viewports=1 -> a one-screen hero; viewports=2.4 -> a multi-act story.
 */
export function useHeroProgress(viewports = 1): MutableRefObject<number> {
  const p = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const span = (window.innerHeight || 1) * viewports;
      p.current = Math.min(1, Math.max(0, window.scrollY / span));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [viewports]);
  return p;
}
