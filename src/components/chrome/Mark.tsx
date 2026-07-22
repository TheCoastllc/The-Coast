"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./Mark.module.css";

const LOGO_AR = 1145 / 412; // coast-logo.png intrinsic aspect ratio

/**
 * The Coast Global logo lockup. Rendered through next/image so a ~30px-tall logo is
 * served as a tiny optimized AVIF/WebP (not the 1145x412 source). Hides
 * gracefully if the asset is missing. Drop the asset at public/coast-logo.png.
 */
export function Mark({ size = 30, className, alt = "The Coast Global" }: { size?: number; className?: string; alt?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  const w = Math.round(size * LOGO_AR);
  return (
    <Image
      src="/coast-logo.png"
      alt={alt}
      width={w}
      height={size}
      priority
      className={`${styles.mark} ${className ?? ""}`}
      onError={() => setOk(false)}
    />
  );
}
