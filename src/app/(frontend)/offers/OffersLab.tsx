import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { FillText } from '@/components/visuals/FillText'
import { ShineButton } from '@/components/ui/ShineButton'
import { FlagshipCBI } from '@/components/offers/FlagshipCBI'
import { TOOLS } from './content'
import styles from './offers-lab.module.css'
import { navIndex } from '@/lib/nav'

/**
 * The Brand Lab - merged cinematic + tangible direction.
 *
 * The CBI flagship is a full wave-themed hero: the gold "How Strong Is Your
 * Wave?" block with the SVG wave instrument, a stat row, and the "Measure Your
 * Wave" CTA - plus an illustrative mock Wave score and a sample pillar so the
 * promise feels concrete before you click. The three free tools are large
 * glass showcase rows (igniting glow + cursor lamp-glow, oversized numerals)
 * that each embed one real on-page sample with a Continue link to the live tool.
 */
export function OffersBrandLab() {
  return (
    <ChamberShell
      index={navIndex("/offers")}
      label="The Brand Lab"
      chamber="Know Your Brand"
      preface="One flagship index and three free diagnostics. Measure your wave, find where your brand leaks trust, and see what customers read in the first three seconds - then try each one right here before you continue."
    >
      {/* CBI flagship - cinematic hero with a creative wave readout (?wave= variants) */}
      <section className="section">
        <p className="sectionLabel">The flagship</p>
        <FlagshipCBI />
      </section>

      {/* Narrative line */}
      <section className="section">
        <p className="sectionLabel">Why it matters</p>
        <FillText
          className={styles.narrative}
          text="Customers decide whether to trust you in milliseconds. These tools show you what they actually see."
        />
      </section>

      {/* Tool showcases - cinematic rows that each let you taste the tool */}
      <section className="section">
        <p className="sectionLabel">Three free diagnostics</p>
        <div className={styles.tools}>
          {TOOLS.map((t, i) => (
            <Reveal key={t.number} variant={variantForIndex(i)}>
              <a
                href={t.href}
                className={`glass ${styles.tool}`}
                data-glow={t.glow === 'teal' ? undefined : t.glow}
                data-premium="ignite lampglow"
                data-cursor-label="Open"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.toolNum}>{t.number}</span>
                <div className={styles.toolBody}>
                  <h3 className={styles.toolTitle}>{t.title}</h3>
                  <p className={styles.toolTagline}>{t.tagline}</p>
                  <p className={styles.toolDesc}>{t.description}</p>

                  <div className={styles.sample}>
                    <p className={styles.sampleKicker}>{t.sample.kicker}</p>
                    <p className={styles.samplePrompt}>{t.sample.prompt}</p>
                    {t.sample.hint && (
                      <div className={styles.sampleChoice}>
                        {t.number === '02' ? (
                          <span className={styles.sampleCheck} aria-hidden>
                            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className={styles.sampleDot} aria-hidden />
                        )}
                        <span className={styles.sampleChoiceText}>{t.sample.hint}</span>
                      </div>
                    )}
                    {t.number === '02' && (
                      <div className={styles.sampleChoice}>
                        <span className={styles.sampleCheck} aria-hidden>
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className={styles.sampleChoiceText}>Tick the boxes you can honestly claim. Your score updates live.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.toolAside}>
                  <div className={styles.toolStats}>
                    {t.stats.map((s) => (
                      <div key={s.label} className={styles.toolStat}>
                        <span className={styles.toolStatVal}>{s.value}</span>
                        <span className={styles.toolStatLabel}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className={styles.toolCta}>Continue →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="pill takeaway" style={{ marginTop: '2rem' }}>
          Three free tools. Samples here - full results in seconds.
        </p>
      </section>

      {/* CTA */}
      <section className="section">
        <p className="sectionLabel">Ready to go deeper?</p>
        <h2 className="sectionTitle">Build a brand that earns the wave.</h2>
        <div className={styles.ctaRow}>
          <ShineButton href="/get-started" size="md">Get Started</ShineButton>
          <ShineButton href="/contact" size="md" variant="ghost">Talk to us</ShineButton>
        </div>
        <p className={styles.ctaNote}>No pitch. Run a tool first - the diagnosis is free.</p>
      </section>
    </ChamberShell>
  )
}
