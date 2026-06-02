"use client";

import Link from "next/link";
import { StoryHero } from "@/components/hero/StoryHero";
import { StoryHeadline } from "@/components/hero/StoryHeadline";
import { FoldingBoat } from "@/components/hero/FoldingBoat";
import { RevealGroup } from "@/components/motion/RevealGroup";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { THESIS, SERVICES, WORK, STATS, COMPANY, EDITORIAL } from "@/lib/content/coast";
import styles from "./HomeOcean.module.css";

/** The home exactly as built in coast-site: the scroll-driven boat-voyage hero
 *  (StoryHero + morphing StoryHeadline) over a tall runway, then the editorial
 *  content sections, then the folding-boat finale. Baked (no ?hero/?meet switcher). */
export function HomeOcean() {
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
