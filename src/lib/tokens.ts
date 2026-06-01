// Design tokens. Single source of truth for color, type, motion.
// Anything visual should reference these, not hard-coded values.

export const tokens = {
  color: {
    bg: "#0A0C12",            // page, near-black
    bgAlt: "#12161D",         // lifted card surface
    bgDeep: "#06080C",        // footer / vignette floor
    blue: "#023661",          // brand blue field
    blueDim: "#04243F",       // darker blue
    surface: "#3F3A42",       // grey-purple surface
    steel: "#76828E",         // steel, labels / tertiary
    accent: "#DB5227",        // orange, emphasis + CTAs
    accentDim: "#7E2E18",     // dim orange
    white: "#EDEFF2",         // primary text (cool white)
    whiteDim: "#AAB2BC",      // secondary text
    border: "rgba(237,239,242,0.10)",
    borderAccent: "rgba(219,82,39,0.30)",
  },
  font: {
    display: '"Cormorant Garamond", "Georgia", serif',
    mono: '"JetBrains Mono", "Menlo", monospace',
    body: '"Inter", "Helvetica Neue", sans-serif',
  },
  size: {
    nav: 64,
    cursor: 28,
    hudPadding: 32,
  },
  ease: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    out3: "power3.out",      // GSAP equivalent
    inOut3: "power3.inOut",
  },
  duration: {
    fast: 200,
    base: 400,
    slow: 900,
    chamber: 1600,
  },
  z: {
    canvas: 0,
    grain: 3,
    chrome: 10,
    cursor: 100,
    gate: 50,
    overlay: 200,
  },
} as const;

export type Tokens = typeof tokens;
