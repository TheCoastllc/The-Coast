"use client";

import { useEffect, useState } from "react";

/**
 * Preview switch: reads `?<param>=` from the URL on mount and returns the chosen
 * variant if it's in `allowed`, else `fallback`. Returns `fallback` on the server
 * and first paint, so the default variant SSRs (good for SEO) and the bare site
 * already looks premium; an explicit `?param=` flips to an alternate to compare.
 * No useSearchParams → no Suspense boundary and no static-render bailout.
 * Pass a module-level constant array for `allowed` so the effect stays stable.
 */
export function useVariant<T extends string>(
  param: string,
  allowed: readonly T[],
  fallback: T
): T {
  const [v, setV] = useState<T>(fallback);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search).get(param) as T | null;
    if (p && (allowed as readonly string[]).includes(p)) setV(p);
  }, [param, allowed]);
  return v;
}
