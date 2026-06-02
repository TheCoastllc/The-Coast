import styles from "./StoryHeroStatic.module.css";

/**
 * Pure CSS/SVG hero scene: a crisp warm sun over a calm sea with a luminous
 * horizon. Paints on the first frame (no WebGL compile) so nothing flashes;
 * resolution-independent => sharp on every DPR. It is the standalone hero on
 * phones / low-end / reduced-motion, and the instant base the WebGL hero fades
 * in over on capable desktops.
 */
export function StoryHeroStatic() {
  return (
    <div className={styles.stage} aria-hidden>
      <div className={styles.sea} />
      <span className={styles.horizon} />
      <span className={`${styles.swell} ${styles.swell1}`} />
      <span className={`${styles.swell} ${styles.swell2}`} />
      <span className={styles.reflection} />
      <span className={styles.sunGlow} />
      <span className={styles.sun} />
    </div>
  );
}
