import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { CBI, TOOLS } from './content'
import styles from './offers-editorial.module.css'

/**
 * Direction B - Clean editorial.
 * Tight type, generous whitespace, minimal motion. CBI sits as a quiet
 * featured row at the top; the three tools are a restrained numbered list.
 */
export function OffersEditorial() {
  return (
    <ChamberShell
      index="06"
      label="The Brand Lab"
      chamber="Know Your Brand"
      preface="A flagship index and three free diagnostics. Quietly precise tools to measure, audit, and pressure-test your brand."
    >
      {/* CBI quiet featured row */}
      <section className="section">
        <p className="sectionLabel">The flagship</p>
        <Reveal variant="rise-blur">
          <div className={styles.cbiRow}>
            <div>
              <span className={styles.cbiEyebrow}>{CBI.eyebrow}</span>
              <h2 className={styles.cbiHeadline}>{CBI.headline}</h2>
              <p className={styles.cbiBlurb}>{CBI.blurb}</p>
              <div className={styles.cbiTags}>
                {CBI.pillars.map((p) => (
                  <span key={p} className={styles.cbiTag}>{p}</span>
                ))}
              </div>
            </div>
            <a href={CBI.href} className={styles.cbiLink} data-cursor-label="Open">
              {CBI.cta} →
            </a>
          </div>
        </Reveal>
      </section>

      {/* Tools as numbered list */}
      <section className="section">
        <p className="sectionLabel">Three free diagnostics</p>
        <h2 className="sectionTitle">Pick a starting point.</h2>
        <div className={styles.rows}>
          {TOOLS.map((t) => (
            <a
              key={t.number}
              href={t.href}
              className={styles.row}
              data-cursor-label="Open"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.rowNum}>{t.number}</span>
              <div className={styles.rowMain}>
                <h3 className={styles.rowTitle}>{t.title}</h3>
                <p className={styles.rowTagline}>{t.tagline}</p>
                <p className={styles.rowDesc}>{t.description}</p>
              </div>
              <div className={styles.rowAside}>
                <span className={styles.rowMeta}>{t.stats[0].value} · Free</span>
                <span className={styles.rowCta}>{t.cta} →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Quiet prose + CTA */}
      <section className="section">
        <p className="sectionLabel">Why it matters</p>
        <h2 className="sectionTitle">Most brands never see themselves clearly.</h2>
        <p className="prose">
          Customers form lasting impressions within milliseconds, and those impressions decide whether they
          stay, trust, or buy. A diagnostic gives you a clear picture of what your brand communicates right now -
          the blind spots in identity, messaging, and consistency you cannot see from the inside. Start with a
          free tool, then bring us what you find.
        </p>
        <div className={styles.ctaRow}>
          <ShineButton href="/get-started" size="md">Get Started</ShineButton>
          <ShineButton href="/contact" size="md" variant="ghost">Talk to us</ShineButton>
        </div>
      </section>
    </ChamberShell>
  )
}
