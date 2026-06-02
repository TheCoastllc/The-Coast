import styles from "./StoryHeroStatic.module.css";

/**
 * Pure CSS/SVG hero scene: warm sun, navy sky, deep swell.
 * - Paints on the first frame (no WebGL compile) so the reef never flashes.
 * - Resolution-independent => crisp on every DPR (fixes mobile pixelation).
 * - Used standalone as the hero on low-end / reduced-motion devices, and as the
 *   instant base that the WebGL hero fades in over on capable devices.
 */
export function StoryHeroStatic() {
  return (
    <div className={styles.stage} aria-hidden>
      <div className={styles.sea} />
      <span className={`${styles.wave} ${styles.wave1}`} />
      <span className={`${styles.wave} ${styles.wave2}`} />
      <span className={styles.reflection} />
      <span className={styles.sunGlow} />
      <span className={styles.sun} />
    </div>
  );
}
