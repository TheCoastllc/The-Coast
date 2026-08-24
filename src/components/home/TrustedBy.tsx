"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { LedgerBrand } from "@/components/TrustedLedger";
import styles from "./TrustedBy.module.css";

export const CLIENT_VARIANTS = ["index", "wall", "marquee", "ledger"] as const;
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
 * "Trusted by" client roster, four treatments behind ?clients=:
 *  - index   : DEFAULT. Editorial client index - hovering a row reveals that
 *              client's actual site (the case-study cover) floating beside the
 *              cursor. Names assert; the work proves. Rows without a case study
 *              still link out, they just carry no preview. On touch, rows show
 *              a small inline thumbnail instead of the cursor preview.
 *  - wall    : refined tiered grid (wordmark + sector + year, hairline cells)
 *  - marquee : continuous auto-scroll ribbon of names
 *  - ledger  : structured manifest list (## · name · sector · year)
 * All render on every device; marquee falls back to the wall under reduced-motion.
 */

const coverOf = (c: LedgerBrand): string | null =>
  c.caseStudySlug ? `/portfolio/${c.caseStudySlug}/cover.jpg` : null;

function IndexVariant({ clients }: { clients: LedgerBrand[] }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  // cursor-follow with a soft lag; rAF only runs while a row is hovered
  useEffect(() => {
    if (!fine || !hovered || reduced) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.18;
      p.y += (p.ty - p.y) * 0.18;
      const el = previewRef.current;
      if (el) el.style.transform = `translate3d(${p.x + 28}px, ${p.y - 110}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    pos.current.x = pos.current.tx;
    pos.current.y = pos.current.ty;
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, hovered, reduced]);

  const active = clients.find((c) => c.id === hovered);
  const activeCover = active ? coverOf(active) : null;

  return (
    <div className={styles.index}>
      <ol className={styles.indexList}>
        {clients.map((c, i) => {
          const cover = coverOf(c);
          return (
            <li
              key={c.id}
              className={styles.indexRow}
              onPointerEnter={() => setHovered(c.id)}
              onPointerLeave={() => setHovered((h) => (h === c.id ? null : h))}
            >
              <Anchor c={c} className={styles.indexLink}>
                <span className={styles.indexIdx}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.indexName}>{c.wordmark ?? c.name}</span>
                {c.category && <span className={styles.indexCat}>{c.category}</span>}
                {c.year && <span className={styles.indexYear}>{c.year}</span>}
                <span className={styles.indexArrow} aria-hidden>
                  {"\u2197"}
                </span>
                {/* touch fallback: a small inline thumb instead of the cursor preview */}
                {!fine && cover && (
                  <span className={styles.indexThumb}>
                    <Image src={cover} alt="" width={128} height={72} className={styles.indexThumbImg} />
                  </span>
                )}
              </Anchor>
            </li>
          );
        })}
      </ol>
      {/* the floating proof - only ever mounted on fine pointers */}
      {fine && !reduced && (
        <div
          ref={previewRef}
          className={styles.indexPreview}
          data-visible={Boolean(activeCover)}
          aria-hidden
        >
          {activeCover && (
            <Image
              key={activeCover}
              src={activeCover}
              alt=""
              width={384}
              height={216}
              className={styles.indexPreviewImg}
              priority={false}
            />
          )}
        </div>
      )}
    </div>
  );
}
export function TrustedBy({ clients, variant = "index" }: { clients: LedgerBrand[]; variant?: ClientsVariant }) {
  const reduced = useReducedMotion();

  if (variant === "index") {
    return <IndexVariant clients={clients} />;
  }

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
      <div className={styles.marqueeViewport} data-mo="drift">
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
