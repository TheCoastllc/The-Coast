"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { variantForIndex } from "@/components/motion/revealVariants";
import styles from "./SelectedWork.module.css";

export const WORK_VARIANTS = ["rows", "cards", "hero"] as const;
export type WorkVariant = (typeof WORK_VARIANTS)[number];

export type WorkCase = {
  slug: string;
  client: string;
  category: string;
  year?: number;
  image: string;
  tagline?: string;
  summary?: string;
};

function meta(w: WorkCase) {
  return w.year ? `${w.category} · ${w.year}` : w.category;
}

/**
 * "Selected work" - three premium, story-led treatments behind ?work=:
 *  - rows  : editorial alternating rows (big cover + tagline + summary + View case)
 *  - cards : cinematic 2-up feature cards (story on hover / always on touch)
 *  - hero  : one full-width featured case + a tidy mini grid of the rest
 * Every case links to /work/<slug>. Fully responsive; no cursor-only states.
 */
export function SelectedWork({ cases, variant = "rows" }: { cases: WorkCase[]; variant?: WorkVariant }) {
  if (variant === "cards") {
    return (
      <div className={styles.cards}>
        {cases.map((w, i) => (
          <Reveal key={w.slug} variant={variantForIndex(i)}>
            <Link href={`/work/${w.slug}`} className={styles.card} data-cursor-label="View case">
              <div className={styles.cardMedia}>
                <Image src={w.image} alt={w.client} fill sizes="(max-width: 760px) 100vw, 50vw" className="object-cover" />
              </div>
              <span className={styles.cardScrim} aria-hidden />
              <div className={styles.cardBody}>
                <span className={styles.cardCat}>{meta(w)}</span>
                <h3 className={styles.cardClient}>{w.client}</h3>
                {w.tagline && <p className={styles.cardTagline}>{w.tagline}</p>}
                {w.summary && <p className={styles.cardSummary}>{w.summary}</p>}
                <span className={styles.cardCta}>View case →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    );
  }

  if (variant === "hero") {
    const [lead, ...rest] = cases;
    if (!lead) return null;
    return (
      <div className={styles.heroWrap}>
        <Reveal variant="mask-wipe">
          <Link href={`/work/${lead.slug}`} className={styles.feature} data-cursor-label="View case">
            <div className={styles.featureMedia}>
              <Image src={lead.image} alt={lead.client} fill sizes="(max-width: 1100px) 100vw, 1080px" className="object-cover" />
            </div>
            <span className={styles.featureScrim} aria-hidden />
            <div className={styles.featureText}>
              <span className={styles.featureCat}>Featured · {meta(lead)}</span>
              <h3 className={styles.featureClient}>{lead.client}</h3>
              {lead.tagline && <p className={styles.featureTagline}>{lead.tagline}</p>}
              {lead.summary && <p className={styles.featureSummary}>{lead.summary}</p>}
              <span className={styles.cardCta}>View case →</span>
            </div>
          </Link>
        </Reveal>
        <div className={styles.miniGrid}>
          {rest.map((w, i) => (
            <Reveal key={w.slug} variant={variantForIndex(i)}>
              <Link href={`/work/${w.slug}`} className={styles.mini} data-cursor-label="View">
                <div className={styles.miniMedia}>
                  <Image src={w.image} alt={w.client} fill sizes="(max-width: 600px) 50vw, 25vw" className="object-cover" />
                </div>
                <span className={styles.miniScrim} aria-hidden />
                <div className={styles.miniMeta}>
                  <span className={styles.miniClient}>{w.client}</span>
                  <span className={styles.miniCat}>{w.category}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  // rows (default): editorial alternating story rows
  return (
    <div className={styles.rows}>
      {cases.map((w, i) => (
        <Reveal key={w.slug} variant={i % 2 ? "rise-blur" : "mask-wipe"}>
          <Link
            href={`/work/${w.slug}`}
            className={`${styles.row} ${i % 2 ? styles.rowAlt : ""}`}
            data-cursor-label="View case"
          >
            <div className={styles.rowMedia}>
              <Image src={w.image} alt={w.client} fill sizes="(max-width: 900px) 100vw, 52vw" className="object-cover" />
            </div>
            <div className={styles.rowText}>
              <span className={styles.rowCat}>{meta(w)}</span>
              <h3 className={styles.rowClient}>{w.client}</h3>
              {w.tagline && <p className={styles.rowTagline}>{w.tagline}</p>}
              {w.summary && <p className={styles.rowSummary}>{w.summary}</p>}
              <span className={styles.rowCta}>View case →</span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
