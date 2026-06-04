"use client";

import { Reveal } from "@/components/motion/Reveal";
import { CBI } from "@/app/(frontend)/offers/content";
import { VideoWave } from "@/components/VideoWave";
import styles from "@/app/(frontend)/offers/offers-lab.module.css";

/**
 * The CBI flagship hero, rebuilt clean: a single glass card, headline + stat row
 * on the left, and a creative wave readout on the right. The wave treatment is
 * variant-driven (?wave=swell|crest|curl, default swell) so David can compare.
 */
export function FlagshipCBI() {
  const m = CBI.mock;
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
            <div className={styles.score}>
              <span className={styles.scoreNum}>{m.score}</span>
              <span className={styles.scoreMax}>/ 100</span>
              <span className={styles.scoreWave}>Wave · {m.waveName}</span>
            </div>
            <p className={styles.scoreLine}>{m.line}</p>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 300,
                aspectRatio: "464 / 688",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              }}
            >
              <VideoWave rounded={false} />
            </div>
          </div>
        </div>
      </a>
    </Reveal>
  );
}
