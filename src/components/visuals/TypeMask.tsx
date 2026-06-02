"use client";

import { EDITORIAL } from "@/lib/content/coast";
import styles from "./TypeMask.module.css";

const WORDS = ["COAST", "DESIGN", "FUTURE", "VISION", "EMPIRE", "BOLD"];

/**
 * The image is visible only INSIDE the letterforms (background-clip: text).
 * background-attachment: fixed makes the type a moving window onto the image
 * as you scroll - the picture stays put, the word reveals different parts of it.
 */
export function TypeMask() {
  return (
    <div className={styles.wrap}>
      {WORDS.map((w, i) => {
        const img = EDITORIAL[i % EDITORIAL.length];
        return (
          <section key={w} className={styles.row}>
            <h2 className={styles.word} style={{ backgroundImage: `url(${img.src})` }}>
              {w}
            </h2>
            <span className={styles.tag}>{img.caption}</span>
          </section>
        );
      })}
    </div>
  );
}
