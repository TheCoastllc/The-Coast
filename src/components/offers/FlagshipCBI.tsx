"use client";

import { Reveal } from "@/components/motion/Reveal";
import { CBI } from "@/app/(frontend)/offers/content";
import { CbiTour } from "./CbiTour";
import styles from "@/app/(frontend)/offers/offers-lab.module.css";

/**
 * The CBI flagship hero, rebuilt clean: a single glass card, headline + stat row
 * on the left, and a creative wave readout on the right. The wave treatment is
 * variant-driven (?wave=swell|crest|curl, default swell) so David can compare.
 */
export function FlagshipCBI() {
  return (
    <Reveal variant="scale-in">
      <a
        href={CBI.href}
        className={`glass ${styles.flagship}`}
        data-glow="gold"
        data-cursor-label="Open"
      >
        <span className={styles.flagBloom} aria-hidden />
        <div className={styles.flagshipGrid}>
          <div>
            <span className={styles.flagBadge}>{CBI.eyebrow}</span>
            <h2 className={styles.flagTitle}>{CBI.headline}</h2>
            <p className={styles.flagBlurb}>{CBI.blurb}</p>

            <div className={styles.flagMeta}>
              <div className={styles.flagMetaItem}>
                <span className={styles.flagMetaVal}>5</span>
                <span className={styles.flagMetaLabel}>Pillars</span>
              </div>
              <div className={styles.flagMetaItem}>
                <span className={styles.flagMetaVal}>20</span>
                <span className={styles.flagMetaLabel}>Criteria</span>
              </div>
              <div className={styles.flagMetaItem}>
                <span className={styles.flagMetaVal}>2 min</span>
                <span className={styles.flagMetaLabel}>To result</span>
              </div>
              <div className={styles.flagMetaItem}>
                <span className={styles.flagMetaVal}>Free</span>
                <span className={styles.flagMetaLabel}>Always</span>
              </div>
            </div>
            <span className="pill">{CBI.cta} →</span>
          </div>

          <div className={styles.waveWrap}>
            <span className={styles.waveTag}>Illustrative result</span>
            {/* a cursor takes the Index (3 real questions) and the Wave result counts up;
                reduced motion shows the result; the score stays the published mock */}
            <CbiTour />
          </div>
        </div>
      </a>
    </Reveal>
  );
}
