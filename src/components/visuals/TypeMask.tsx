"use client";

import { EDITORIAL } from "@/lib/content/coast";
import styles from "./TypeMask.module.css";

const WORDS = ["COAST", "DESIGN", "FUTURE", "VISION", "EMPIRE", "BOLD"];

/**
 * The image is visible only INSIDE the letterforms (background-clip: text).
 * background-attachment: fixed makes the type a moving window onto the image
 * as you scroll - the picture stays put, the word reveals different parts of it.
 *
 * Props let it run as either the multi-row /visuals demo (no props) or a single
 * real headline (pass `words` + `image`). `size="headline"` shrinks it to sit
 * inside a page section instead of taking the full viewport.
 */
export function TypeMask({
  words = WORDS,
  image,
  images,
  size = "display",
}: {
  words?: string[];
  image?: string;
  images?: string[];
  size?: "display" | "headline";
}) {
  const real = !!image || !!images;
  return (
    <div className={`${styles.wrap} ${size === "headline" ? styles.compact : ""}`}>
      {words.map((w, i) => {
        const src = image ?? images?.[i % images.length] ?? EDITORIAL[i % EDITORIAL.length].src;
        return (
          <section key={`${w}-${i}`} className={styles.row}>
            <h2 className={styles.word} style={{ backgroundImage: `url(${src})` }}>
              {w}
            </h2>
            {!real && <span className={styles.tag}>{EDITORIAL[i % EDITORIAL.length].caption}</span>}
          </section>
        );
      })}
    </div>
  );
}
