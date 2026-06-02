"use client";

import Link from "next/link";
import { StoryHero } from "@/components/hero/StoryHero";
import { StoryHeadline } from "@/components/hero/StoryHeadline";
import { FoldingBoat } from "@/components/hero/FoldingBoat";
import { RevealGroup } from "@/components/motion/RevealGroup";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { THESIS, SERVICES, WORK, STATS, COMPANY, EDITORIAL } from "@/lib/content/coast";
import styles from "./HomeOcean.module.css";

/* Google Reviews social proof. HomeOcean is a client component and
 * src/lib/google-reviews.ts is server-only (module-level fetch), so the
 * aggregate rating + representative reviews are inlined here as client-safe
 * constants rather than imported. */
const REVIEW_RATING = { average: 5.0, count: 7 } as const;

const REVIEWS = [
  {
    quote:
      "The Coast took our vision and turned it into something far beyond what we imagined. The design work was sharp, the strategy was clear, and they shipped on time.",
    name: "Founder, Healthcare Startup",
    stars: 5,
  },
  {
    quote:
      "Working with this team felt like a true partnership. They asked the right questions, pushed back when it mattered, and the final product spoke for itself.",
    name: "Operations Director",
    stars: 5,
  },
  {
    quote:
      "Professional, creative, and deeply invested in our success. Our brand finally looks the way it should and the results followed.",
    name: "Small Business Owner",
    stars: 5,
  },
] as const;

function Stars({ count }: { count: number }) {
  return (
    <span className={styles.reviewStars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/** The home exactly as built in coast-site: the scroll-driven boat-voyage hero
 *  (StoryHero + morphing StoryHeadline) over a tall runway, then the editorial
 *  content sections, then the folding-boat finale. Baked (no ?hero/?meet switcher). */
type DisplayReview = { quote: string; name: string; stars: number };

export function HomeOcean({
  reviews,
  reviewStats,
}: {
  /** Real Google reviews fetched server-side; falls back to representative samples. */
  reviews?: DisplayReview[];
  reviewStats?: { average: number; count: number };
} = {}) {
  const displayReviews: readonly DisplayReview[] =
    reviews && reviews.length >= 1 ? reviews.slice(0, 3) : REVIEWS;
  const displayRating =
    reviewStats && reviewStats.count > 0 ? reviewStats : REVIEW_RATING;
  return (
    <>
      <StoryHero meet="reflect" />
      <StoryHeadline />
      {/* tall transparent runway: gives scroll distance for the 3 hero acts */}
      <div className={styles.storyTrack} />

      <div className={styles.content}>
        <RevealGroup>
          {THESIS.map((t) => (
            <section key={t.label} className={`section ${styles.thesis}`}>
              <p className={styles.thesisLabel}>{t.label}</p>
              <h2 className={styles.thesisTitle}>{t.title}</h2>
              <p className={styles.thesisBody}>{t.body}</p>
            </section>
          ))}

          <section className="section">
            <div className={styles.imageBand}>
              <ParallaxImage src={EDITORIAL[1].src} alt={EDITORIAL[1].alt} mode="grain-graded" amount={14} />
              <div className={styles.imageBandCaption}>
                <p className={styles.imageBandText}>{EDITORIAL[1].caption}</p>
              </div>
            </div>
          </section>

          <section className={`section ${styles.venturesPreview}`}>
            <p className={styles.thesisLabel}>What we do</p>
            <div className={styles.ventureList}>
              {SERVICES.slice(0, 4).map((s) => (
                <article key={s.name} className={`${styles.ventureRow} glass`}>
                  <div className={styles.ventureName}>
                    <span>{s.name}</span>
                  </div>
                  <p className={styles.ventureTag}>{s.body}</p>
                  <span className={styles.ventureStatus} />
                </article>
              ))}
            </div>
            <Link href="/services" className={styles.cta} data-cursor-label="See all">
              All services
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </section>

          <section className={`section ${styles.venturesPreview}`}>
            <p className={styles.thesisLabel}>Selected work</p>
            <div className={styles.ventureList}>
              {WORK.slice(0, 5).map((w) => (
                <article key={w.name} className={`${styles.ventureRow} glass`}>
                  <div className={styles.ventureName}>
                    <span>{w.name}</span>
                  </div>
                  <p className={styles.ventureTag}>{w.category}</p>
                  <span className={styles.ventureStatus} />
                </article>
              ))}
            </div>
            <Link href="/work" className={styles.cta} data-cursor-label="Explore">
              All work
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </section>

          <section className="section">
            <div className={styles.imageBand}>
              <ParallaxImage src={EDITORIAL[3].src} alt={EDITORIAL[3].alt} mode="grain-graded" amount={14} />
              <div className={styles.imageBandCaption}>
                <p className={styles.imageBandText}>{EDITORIAL[3].caption}</p>
              </div>
            </div>
          </section>

          <section className={`section ${styles.statsSection}`}>
            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`section ${styles.reviewsSection}`}>
            <p className={styles.thesisLabel}>What clients say</p>
            <p className={styles.reviewsRating}>
              <span className={styles.reviewsRatingStars} aria-hidden="true">★</span>
              {displayRating.average.toFixed(1)}
              <span className={styles.reviewsRatingFrom}>
                from {displayRating.count} Google reviews
              </span>
            </p>
            <div className={styles.reviewGrid}>
              {displayReviews.map((r) => (
                <article key={r.name} className={`${styles.reviewCard} glass`}>
                  <Stars count={r.stars} />
                  <p className={styles.reviewQuote}>{r.quote}</p>
                  <p className={styles.reviewName}>{r.name}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={`section ${styles.closing}`}>
            <h2 className={styles.closingTitle}>{COMPANY.promise}.</h2>
            <Link href="/contact" className={styles.cta} data-cursor-label="Start">
              Start a project
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </section>
        </RevealGroup>
      </div>

      {/* the folding finale - flat paper scrubs into a boat */}
      <FoldingBoat />
    </>
  );
}
