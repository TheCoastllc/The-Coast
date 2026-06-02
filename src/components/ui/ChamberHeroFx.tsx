"use client";

import { usePremiumActive } from "@/components/chrome/usePremium";
import styles from "./ChamberHeroFx.module.css";

/** Minimal sea-chart wayfinding behind a chamber title: faint corner
 *  coordinates + (default) a plot label, or - with the "orbital" premium flag -
 *  a glowing gold sun-core ringed by slowly-rotating orbits (deck slide 10). */
export function ChamberHeroFx() {
  const orbital = usePremiumActive().has("orbital");
  return (
    <div className={styles.chart} aria-hidden>
      <span className={`${styles.coord} ${styles.coordTop}`}>28.0000&deg; N</span>
      <span className={`${styles.coord} ${styles.coordBot}`}>50.0000&deg; W</span>
      {orbital ? (
        <div className={styles.orbital}>
          <span className={styles.orbitCore} />
          <svg className={styles.orbitRings} viewBox="-100 -100 200 200" aria-hidden>
            <circle className={styles.ringTeal} cx="0" cy="0" r="44" />
            <circle className={styles.ringGold} cx="0" cy="0" r="68" />
            <circle className={styles.ringTeal} cx="0" cy="0" r="92" />
            <circle className={styles.orbitDot} cx="0" cy="-68" r="2.4" />
            <circle className={styles.orbitDot} cx="44" cy="0" r="2" />
          </svg>
        </div>
      ) : (
        <span className={styles.plot}>+ PLOT 02 &middot; 40 FATHOMS</span>
      )}
    </div>
  );
}
