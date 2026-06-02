"use client";

import { useSearchParams } from "next/navigation";
import { MatteMode, MATTE_MODES } from "./MatteImage";

/**
 * Site-wide matte preview switch via ?matte=grain-graded|grain-color|grain-subtle|smooth.
 * Defaults to grain-graded. Call inside a Suspense-wrapped client component.
 */
export function useMatteMode(): MatteMode {
  const p = useSearchParams().get("matte") as MatteMode | null;
  return p && MATTE_MODES.includes(p) ? p : "grain-color";
}
