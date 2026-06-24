"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/perf";

/**
 * The Coast brand wave clip (curling wave + figure, "Design the Future"). Fills
 * its container - the parent sets size/aspect. Decorative (aria-hidden); muted
 * loop. The poster shows instantly; the ~2MB clip is only fetched when the
 * element nears the viewport (preload="none" + IntersectionObserver), and pauses
 * when scrolled away. Under reduced motion it never loads - the poster holds.
 */
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

  // Fetch the clip only when it's near the viewport; pause when it leaves.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      if (!reduced) setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!reduced) {
            setActive(true);
            el.play().catch(() => {});
          }
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
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
      {active ? <source src="/cbi-wave.mp4" type="video/mp4" /> : null}
    </video>
  );
}
