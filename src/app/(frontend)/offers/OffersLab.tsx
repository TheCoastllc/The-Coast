import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { FillText } from '@/components/visuals/FillText'
import { ShineButton } from '@/components/ui/ShineButton'
import { CBI, TOOLS } from './content'
import styles from './offers-lab.module.css'

/**
 * Direction A - Cinematic Brand Lab.
 * CBI is a full wave-themed flagship hero; the three free tools are large
 * glass showcase rows with igniting glow + cursor lamp-glow.
 */
export function OffersLab() {
  return (
    <ChamberShell
      index="06"
      label="The Brand Lab"
      chamber="Know Your Brand"
      preface="One flagship index and three free diagnostics. Measure your wave, find where your brand leaks trust, and see what customers read in the first three seconds."
    >
      {/* CBI flagship */}
      <section className="section">
        <p className="sectionLabel">The flagship</p>
        <Reveal variant="scale-in">
          <a
            href={CBI.href}
            className={`glass ${styles.flagship}`}
            data-glow="gold"
            data-premium="ignite lampglow"
            data-cursor-label="Open"
          >
            <span className={styles.flagBloom} aria-hidden />
            <div className={styles.flagshipGrid}>
              <div>
                <span className={styles.flagBadge}>{CBI.eyebrow}</span>
                <h2 className={styles.flagTitle}>{CBI.headline}</h2>
                <p className={styles.flagBlurb}>{CBI.blurb}</p>
                <div className={styles.flagMeta}>
                  <div className={styles.flagMetaItem}>
                    <span className={styles.flagMetaVal}>5</span>
                    <span className={styles.flagMetaLabel}>Pillars</span>
                  </div>
                  <div className={styles.flagMetaItem}>
                    <span className={styles.flagMetaVal}>20</span>
                    <span className={styles.flagMetaLabel}>Criteria</span>
                  </div>
                  <div className={styles.flagMetaItem}>
                    <span className={styles.flagMetaVal}>2 min</span>
                    <span className={styles.flagMetaLabel}>To result</span>
                  </div>
                  <div className={styles.flagMetaItem}>
                    <span className={styles.flagMetaVal}>Free</span>
                    <span className={styles.flagMetaLabel}>Always</span>
                  </div>
                </div>
                <span className="pill">{CBI.cta} →</span>
              </div>

              <div className={styles.waveWrap}>
                <WaveInstrument />
                <div className={styles.waveCaption}>
                  <span>Stranded</span>
                  <span>Lighthouse</span>
                </div>
              </div>
            </div>
          </a>
        </Reveal>
      </section>

      {/* Narrative line */}
      <section className="section">
        <p className="sectionLabel">Why it matters</p>
        <FillText
          className={styles.narrative}
          text="Customers decide whether to trust you in milliseconds. These tools show you what they actually see."
        />
      </section>

      {/* Tool showcases */}
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
                  <span className={styles.toolCta}>{t.cta} →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="pill takeaway" style={{ marginTop: '2rem' }}>
          Three free tools. Sixty seconds each.
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

/** Wave-rating instrument: a flowing crest over five ascending tier bars. */
function WaveInstrument() {
  return (
    <svg
      className={styles.waveSvg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="The five Wave Rating tiers, weakest to strongest"
    >
      <defs>
        <linearGradient id="labWaveStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8B3A3A" />
          <stop offset="0.45" stopColor="#e6b24d" />
          <stop offset="1" stopColor="#7fd3c7" />
        </linearGradient>
        <linearGradient id="labWaveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(127,211,199,0.18)" />
          <stop offset="1" stopColor="rgba(127,211,199,0)" />
        </linearGradient>
      </defs>

      {/* ascending tier bars (Stranded → Lighthouse) */}
      {CBI.waveScale.map((tier, i) => {
        const x = 18 + i * 58
        const h = 18 + tier.w * 22
        const y = 168 - h
        const active = i >= 3
        return (
          <g key={tier.name}>
            <rect
              x={x}
              y={y}
              width={34}
              height={h}
              rx={4}
              fill={active ? 'rgba(230,178,77,0.14)' : 'rgba(118,130,142,0.1)'}
              stroke={active ? 'rgba(230,178,77,0.6)' : 'rgba(118,130,142,0.3)'}
              strokeWidth={1}
            />
            <circle cx={x + 17} cy={y - 9} r={2.2} fill={active ? '#e6b24d' : '#76828e'} />
          </g>
        )
      })}

      {/* the wave crest sweeping up across the tiers */}
      <path
        d="M6 150 C 60 150, 80 96, 120 90 C 168 83, 196 58, 248 44 C 286 34, 304 26, 318 22"
        fill="none"
        stroke="url(#labWaveStroke)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M6 150 C 60 150, 80 96, 120 90 C 168 83, 196 58, 248 44 C 286 34, 304 26, 318 22 L318 168 L6 168 Z"
        fill="url(#labWaveFill)"
        opacity={0.7}
      />
    </svg>
  )
}
