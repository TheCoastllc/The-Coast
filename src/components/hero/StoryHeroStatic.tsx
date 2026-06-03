import styles from "./StoryHeroStatic.module.css";

// One seamless sine ribbon (wavelength 360) that tiles under a -360px translateX loop.
const wavePath = (y: number, a: number) =>
  `M-360 ${y} q 90 ${-a} 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 V200 H-360 Z`;

/**
 * Cinematic CSS/SVG hero: a glowing sun, drifting clouds, undulating waves, and a
 * little origami boat sailing the horizon. No WebGL - crisp on every DPR and fast
 * on phones, but alive. It's the mobile/low-end hero and the instant base the
 * desktop WebGL hero fades in over.
 */
export function StoryHeroStatic() {
  return (
    <div className={styles.stage} aria-hidden>
      <span className={styles.sunGlow} />
      <span className={styles.sun} />

      <span className={`${styles.cloud} ${styles.cloud1}`} />
      <span className={`${styles.cloud} ${styles.cloud2}`} />
      <span className={`${styles.cloud} ${styles.cloud3}`} />

      <span className={styles.horizon} />
      <div className={styles.sea} />

      <svg className={styles.waves} viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path className={`${styles.wave} ${styles.wave1}`} d={wavePath(40, 16)} />
        <path className={`${styles.wave} ${styles.wave2}`} d={wavePath(78, 24)} />
        <path className={`${styles.wave} ${styles.wave3}`} d={wavePath(124, 18)} />
      </svg>

      <span className={styles.reflection} />

      <span className={styles.boat}>
        <svg viewBox="0 0 120 112" className={styles.boatInner}>
          <line x1="60" y1="6" x2="60" y2="68" stroke="#b89a5e" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M57 8 L57 66 L16 66 Z" fill="#f6f1e6" />
          <path d="M57 8 L57 66 L38 66 Z" fill="#e7dcc4" />
          <path d="M63 20 L63 66 L96 66 Z" fill="#efe6d2" />
          <path d="M6 68 L114 68 L98 90 Q60 100 22 90 Z" fill="#caa24a" />
          <path d="M6 68 L114 68 L106 75 L14 75 Z" fill="#dcb866" />
        </svg>
      </span>
    </div>
  );
}
