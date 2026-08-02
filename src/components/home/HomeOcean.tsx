"use client";

import Link from "next/link";
import Image from "next/image";
import { HeroStage } from "@/components/hero/HeroStage";
import { StageLight } from "@/components/hero/StageLight";
import { StoryHeadline } from "@/components/hero/StoryHeadline";
import dynamic from "next/dynamic";
import { useDesktopOnlyWebGL, useHeroMountTrigger } from "@/lib/perf";
import { useVariant } from "@/components/visuals/useVariant";
import { TrustedBy, CLIENT_VARIANTS } from "./TrustedBy";
import { ServiceStack } from "./services/ServiceWorlds";
import { SelectedWork, WORK_VARIANTS } from "./SelectedWork";
import { GalleryPreview, type GalleryPreviewItem } from "./GalleryPreview";
import { IntroCurtain } from "./IntroCurtain";
import { FilmStrip } from "./FilmStrip";
import { MasterpieceThesis } from "./MasterpieceThesis";
import { PaintSweep } from "./PaintSweep";
import { GlassStatement } from "./GlassStatement";
import { VideoWave } from "@/components/VideoWave";
import { RevealGroup } from "@/components/motion/RevealGroup";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { CountUp } from "@/components/motion/CountUp";
import { STATS, EDITORIAL } from "@/lib/content/coast";
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

/* Image-led "Selected work" cards - ready, cinematic case studies that have a cover frame. */
const FEATURED_CASES = Object.entries(CASE_STUDIES)
  .filter(([, c]) => c.ready && c.style === "cinematic" && !!c.moments?.length)
  .slice(0, 6)
  .map(([slug, c]) => ({
    slug,
    client: c.client ?? slug,
    category: c.category ?? "",
    year: c.year,
    image: c.moments![0].image,
    tagline: c.tagline,
    summary: c.summary,
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
  galleryPreview = [],
}: {
  /** Real Google reviews fetched server-side; falls back to representative samples. */
  reviews?: DisplayReview[];
  reviewStats?: { average: number; count: number };
  leaveReviewUrl?: string;
  /** A few live gallery images for the homepage teaser. */
  galleryPreview?: GalleryPreviewItem[];
} = {}) {
  const displayReviews: DisplayReview[] =
    reviews && reviews.length >= 1 ? reviews : [...REVIEWS];
  const displayRating =
    reviewStats && reviewStats.count > 0 ? reviewStats : REVIEW_RATING;
  const webgl = useDesktopOnlyWebGL();
  const interacted = useHeroMountTrigger(); // keep three.js out of synthetic audits
  const clientsVariant = useVariant("clients", CLIENT_VARIANTS, "wall");
  const workVariant = useVariant("work", WORK_VARIANTS, "rows");

  return (
    <>
      {/* The page's true, crawlable h1. Visually hidden via an inline style (not
          a utility class, so it never depends on CSS generation) so it never
          disturbs the cinematic hero, while still carrying the ranking keyword
          and giving the homepage exactly one keyword-bearing heading - the morph
          phrases in StoryHeadline are aria-hidden decoration. */}
      <h1
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        The Coast Global - Branding, Digital Growth & AI Agency in Dallas-Fort Worth for Entrepreneurs, Artists, and Growing Businesses
      </h1>
      <IntroCurtain />
      <HeroStage meet="reflect" />
      <StageLight />
      <StoryHeadline />
      {/* tall transparent runway: gives scroll distance for the 3 hero acts */}
      <div className={styles.storyTrack} />

      {/* ?film=on build-off: scroll-scrubbed flagship film - its spacer adds
          runway between the hero and the content; null when the flag is off */}
      <FilmStrip />

      <main className={styles.content}>
        <RevealGroup>
          <MasterpieceThesis />

          <section className="section">
            <div className={styles.waveBand}>
              <div className={styles.waveViz}>
                <VideoWave rounded={false} />
              </div>
              <div className={styles.waveInfo}>
                <p className={styles.waveLabel} data-mo="eyebrow">Coast Brand Index</p>
                <h2 className={styles.waveTitle} data-mo="title">
                  How strong is your <em>wave?</em>
                </h2>
                <p className={styles.waveCopy} data-mo="lead">
                  Score your brand across five pillars and get your Wave Rating in under two minutes. Free, instant, and built to show you exactly where to sharpen.
                </p>
                <div className={styles.waveMeta} data-mo="lead">
                  <span>Five pillars</span>
                  <span>Two minutes</span>
                  <span>Instant score</span>
                </div>
                <a href="https://cbi.coastglobal.org" className={styles.waveCta} data-cursor-label="Measure" data-mo="magnetic">
                  Take the test
                  <span className={styles.ctaArrow}>→</span>
                </a>
              </div>
            </div>
          </section>

          <section className="section">
            <div className={styles.imageBand}>
              <ParallaxImage src={EDITORIAL[1].src} alt={EDITORIAL[1].alt} mode="grain-graded" amount={14} />
              <div className={styles.imageBandCaption}>
                <p className={styles.imageBandText} data-mo="lead">{EDITORIAL[1].caption}</p>
              </div>
            </div>
          </section>

          <section className={`section ${styles.venturesPreview}`}>
            <p className={styles.thesisLabel} data-mo="eyebrow">What we do</p>
            <ServiceStack />
            <Link href="/services" className={styles.cta} data-cursor-label="See all" data-mo="magnetic">
              All services
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </section>

          <PaintSweep />

          <section className={`section ${styles.clientsSection}`}>
            <p className={styles.thesisLabel} data-mo="eyebrow">Trusted by</p>
            <TrustedBy clients={CLIENTS} variant={clientsVariant} />
            <div className={styles.partnerStrip} data-mo="item">
              <span className={styles.partnerStripLabel}>Preferred Services Partner</span>
              <Image
                src="/claude-partner-badge.png"
                alt="The Coast Global - Preferred Services Partner in the Claude Partner Network"
                width={800}
                height={253}
                className={styles.partnerStripBadge}
              />
            </div>
          </section>

          <section className={`section ${styles.workShowcase}`}>
            <p className={styles.thesisLabel} data-mo="eyebrow">Selected work</p>
            <SelectedWork cases={FEATURED_CASES} variant={workVariant} />
            <Link href="/work" className={styles.cta} data-cursor-label="Explore" data-mo="magnetic">
              All work
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </section>

          {galleryPreview.length > 0 && (
            <section className="section">
              <p className={styles.thesisLabel} data-mo="eyebrow">Gallery</p>
              <GalleryPreview items={galleryPreview} />
              <a
                href="https://gallery.coastglobal.org"
                className={styles.cta}
                data-cursor-label="Explore"
                data-mo="magnetic"
              >
                Explore the gallery
                <span className={styles.ctaArrow}>→</span>
              </a>
            </section>
          )}

          <section className="section">
            <div className={styles.imageBand}>
              <ParallaxImage src={EDITORIAL[3].src} alt={EDITORIAL[3].alt} mode="grain-graded" amount={14} />
              <div className={styles.imageBandCaption}>
                <p className={styles.imageBandText} data-mo="lead">{EDITORIAL[3].caption}</p>
              </div>
            </div>
          </section>

          <section className={`section ${styles.statsSection}`}>
            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.stat} data-mo="item">
                  <CountUp value={s.value} className={styles.statValue} />
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

          <GlassStatement
            eyebrow="Ready when you are"
            title={
              <>
                Bring us a drop, we&rsquo;ll deliver the <em>ocean</em>.
              </>
            }
            body="Tell us where you are and where you want to be. We design the brand that carries you the rest of the way."
            ctaLabel="Start a project"
            ctaHref="/contact"
            ghostLabel="See the work"
            ghostHref="/work"
            index="C / 09"
            backdrop="sunset"
          />
        </RevealGroup>
      </main>

      {/* the folding finale - flat paper scrubs into a boat (desktop, after interaction) */}
      {webgl && interacted && <FoldingBoat />}
    </>
  );
}
