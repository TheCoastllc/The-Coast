"use client";

import type { CSSProperties } from "react";
import { useReducedMotion } from "@/lib/perf";

/**
 * The Coast brand wave clip (curling wave + figure, "Design the Future"). Fills
 * its container - the parent sets size/aspect. Decorative (aria-hidden); muted
 * autoplay loop, poster shows instantly while it loads / if autoplay is blocked /
 * under reduced-motion (where it holds the still frame instead of playing).
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
  return (
    <video
      className={className}
      aria-hidden="true"
      autoPlay={!reduced}
      loop
      muted
      playsInline
      preload="metadata"
      poster="/cbi-wave-poster.png"
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        display: "block",
        borderRadius: rounded ? 16 : 0,
        ...style,
      }}
    >
      <source src="/cbi-wave.mp4" type="video/mp4" />
    </video>
  );
}
