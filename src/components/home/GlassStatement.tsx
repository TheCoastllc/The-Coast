import { type ReactNode } from "react";
import Link from "next/link";
import styles from "./GlassStatement.module.css";

/**
 * Reusable cinematic glass statement: a full-bleed ocean plate with a centered
 * frosted-glass card - the same material as the thesis card, used as the closing
 * moment. The ocean drifts slowly behind the glass. Entrance reveal is handled by
 * the surrounding RevealGroup, so the card is always present (no-JS safe).
 */
export function GlassStatement({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  ghostLabel,
  ghostHref,
  index,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  ghostLabel?: string;
  ghostHref?: string;
  index?: string;
}) {
  return (
    <section className={`section ${styles.wrap}`}>
      <div className={styles.stage}>
        <div className={styles.photo} aria-hidden />
        <div className={styles.grade} aria-hidden />
        {index ? (
          <span className={styles.index} aria-hidden>
            {index}
          </span>
        ) : null}
        <div className={styles.card}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={`${styles.headline} no-marble`}>{title}</h2>
          {body ? <p className={styles.body}>{body}</p> : null}
          <div className={styles.actions}>
            <Link href={ctaHref} className={styles.cta} data-cursor-label="Start">
              {ctaLabel}
              <span className={styles.ctaArrow}>→</span>
            </Link>
            {ghostLabel && ghostHref ? (
              <Link href={ghostHref} className={styles.ghost} data-cursor-label="Explore">
                {ghostLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
