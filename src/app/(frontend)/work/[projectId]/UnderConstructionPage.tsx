'use client'

import { ShineButton } from '@/components/ui/ShineButton'
import { TransitionLink } from '@/components/PageTransition'
import styles from './case.module.css'

export default function UnderConstructionPage() {
  return (
    <section className="section">
      <TransitionLink href="/work" className={styles.back} data-cursor-label="Back">
        ← Selected Work
      </TransitionLink>

      <div className={`glass ${styles.construction}`} style={{ marginTop: '2.5rem', padding: '2.4rem' }}>
        <span className={styles.constructionLabel}>Under Construction</span>
        <p className="prose" style={{ marginBottom: '1.6rem' }}>
          We are putting the finishing touches on this case study. Check back soon to see the full
          story behind this project.
        </p>
        <div className={styles.ctaRow} style={{ marginTop: 0 }}>
          <ShineButton href="/work" size="sm">
            Back to Work
          </ShineButton>
          <ShineButton href="/get-started" size="sm" variant="ghost">
            Start a Project
          </ShineButton>
        </div>
      </div>
    </section>
  )
}
