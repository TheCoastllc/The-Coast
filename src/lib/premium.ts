// Round 12 premium-elevation preview flags.
// Each feature is gated so it can be screenshotted in isolation, then baked.

export const PREMIUM_KEYS = [
  "icons", // glowing line-art card icons
  "pills", // gold takeaway pills
  "neon", // neon-turquoise + gold marine life
  "orbital", // orbital gold sun-core behind chamber heroes
  "lampglow", // cursor lamp-glow on glass cards
  "ignite", // glow-ignite entrances + assembling titles
  "editorial", // refined type + ghost numerals
  "depth", // volumetric marine parallax + hero bloom
] as const;

export type PremiumKey = (typeof PREMIUM_KEYS)[number];

/**
 * Parse the `?premium=` comma list into the set of active feature keys.
 * - param ABSENT  -> all keys on (the full baked preview)
 * - param present -> exactly the listed keys (empty string = none)
 * SSR-safe: returns all keys when there is no window and no explicit search.
 */
export function getPremiumKeys(search?: string): Set<string> {
  let s = search;
  if (s === undefined) {
    if (typeof window === "undefined") return new Set(PREMIUM_KEYS);
    s = window.location.search;
  }
  const params = new URLSearchParams(s);
  if (!params.has("premium")) return new Set(PREMIUM_KEYS);
  return new Set(
    (params.get("premium") || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
  );
}
