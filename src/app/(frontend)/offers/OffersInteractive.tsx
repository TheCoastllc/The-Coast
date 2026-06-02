import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { ShineButton } from '@/components/ui/ShineButton'
import { CBI, TOOLS } from './content'
import styles from './offers-interactive.module.css'

/**
 * Direction C - Taste it on-page.
 * Each tool card embeds one real, static sample (a quiz question, a checklist
 * item, a 3-second element) with a Continue link to the live tool. CBI shows a
 * sample pillar and an illustrative mock Wave score. No real scoring runs here.
 */
export function OffersInteractive() {
  const m = CBI.mock
  return (
    <ChamberShell
      index="06"
      label="The Brand Lab"
      chamber="Know Your Brand"
      preface="Try before you click. Every tool below shows a real sample - answer it in your head, then continue to the live version for your full result."
    >
      {/* CBI sample + mock score */}
      <section className="section">
        <p className="sectionLabel">The flagship - a sample</p>
        <Reveal variant="scale-in">
          <div className={`glass ${styles.cbiCard}`} data-glow="gold" data-premium="ignite lampglow">
            <div className={styles.cbiGrid}>
              <div>
                <span className={styles.cbiEyebrow}>{CBI.eyebrow}</span>
                <h2 className={styles.cbiHeadline}>{CBI.headline}</h2>
                <p className={styles.cbiBlurb}>{CBI.blurb}</p>
                <p className={styles.cbiSampleLabel}>Sample pillar - {m.pillar}</p>
                <p className={styles.cbiSamplePrompt}>{m.pillarPrompt}</p>
              </div>

              <div>
                <p className={styles.cbiSampleLabel}>Illustrative result</p>
                <div className={styles.score}>
                  <span className={styles.scoreNum}>{m.score}</span>
                  <span className={styles.scoreMax}>/ 100</span>
                  <span className={styles.scoreWave}>Wave: {m.waveName}</span>
                </div>
                <p className={styles.scoreLine}>{m.line}</p>
                <div className={styles.scoreTrack}>
                  <span className={styles.scoreFill} style={{ width: `${m.score}%` }} />
                </div>
                <div className={styles.scaleRow}>
                  {CBI.waveScale.map((t) => (
                    <span key={t.name}>{t.name}</span>
                  ))}
                </div>
                <a href={CBI.href} className={styles.toolCta} data-cursor-label="Open">
                  Get your real Wave Rating →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Tool samples */}
      <section className="section">
        <p className="sectionLabel">Three free diagnostics - sampled</p>
        <div className={styles.tools}>
          {TOOLS.map((t, i) => (
            <Reveal key={t.number} variant={variantForIndex(i)}>
              <div className={`glass ${styles.tool}`} data-glow={t.glow === 'teal' ? undefined : t.glow} data-premium="ignite lampglow">
                <div className={styles.toolHead}>
                  <span className={styles.toolNum}>{t.number}</span>
                </div>
                <h3 className={styles.toolTitle}>{t.title}</h3>
                <p className={styles.toolTagline}>{t.tagline}</p>

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

                <a href={t.href} className={styles.toolCta} data-cursor-label="Open" target="_blank" rel="noopener noreferrer">
                  Continue →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="pill takeaway" style={{ marginTop: '2rem' }}>
          Samples are static. The live tools score you in real time.
        </p>
      </section>

      {/* CTA */}
      <section className="section">
        <p className="sectionLabel">Ready to go deeper?</p>
        <h2 className="sectionTitle">Liked the sample? Bring us the full picture.</h2>
        <div className={styles.ctaRow}>
          <ShineButton href="/get-started" size="md">Get Started</ShineButton>
          <ShineButton href="/contact" size="md" variant="ghost">Talk to us</ShineButton>
        </div>
      </section>
    </ChamberShell>
  )
}
