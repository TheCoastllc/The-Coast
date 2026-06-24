import { CalendlyButton } from '@/components/CalendlyButton'
import { COMPANY, CONTACT_STEPS } from '@/lib/content/coast'
import styles from './contact-treatments.module.css'

/** A - The Glass Invitation: a frosted contact card over the full-bleed ocean,
 *  same glass-on-ocean system as the thesis/closing. */
export function ContactGlass() {
  return (
    <>
      <div className={styles.glassWrap}>
        <div className={styles.glassPhoto} aria-hidden="true" />
        <div className={styles.glassGrade} aria-hidden="true" />
        <div className={styles.glassCard}>
          <p className={styles.glassEyebrow}>Start a project</p>
          <h2 className={`${styles.glassHeadline} no-marble`}>
            Tell us the vision. We&rsquo;ll deliver the <em>ocean</em>.
          </h2>
          <p className={styles.glassLead}>{COMPANY.oneLiner}</p>
          <div className={styles.glassActions}>
            <CalendlyButton>Book a 30-min call</CalendlyButton>
            <a href={`mailto:${COMPANY.email}`} className={styles.glassEmail} data-cursor-label="Email">
              {COMPANY.email}
            </a>
          </div>
          <div className={styles.glassMeta}>
            <a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, '')}`} data-cursor-label="Call">
              {COMPANY.phone}
            </a>
            <span className={styles.coord}>{COMPANY.city}</span>
            <span>{COMPANY.domain}</span>
          </div>
        </div>
      </div>

      <div className={styles.glassSteps}>
        {CONTACT_STEPS.map((s) => (
          <div key={s.n} className={styles.glassStep}>
            <span className={styles.stepNum}>{s.n}</span>
            <h4 className={styles.stepTitle}>{s.title}</h4>
            <p className={styles.stepBody}>{s.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}
