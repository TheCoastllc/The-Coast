"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { LedgerBrand } from "@/components/TrustedLedger";
import styles from "./TrustedBy.module.css";

export const CLIENT_VARIANTS = ["wall", "marquee", "ledger"] as const;
export type ClientsVariant = (typeof CLIENT_VARIANTS)[number];

function linkOf(c: LedgerBrand): { href: string; external: boolean } | null {
  if (c.caseStudySlug) return { href: `/work/${c.caseStudySlug}`, external: false };
  if (c.url) return { href: c.url, external: true };
  return null;
}

/** Wraps a client's content in the right anchor (case study Link, external <a>, or plain span). */
function Anchor({ c, className, children }: { c: LedgerBrand; className: string; children: ReactNode }) {
  const l = linkOf(c);
  if (!l) return <span className={className}>{children}</span>;
  return l.external ? (
    <a className={className} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor-label="Visit">
      {children}
    </a>
  ) : (
    <Link className={className} href={l.href} data-cursor-label="Case study">
      {children}
    </Link>
  );
}

/**
 * "Trusted by" client roster, three premium treatments behind ?clients=:
 *  - wall    : refined tiered grid (wordmark + sector + year, hairline cells)
 *  - marquee : continuous auto-scroll ribbon of names
 *  - ledger  : structured manifest list (## · name · sector · year)
 * All render on every device; marquee falls back to the wall under reduced-motion.
 */
export function TrustedBy({ clients, variant = "wall" }: { clients: LedgerBrand[]; variant?: ClientsVariant }) {
  const reduced = useReducedMotion();

  if (variant === "ledger") {
    return (
      <ol className={styles.ledger}>
        {clients.map((c, i) => (
          <li key={c.id} className={styles.ledgerRow}>
            <Anchor c={c} className={styles.ledgerLink}>
              <span className={styles.ledgerIdx}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.ledgerName}>{c.wordmark ?? c.name}</span>
              {c.category && <span className={styles.ledgerCat}>{c.category}</span>}
              {c.year && <span className={styles.ledgerYear}>{c.year}</span>}
            </Anchor>
          </li>
        ))}
      </ol>
    );
  }

  if (variant === "marquee" && !reduced) {
    const reel = [...clients, ...clients];
    return (
      <div className={styles.marqueeViewport}>
        <motion.div
          className={styles.marqueeTrack}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, ease: "linear", duration: 40 } }}
        >
          {reel.map((c, i) => (
            <Anchor key={`${c.id}-${i}`} c={c} className={styles.marqueeItem}>
              <span className={styles.marqueeName}>{c.wordmark ?? c.name}</span>
              <span className={styles.marqueeDot} aria-hidden>
                ◆
              </span>
            </Anchor>
          ))}
        </motion.div>
      </div>
    );
  }

  // wall (default; also the reduced-motion fallback for marquee)
  return (
    <div className={styles.wall}>
      {clients.map((c) => (
        <Anchor key={c.id} c={c} className={styles.tile}>
          <span className={styles.tileName}>{c.wordmark ?? c.name}</span>
          {c.category && <span className={styles.tileCat}>{c.category}</span>}
          {c.year && <span className={styles.tileYear}>{c.year}</span>}
        </Anchor>
      ))}
    </div>
  );
}
