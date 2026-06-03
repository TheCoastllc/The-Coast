"use client";

import { useEffect, useState } from "react";

/**
 * Home/case-study effect PREVIEW switch via ?fx=typemask|lens|trail.
 * Reads the param from window.location on mount (no useSearchParams, so it never
 * forces these routes dynamic or needs a Suspense boundary). Returns "none" on
 * the server + first paint, so normal visitors always get the baked content and
 * only an explicit ?fx= flips an effect on. Pair with usePointerFine() so touch
 * devices keep the baked content.
 */
export const FX_MODES = ["none", "typemask", "lens", "trail"] as const;
export type FxMode = (typeof FX_MODES)[number];

export function useFxMode(): FxMode {
  const [fx, setFx] = useState<FxMode>("none");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search).get("fx") as FxMode | null;
    if (p && FX_MODES.includes(p)) setFx(p);
  }, []);
  return fx;
}
