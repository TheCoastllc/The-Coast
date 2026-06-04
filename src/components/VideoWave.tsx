"use client";

import type { CSSProperties } from "react";

/**
 * The Coast brand wave clip (curling wave + figure, "Design the Future"). Fills
 * its container - the parent sets size/aspect. Muted autoplay loop so it plays
 * everywhere; poster shows instantly while it loads / if autoplay is blocked.
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
  return (
    <video
      className={className}
      autoPlay
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
