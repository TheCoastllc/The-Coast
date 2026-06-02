'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { ShineButton } from '@/components/ui/ShineButton'
import { TransitionLink } from '@/components/PageTransition'
import styles from './case.module.css'

const stats = [
  { value: '100%', label: 'Full Rebrand' },
  { value: '15+', label: 'Deliverables' },
  { value: '∞', label: 'Multi-Platform' },
]

const tags = ['Visual Identity', 'Strategy', 'Collateral', 'Web Design', 'Motion']

const deliverables = [
  {
    number: '01',
    title: 'Logo & Mark System',
    items: ['Primary Logo', 'Z Mark Icon', 'Circular Badge', 'Wordmark', 'Pattern System'],
  },
  {
    number: '02',
    title: 'Marketing Collateral',
    items: ['5 Branded Flyers', 'Campaign Advertisement', 'Social Media Kit'],
  },
  {
    number: '03',
    title: 'Branded Merchandise',
    items: ['T-Shirt Design', 'Cap Design', 'Branded Lanyards'],
  },
  {
    number: '04',
    title: 'Real-World Applications',
    items: ['Billboard Design', '3D Billboard', 'Wall Signage', 'A-Frame Sign'],
  },
  {
    number: '05',
    title: 'Digital & Motion',
    items: ['3D Logo Animation', 'Website Redesign', 'E-Commerce Overhaul'],
  },
]

/** Glass-framed image that drifts slightly on hover (ocean replacement for the
 *  old parallax block). Kept in a `.glass .frame` so it matches every other
 *  media frame on the page. */
function Media({
  src,
  alt,
  tall = false,
  priority = false,
}: {
  src: string
  alt: string
  tall?: boolean
  priority?: boolean
}) {
  return (
    <div className={`glass ${styles.frame} ${tall ? styles.frameTall : ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 760px) 100vw, 1080px"
        className="object-cover"
        priority={priority}
        draggable={false}
      />
    </div>
  )
}

export default function ZappedCoPage() {
  return (
    <>
      {/* Back link + meta */}
      <section className="section">
        <TransitionLink href="/work" className={styles.back} data-cursor-label="Back">
          ← Selected Work
        </TransitionLink>

        <div className={styles.metaRow} style={{ marginTop: '2rem' }}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.stats}>
          {stats.map(({ value, label }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cover image */}
      <section className="section">
        <Reveal variant="mask-wipe">
          <Media src="/portfolio/zappedco/cover.jpg" alt="Zapped Co brand identity" priority />
        </Reveal>
      </section>

      {/* The Challenge */}
      <section className="section">
        <div className={styles.story}>
          <div>
            <p className="sectionLabel">The Challenge</p>
            <h2 className="sectionTitle">A brand that needed to match its ambition.</h2>
          </div>
          <div className={styles.storyBody}>
            <p className="prose">
              Zapped Co came to us ready for a change. Their existing brand felt dated and
              disconnected from their ambitious vision - a DIY lightning bolt on a wrinkled banner,
              no logo variations, no color palette, no branded materials. They needed more than a
              logo refresh. They needed a complete identity overhaul.
            </p>
            <p className="prose">
              We rebuilt Zapped Co from the ground up. A dynamic new logo design that captures energy
              and innovation. A sophisticated color palette with vibrant accents. A complete visual
              system that works across every touchpoint. The result? A brand that commands attention
              and stays in memory.
            </p>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="section">
        <p className="sectionLabel">Transformation</p>
        <div className={styles.duo}>
          <Reveal variant="rise-blur">
            <span className={styles.mediaLabel}>Before</span>
            <Media src="/portfolio/zappedco/before.jpg" alt="Zapped Co — before rebrand" tall />
          </Reveal>
          <Reveal variant="scale-in">
            <span className={styles.mediaLabel}>After</span>
            <Media src="/portfolio/zappedco/final.jpg" alt="Zapped Co — after rebrand" tall />
          </Reveal>
        </div>
      </section>

      {/* Process / Development */}
      <section className="section">
        <div className={styles.duo}>
          <Reveal variant="parallax-slide">
            <span className={styles.mediaLabel}>Process</span>
            <Media src="/portfolio/zappedco/sketch.jpg" alt="Logo concept sketches" tall />
          </Reveal>
          <Reveal variant="rise-blur">
            <span className={styles.mediaLabel}>Development</span>
            <Media src="/portfolio/zappedco/dev.jpg" alt="Brand development" tall />
          </Reveal>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section">
        <p className="sectionLabel">Deliverables</p>
        <h2 className="sectionTitle">What we created.</h2>
        <div className={styles.deliverables}>
          {deliverables.map((group, i) => (
            <Reveal key={group.number} variant={variantForIndex(i)}>
              <div className={styles.deliverableRow}>
                <div className={styles.deliverableHead}>
                  <span className={styles.deliverableNum}>{group.number}</span>
                  <h3 className={styles.deliverableTitle}>{group.title}</h3>
                </div>
                <div className={styles.deliverableItems}>
                  {group.items.map((item) => (
                    <span key={item} className={styles.deliverableItem}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Website video */}
      <section className="section">
        <p className="sectionLabel">Website Redesign</p>
        <h2 className="sectionTitle">From basic Shopify to premium e-commerce.</h2>
        <p className="prose">
          We transformed a pastel, generic Shopify theme into a dark, premium e-commerce experience
          with bold typography, clear visual hierarchy, and cohesive branding across every page.
        </p>
        <Reveal variant="mask-wipe">
          <div className={`glass ${styles.frame} ${styles.frameVideo}`} style={{ marginTop: '2rem' }}>
            <video
              src="/portfolio/zappedco/website-before-after.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </Reveal>
      </section>

      {/* The Result */}
      <section className="section">
        <motion.div
          className={styles.quote}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="sectionLabel" style={{ textAlign: 'center' }}>
            The Result
          </p>
          <blockquote className={styles.quoteText}>
            A brand that commands attention and stays in memory.
          </blockquote>
          <p className="prose" style={{ margin: '0 auto' }}>
            Our designs did not stay in Figma. We guided Zapped Co through real-world implementation
            across billboards, retail signage, packaging, and digital platforms. Every execution was
            faithful to the system while adapting to each medium&apos;s unique demands.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="section">
        <p className="sectionLabel">Ready for your transformation?</p>
        <h2 className="sectionTitle">Let&apos;s create something unforgettable.</h2>
        <div className={styles.ctaRow}>
          <ShineButton href="/get-started" size="md">
            Start a Project
          </ShineButton>
          <ShineButton href="/work" size="md" variant="ghost">
            View All Work
          </ShineButton>
        </div>
      </section>
    </>
  )
}
