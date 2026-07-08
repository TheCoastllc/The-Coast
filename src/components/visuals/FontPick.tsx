"use client";

import { useEffect } from "react";
import { useVariant } from "./useVariant";

/* TEMP font build-off: ?font=anton|archivo|unbounded swaps the display face
   via body[data-font] overrides in styles.css. David picks, then this locks. */
const FONTS = ["grotesk", "anton", "archivo", "unbounded"] as const;

export function FontPick() {
  const font = useVariant("font", FONTS, "grotesk");
  useEffect(() => {
    document.body.dataset.font = font;
  }, [font]);
  return null;
}
