// Plain module (no "use client") so server components can call variantForIndex
// directly while the Reveal component itself stays a client component.

export type RevealVariant =
  | "mask-wipe"
  | "rise-blur"
  | "scale-in"
  | "parallax-slide"
  | "rotate3d"
  | "mask-up";

const CYCLE: RevealVariant[] = [
  "mask-wipe",
  "rise-blur",
  "scale-in",
  "parallax-slide",
  "rotate3d",
];

// Assign distinct variants across a list so adjacent items differ.
export const variantForIndex = (i: number): RevealVariant => CYCLE[i % CYCLE.length];
