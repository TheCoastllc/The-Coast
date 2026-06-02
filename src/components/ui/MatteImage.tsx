import styles from "./MatteImage.module.css";

export type MatteMode = "grain-graded" | "grain-color" | "grain-subtle" | "smooth";

export const MATTE_MODES: MatteMode[] = [
  "grain-graded",
  "grain-color",
  "grain-subtle",
  "smooth",
];

/**
 * An image with a matte texture treatment. Four switchable looks via `mode`
 * (all styling lives in MatteImage.module.css keyed by [data-matte]):
 *   grain-graded - heavy grain + palette duotone grade (unifies the set)
 *   grain-color  - heavy grain, original color
 *   grain-subtle - light grain
 *   smooth       - de-glossed matte, no grain
 * Pure presentational (no hooks) so it works in server or client components.
 */
export function MatteImage({
  src,
  alt,
  mode = "grain-color",
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  mode?: MatteMode;
  className?: string;
  eager?: boolean;
}) {
  return (
    <figure className={`${styles.frame} ${className ?? ""}`} data-matte={mode}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.img}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <span className={styles.grade} aria-hidden />
      <span className={styles.grain} aria-hidden />
      <span className={styles.veil} aria-hidden />
      <span className={styles.vignette} aria-hidden />
    </figure>
  );
}
