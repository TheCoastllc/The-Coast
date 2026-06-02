import Image from "next/image";
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
 * Served through next/image (fill + responsive sizes) so phones download a
 * device-width AVIF/WebP, not the full-resolution source.
 */
export function MatteImage({
  src,
  alt,
  mode = "grain-color",
  className,
  eager = false,
  sizes,
}: {
  src: string;
  alt: string;
  mode?: MatteMode;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <figure className={`${styles.frame} ${className ?? ""}`} data-matte={mode}>
      <Image
        className={styles.img}
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"}
        priority={eager}
        loading={eager ? undefined : "lazy"}
        style={{ objectFit: "cover" }}
      />
      <span className={styles.grade} aria-hidden />
      <span className={styles.grain} aria-hidden />
      <span className={styles.veil} aria-hidden />
      <span className={styles.vignette} aria-hidden />
    </figure>
  );
}
