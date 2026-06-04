import styles from "./StoryHeroStatic.module.css";

/**
 * Cinematic CSS hero: a glowing sun, drifting clouds, and flowing waves. All motion
 * is GPU-composited (transform/opacity), so it's smooth on phones and never blocks
 * the main thread - no WebGL, crisp on every DPR. It's the instant base the WebGL
 * hero fades in over (and the reduced-motion fallback). No boat - the boat is part
 * of the WebGL voyage, which only sails in as you scroll.
 */
export function StoryHeroStatic() {
  return (
    <div className={styles.stage} aria-hidden>
      <span className={styles.sunGlow} />
      <span className={styles.sun} />

      <span className={`${styles.cloud} ${styles.cloud1}`} />
      <span className={`${styles.cloud} ${styles.cloud2}`} />

      <span className={styles.horizon} />
      <div className={styles.sea} />

      <div className={`${styles.waveLayer} ${styles.waveBack}`} />
      <div className={`${styles.waveLayer} ${styles.waveMid}`} />
      <div className={`${styles.waveLayer} ${styles.waveFront}`} />

      <span className={styles.reflection} />
    </div>
  );
}
