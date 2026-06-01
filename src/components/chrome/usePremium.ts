"use client";

import { PREMIUM_KEYS } from "@/lib/premium";

/**
 * All Round 12 premium features are baked in. This returns the full set so the
 * JS-driven features (lamp-glow, depth parallax, orbital core, ignite, bloom)
 * stay permanently active. (The preview switcher has been removed.)
 */
export function usePremiumActive(): Set<string> {
  return new Set(PREMIUM_KEYS);
}
