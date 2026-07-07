"use client";

import { useVariant } from "@/components/visuals/useVariant";
import { CurrentRiver, ChartRoom, CathedralLight, ShipyardIdeas } from "./MarineWorlds";
import styles from "./MarineLife.module.css";

/* TEMP build-off worlds (David picks, then the winner locks + this goes away) */
const SEA_LOOKS = ["current", "river", "chart", "light", "shipyard"] as const;

/* Shared gradients, a scale pattern + a soft-focus blur, referenced by id. */
function Defs() {
  return (
    <svg className={styles.defs} aria-hidden>
      <defs>
        <linearGradient id="ml-koi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf3" />
          <stop offset="0.55" stopColor="#f4e9da" />
          <stop offset="1" stopColor="#dcc8ad" />
        </linearGradient>
        <linearGradient id="ml-koifin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd9c2" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="ml-manta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={styles.gMantaA} />
          <stop offset="0.5" className={styles.gMantaB} />
          <stop offset="1" className={styles.gMantaC} />
        </linearGradient>
        <radialGradient id="ml-jelly" cx="0.5" cy="0.32" r="0.72">
          <stop offset="0" className={styles.gJellyA} />
          <stop offset="0.5" className={styles.gJellyB} />
          <stop offset="1" className={styles.gJellyC} />
        </radialGradient>
        <radialGradient id="ml-turtle" cx="0.4" cy="0.3" r="0.85">
          <stop offset="0" className={styles.gTurtleA} />
          <stop offset="1" className={styles.gTurtleB} />
        </radialGradient>
        <radialGradient id="ml-octo" cx="0.45" cy="0.3" r="0.8">
          <stop offset="0" className={styles.gOctoA} />
          <stop offset="1" className={styles.gOctoB} />
        </radialGradient>
        <linearGradient id="ml-seahorse" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0c674" />
          <stop offset="1" stopColor="#b97b35" />
        </linearGradient>
        <linearGradient id="ml-whale" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={styles.gWhaleA} />
          <stop offset="1" className={styles.gWhaleB} />
        </linearGradient>
        <linearGradient id="ml-kelp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" className={styles.gKelpA} />
          <stop offset="1" className={styles.gKelpB} />
        </linearGradient>
        <pattern id="ml-scales" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <path d="M0 7 Q3.5 1.5 7 7" fill="none" stroke="#3a2a18" strokeOpacity="0.14" strokeWidth="0.7" />
        </pattern>
      </defs>
    </svg>
  );
}

/* ---------- atmosphere ---------- */
function GodRays() {
  return <div className={styles.godrays} aria-hidden />;
}
function Plankton() {
  return (
    <div className={styles.plankton} aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            bottom: `${(i * 53) % 100}%`,
            animationDelay: `${(i % 9) * -1.7}s`,
            animationDuration: `${7 + (i % 6) * 1.6}s`,
            opacity: 0.3 + (i % 4) * 0.14,
          }}
        />
      ))}
    </div>
  );
}
function KelpStrand({ h, w, d }: { h: number; w: number; d: string }) {
  return (
    <div className={styles.strand} style={{ height: `${h}vh`, width: `${w}px`, animationDelay: d }}>
      <svg viewBox="0 0 24 200" preserveAspectRatio="none" className={styles.strandSvg}>
        <path
          fill="url(#ml-kelp)"
          d="M12 200 C 4 160, 20 130, 10 96 C 2 64, 18 40, 11 4 C 11 4, 13 4, 13 4 C 20 40, 6 64, 14 96 C 22 130, 8 160, 14 200 Z"
        />
      </svg>
    </div>
  );
}
function Kelp() {
  return (
    <>
      <div className={`${styles.kelp} ${styles.kelpL}`} aria-hidden>
        <KelpStrand h={42} w={26} d="0s" />
        <KelpStrand h={56} w={34} d="-2.2s" />
        <KelpStrand h={34} w={22} d="-4s" />
      </div>
      <div className={`${styles.kelp} ${styles.kelpR}`} aria-hidden>
        <KelpStrand h={50} w={30} d="-1.3s" />
        <KelpStrand h={38} w={24} d="-3.1s" />
        <KelpStrand h={58} w={36} d="-5s" />
      </div>
    </>
  );
}

/* ---------- creatures ---------- */
function Whale() {
  return (
    <div className={`${styles.swimmer} ${styles.whale}`}>
      <svg viewBox="-24 0 320 120" className={styles.body}>
        <path className={styles.fluke} fill="url(#ml-whale)" d="M12 64 C -10 48, -20 50, -22 64 C -20 78, -10 80, 12 64 Z" />
        <path fill="url(#ml-whale)" d="M12 64 C 64 36, 184 32, 252 50 C 272 55, 282 58, 296 50 C 288 66, 280 72, 268 74 C 200 88, 80 88, 32 76 C 20 73, 10 70, 12 64 Z" />
        <path className={styles.whalePec} fill="url(#ml-whale)" d="M126 74 C 136 94, 156 100, 162 88 C 154 80, 140 76, 130 74 Z" />
        <g stroke="#0a2233" strokeWidth="1" opacity="0.3" fill="none">
          <path d="M184 80 Q224 82 254 72 M174 84 Q214 86 248 76" />
        </g>
        <circle cx="264" cy="60" r="2.6" fill="#04101a" />
      </svg>
    </div>
  );
}

function Manta() {
  return (
    <div className={`${styles.swimmer} ${styles.manta}`}>
      <svg viewBox="-12 -14 140 92" className={styles.body}>
        <path d="M58 36 C 88 44, 110 50, 130 48" stroke="#27517d" strokeWidth="2" fill="none" opacity="0.7" />
        <path className={styles.wingL} fill="url(#ml-manta)" d="M58 30 C 28 -4, -2 6, 8 36 C 2 42, 30 48, 58 39 Z" />
        <path className={styles.wingR} fill="url(#ml-manta)" d="M58 30 C 88 -4, 118 6, 108 36 C 114 42, 86 48, 58 39 Z" />
        <path fill="url(#ml-manta)" d="M49 20 C 58 15, 66 15, 71 25 C 71 42, 63 49, 58 49 C 53 49, 45 42, 45 25 C 46 20, 49 20, 49 20 Z" />
        <path stroke="#2b537e" strokeWidth="2.4" strokeLinecap="round" fill="none" d="M50 18 C 47 9, 46 7, 48 4 M66 18 C 69 9, 70 7, 68 4" />
      </svg>
    </div>
  );
}

/* sea turtle - top view: patterned shell, head + 4 flippers (2 large front, 2 rear) */
function Turtle() {
  return (
    <div className={`${styles.swimmer} ${styles.turtle}`}>
      <svg viewBox="-58 -34 150 138" className={styles.body}>
        {/* large front flippers (toward the head, right) */}
        <path className={styles.flipFront} fill="url(#ml-turtle)" d="M44 8 C 70 -22, 92 -24, 90 -2 C 84 14, 60 22, 42 22 Z" />
        <path className={styles.flipFrontLow} fill="url(#ml-turtle)" d="M44 62 C 70 92, 92 94, 90 72 C 84 56, 60 48, 42 48 Z" />
        {/* small rear flippers (toward the tail, left) */}
        <path fill="url(#ml-turtle)" opacity="0.9" d="M-30 16 C -52 2, -62 6, -56 20 C -48 28, -34 28, -26 24 Z" />
        <path fill="url(#ml-turtle)" opacity="0.9" d="M-30 54 C -52 68, -62 64, -56 50 C -48 42, -34 42, -26 46 Z" />
        {/* carapace */}
        <ellipse cx="12" cy="35" rx="42" ry="33" fill="url(#ml-turtle)" />
        {/* scute pattern */}
        <g stroke="#0e1f1d" strokeWidth="1" fill="none" opacity="0.42">
          <path d="M12 4 L0 22 L6 48 L18 48 L24 22 Z" />
          <path d="M-26 35 L0 22 M-26 35 L6 48 M50 35 L24 22 M50 35 L18 48" />
          <path d="M0 22 Q12 15 24 22 M6 48 Q12 55 18 48" />
        </g>
        {/* head */}
        <path fill="url(#ml-turtle)" d="M54 28 C 72 25, 82 30, 82 35 C 82 40, 72 45, 54 42 Z" />
        <circle cx="74" cy="31" r="2" fill="#0b1a18" />
        <circle cx="74" cy="39" r="2" fill="#0b1a18" />
      </svg>
    </div>
  );
}

/* koi - kohaku: streamlined white body with red/orange patches, flowing fins, scales */
function Koi() {
  return (
    <div className={`${styles.swimmer} ${styles.koi}`}>
      <svg viewBox="-34 -12 190 94" className={styles.body}>
        <path className={styles.koiTail} fill="url(#ml-koifin)" d="M24 40 C 2 14, -24 16, -32 30 C -26 35, -24 40, -32 45 C -24 50, -26 56, -32 70 C -24 66, 2 64, 24 40 Z" />
        <path fill="url(#ml-koi)" d="M24 40 C 42 14, 100 10, 132 30 C 142 36, 142 44, 132 50 C 100 70, 42 66, 24 40 Z" />
        <path fill="#d6422a" opacity="0.92" d="M46 23 C 62 16, 80 18, 84 29 C 72 37, 52 37, 46 31 Z" />
        <path fill="#e8702f" opacity="0.86" d="M92 45 C 106 41, 118 43, 120 51 C 110 57, 96 55, 92 51 Z" />
        <path fill="#d6422a" opacity="0.8" d="M30 45 C 42 43, 54 45, 56 51 C 46 57, 34 55, 30 51 Z" />
        <path className={styles.koiDorsal} fill="url(#ml-koifin)" d="M62 15 C 78 -3, 102 -1, 106 17 C 90 13, 76 13, 62 15 Z" />
        <path className={styles.koiPec} fill="url(#ml-koifin)" d="M100 50 C 114 68, 130 70, 128 52 C 118 51, 110 50, 100 50 Z" />
        <path className={styles.koiPelvic} fill="url(#ml-koifin)" d="M74 58 C 80 72, 92 74, 92 60 C 86 59, 80 58, 74 58 Z" />
        <circle cx="124" cy="33" r="3.2" fill="#1a1410" />
        <circle cx="125.2" cy="31.8" r="1.1" fill="#fff" opacity="0.8" />
        <path d="M136 41 q9 1 13 6 M136 45 q8 3 11 9" stroke="#caa784" strokeWidth="1" fill="none" opacity="0.55" />
      </svg>
    </div>
  );
}

/* octopus - bulbous mantle + 8 undulating arms */
function Octopus() {
  return (
    <div className={`${styles.swimmer} ${styles.octopus}`}>
      <svg viewBox="-60 -24 140 150" className={styles.body}>
        <g className={styles.arms} fill="none" stroke="url(#ml-octo)" strokeWidth="6.5" strokeLinecap="round">
          <path d="M-8 34 q-34 28 -40 82" opacity="0.85" />
          <path d="M0 38 q-20 40 -18 86" opacity="0.9" />
          <path d="M9 40 q-6 46 0 88" opacity="0.95" />
          <path d="M17 40 q8 46 2 88" opacity="0.95" />
          <path d="M26 38 q22 40 18 86" opacity="0.9" />
          <path d="M33 34 q36 28 42 80" opacity="0.85" />
          <path d="M-3 40 q-28 46 -30 82" opacity="0.6" />
          <path d="M22 40 q30 46 28 82" opacity="0.6" />
        </g>
        <path fill="url(#ml-octo)" d="M-14 30 C -18 -10, 40 -10, 36 30 C 32 41, 22 43, 12 41 C 6 40, 2 40, -4 41 C -16 43, -10 40, -14 30 Z" />
        <ellipse cx="1" cy="18" rx="5.4" ry="4.2" fill="#1b0f1a" />
        <ellipse cx="20" cy="18" rx="5.4" ry="4.2" fill="#1b0f1a" />
        <circle cx="2.4" cy="16.7" r="1.4" fill="#fff" opacity="0.55" />
        <circle cx="21.4" cy="16.7" r="1.4" fill="#fff" opacity="0.55" />
      </svg>
    </div>
  );
}

/* seahorse - curved body, snout, fluttering dorsal fin, curled tail */
function Seahorse() {
  return (
    <div className={`${styles.swimmer} ${styles.seahorse}`}>
      <svg viewBox="-16 -8 76 124" className={styles.seahorseInner}>
        <path
          fill="url(#ml-seahorse)"
          d="M34 6 C 46 6, 50 22, 38 28 C 28 33, 24 44, 30 53 C 37 63, 33 76, 22 82 C 14 86, 12 95, 18 100 C 24 105, 22 112, 14 110 C 6 108, 6 98, 10 92 C 18 84, 22 72, 16 64 C 9 54, 13 40, 24 34 C 32 30, 36 20, 30 14 C 27 11, 28 6, 34 6 Z"
        />
        <path fill="url(#ml-seahorse)" d="M34 6 C 44 2, 52 4, 54 10 C 50 12, 44 12, 38 12 Z" />
        <g className={styles.shFin} fill="#ffe7b0" opacity="0.4">
          <path d="M14 40 C 4 44, 2 56, 12 60 C 12 52, 14 46, 14 40 Z" />
        </g>
        <g stroke="#7a4e1c" strokeWidth="0.8" opacity="0.35" fill="none">
          <path d="M30 22 l8 3 M26 34 l9 2 M20 48 l9 1 M18 62 l9 0 M16 76 l8 -2" />
        </g>
        <circle cx="40" cy="14" r="1.8" fill="#3a2410" />
      </svg>
    </div>
  );
}

const SHOAL = [
  [6, 14], [22, 6], [20, 24], [38, 12], [40, 30], [54, 4], [56, 22], [70, 14],
  [72, 32], [86, 8], [88, 26], [102, 18], [34, 42], [66, 44],
];
function Shoal() {
  return (
    <div className={`${styles.swimmer} ${styles.shoal}`}>
      <svg viewBox="-6 -4 124 56" className={styles.body}>
        {SHOAL.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} opacity={0.5 + (i % 3) * 0.12}>
            <path fill="#9fd8d0" d="M0 4 C 3 1, 9 1, 12 4 C 9 7, 3 7, 0 4 Z" />
            <path fill="#7FD3C7" d="M0 4 L-3 1.5 L-1.5 4 L-3 6.5 Z" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Living marine life drifting through the deep, layered by depth: god-rays +
 *  caustic light + drifting plankton + swaying kelp, with a whale, manta, turtle,
 *  octopus, koi, seahorse, jellyfish + a shoal. Pure SVG/CSS, reduced-motion safe. */
export function MarineLife() {
  const sea = useVariant("sea", SEA_LOOKS, "current");
  if (sea === "river") return <div className={styles.marine} aria-hidden><CurrentRiver /></div>;
  if (sea === "chart") return <div className={styles.marine} aria-hidden><ChartRoom /></div>;
  if (sea === "light") return <div className={styles.marine} aria-hidden><CathedralLight /></div>;
  if (sea === "shipyard") return <div className={styles.marine} aria-hidden><ShipyardIdeas /></div>;
  return (
    <div className={styles.marine} aria-hidden>
      <Defs />
      <GodRays />
      <Kelp />
      <Whale />
      <Manta />
      <Turtle />
      <Octopus />
      <Shoal />
      <Koi />
      <Seahorse />
      <Jelly />
      <Plankton />
    </div>
  );
}

/* jellyfish kept last so its tentacles layer over the deep creatures */
function Jelly() {
  return (
    <div className={`${styles.swimmer} ${styles.jelly}`}>
      <svg viewBox="0 0 92 180" className={styles.jellyInner}>
        <g className={styles.tentacles} stroke="#9fd8d0" strokeWidth="1.4" fill="none" opacity="0.42">
          <path d="M26 56 q-7 56 2 112" />
          <path d="M37 60 q-4 60 3 116" />
          <path d="M46 62 q0 62 0 118" />
          <path d="M55 60 q4 60 -3 116" />
          <path d="M66 56 q7 56 -2 112" />
        </g>
        <g fill="#bfe9e2" opacity="0.3">
          <path d="M34 54 q-4 30 4 48 q5 -20 2 -48 Z" />
          <path d="M58 54 q4 30 -4 48 q-5 -20 -2 -48 Z" />
          <path d="M46 56 q-3 32 0 52 q3 -20 0 -52 Z" />
        </g>
        <g className={styles.bell}>
          <path fill="url(#ml-jelly)" d="M6 50 C 6 12, 86 12, 86 50 C 86 59, 72 59, 63 54 C 50 48, 42 48, 29 54 C 20 59, 6 59, 6 50 Z" />
          <path fill="#e6f6f3" opacity="0.24" d="M22 40 C 26 21, 66 21, 70 40 C 56 33, 36 33, 22 40 Z" />
        </g>
      </svg>
    </div>
  );
}
