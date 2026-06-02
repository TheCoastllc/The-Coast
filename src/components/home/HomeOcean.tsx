"use client";

import Link from "next/link";
import Image from "next/image";
import { HeroStage } from "@/components/hero/HeroStage";
import { StoryHeadline } from "@/components/hero/StoryHeadline";
import dynamic from "next/dynamic";
import { useWebGLAllowed } from "@/lib/perf";
import { RevealGroup } from "@/components/motion/RevealGroup";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { THESIS, SERVICES, STATS, COMPANY, EDITORIAL } from "@/lib/content/coast";
import { CASE_STUDIES } from "@/lib/case-studies";
import { TRUSTED_BRANDS_FALLBACK } from "@/lib/trusted-brands-fallback";
import { ReviewsMarquee } from "./ReviewsMarquee";
import styles from "./HomeOcean.module.css";

// three.js finale - desktop only, lazy-loaded (never on touch / low-end).
const FoldingBoat = dynamic(
  () => import("@/components/hero/FoldingBoat").then((m) => ({ default: m.FoldingBoat })),
  { ssr: false }
);

/* Clients shown on the "Trusted by" wall (real roster; links to case studies or live sites). */
const CLIENTS = TRUSTED_BRANDS_FALLBACK;

/* Image-led "Selected work" cards — ready, cinematic case studies that have a cover frame. */
const FEATURED_CASES = Object.entries(CASE_STUDIES)
  .filter(([, c]) => c.ready && c.style === "cinematic" && !!c.moments?.length)
  .slice(0, 6)
  .map(([slug, c]) => ({
    slug,
    client: c.client ?? slug,
    category: c.category ?? "",
    year: c.year,
    image: c.moments![0].image,
  }));

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

/** The home exactly as built in coast-site: the scroll-driven boat-voyage hero
 *  (StoryHero + morphing StoryHeadline) over a tall runway, then the editorial
 *  content sections, then the folding-boat finale. Baked (no ?hero/?meet switcher). */
type DisplayReview = { quote: string; name: string; stars: number; avatar?: string | null; date?: string | null };

const FALLBACK_LEAVE_URL =
  "https://search.google.com/local/writereview?placeid=ChIJ_fjV-mLpAo4Riif8WzjsV70";

export function HomeOcean({
  reviews,
  reviewStats,
  leaveReviewUrl,
}: {
  /** Real Google reviews fetched server-side; falls back to representative samples. */
  reviews?: DisplayReview[];
  reviewStats?: { average: number; count: number };
  leaveReviewUrl?: string;
} = {}) {
  const displayReviews: DisplayReview[] =
    reviews && reviews.length >= 1 ? reviews : [...REVIEWS];
  const displayRating =
    reviewStats && reviewStats.count > 0 ? reviewStats : REVIEW_RATING;
  const webgl = useWebGLAllowed();
  return (
    <>
      <HeroStage meet="reflect" />
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

          <section className={`section ${styles.clientsSection}`}>
            <p className={styles.thesisLabel}>Trusted by</p>
            <div className={styles.clientsWall}>
              {CLIENTS.map((c) => {
                const href = c.caseStudySlug ? `/work/${c.caseStudySlug}` : c.url ?? null;
                const inner = (
                  <>
                    <span className={styles.clientWordmark}>{c.wordmark ?? c.name}</span>
                    {c.category && <span className={styles.clientCat}>{c.category}</span>}
                  </>
                );
                if (!href) return <span key={c.id} className={styles.clientLink}>{inner}</span>;
                return href.startsWith("http") ? (
                  <a key={c.id} href={href} target="_blank" rel="noopener noreferrer" className={styles.clientLink} data-cursor-label="Visit">{inner}</a>
                ) : (
                  <Link key={c.id} href={href} className={styles.clientLink} data-cursor-label="Case study">{inner}</Link>
                );
              })}
            </div>
          </section>

          <section className={`section ${styles.workShowcase}`}>
            <p className={styles.thesisLabel}>Selected work</p>
            <div className={styles.workGrid}>
              {FEATURED_CASES.map((w) => (
                <Link key={w.slug} href={`/work/${w.slug}`} className={styles.workCard} data-cursor-label="View">
                  <div className={styles.workThumb}>
                    <Image src={w.image} alt={w.client} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <span className={styles.workScrim} aria-hidden="true" />
                  <span className={styles.workCardArrow} aria-hidden="true">↗</span>
                  <div className={styles.workCardMeta}>
                    <span className={styles.workClient}>{w.client}</span>
                    <span className={styles.workCat}>
                      <span>{w.category}</span>
                      {w.year && <span>{w.year}</span>}
                    </span>
                  </div>
                </Link>
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
            <ReviewsMarquee
              reviews={displayReviews}
              rating={displayRating}
              leaveReviewUrl={leaveReviewUrl ?? FALLBACK_LEAVE_URL}
            />
          </section>

          <section className="section">
            <div className={`${styles.waveTeaser} glass`} data-glow="gold">
              <p className={styles.thesisLabel}>The Coast Brand Index</p>
              <h2 className={styles.waveTitle}>How strong is your wave?</h2>
              <p className={styles.waveCopy}>
                Score your brand across five pillars and get your Wave Rating in under two minutes. Free, instant, and built to show you exactly where to sharpen.
              </p>
              <Link href="/cbi" className={styles.cta} data-cursor-label="Measure">
                Take the test
                <span className={styles.ctaArrow}>→</span>
              </Link>
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
      {webgl && <FoldingBoat />}
    </>
  );
}
