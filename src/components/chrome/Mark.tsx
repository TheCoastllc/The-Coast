"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Mark.module.css";

/**
 * The Coast logo lockup (iC mark + wordmark). Renders the supplied file from
 * /public at a fixed HEIGHT, preserving its natural aspect ratio; if the file
 * isn't there it hides gracefully (no broken-image icon). Drop the asset at
 * public/coast-logo.png.
 */
export function Mark({ size = 30, className, alt = "The Coast" }: { size?: number; className?: string; alt?: string }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  // catch a load failure that happened before hydration attached onError
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/coast-logo.png"
      alt={alt}
      className={`${styles.mark} ${className ?? ""}`}
      style={{ height: size, width: "auto" }}
      onError={() => setOk(false)}
    />
  );
}
