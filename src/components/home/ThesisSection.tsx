"use client";

import { useVariant } from "@/components/visuals/useVariant";
import styles from "./ThesisSection.module.css";

export const THESIS_VARIANTS = ["dive", "reveal", "cards"] as const;

type Beat = { label: string; title: string; body: string };

// The word in each beat's title that carries the punch (lit gold / brightest).
const KEYWORDS = ["invisibility", "accessible", "empires"] as const;

function renderTitle(title: string, kw: string) {
  const i = title.toLowerCase().indexOf(kw.toLowerCase());
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <em>{title.slice(i, i + kw.length)}</em>
      {title.slice(i + kw.length)}
    </>
  );
}

/**
 * The problem / fix / promise thesis as a moment, not a text block. Three
 * treatments selectable via ?thesis= (dive | reveal | cards), default dive.
 */
export function ThesisSection({ items }: { items: readonly Beat[] }) {
  const v = useVariant("thesis", THESIS_VARIANTS, "dive");
  return (
    <div className={`${styles.wrap} ${styles[v]}`} data-thesis={v}>
      {items.map((t, i) => (
        <section key={t.label} className={styles.beat} data-i={i}>
          <div className={styles.inner}>
            <p className={styles.label}>{t.label}</p>
            <h2 className={styles.title}>{renderTitle(t.title, KEYWORDS[i] ?? "")}</h2>
            <p className={styles.body}>{t.body}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
