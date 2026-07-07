import styles from "./SeaBackdrop.module.css";

/** The site's living deep-ocean backdrop: a flowing deep-blue ground + glowing
 *  animated marine life, behind all content (z:0). The homepage keeps its own
 *  cinematic StoryHero. (A photoreal-reef backdrop was trialled in R14 and
 *  reverted; true reef motion is being pursued via an AI image->video loop.) */
export function SeaBackdrop() {
  return (
    <div className={styles.ground} aria-hidden>
      <div className={styles.aurora} />
    </div>
  );
}
