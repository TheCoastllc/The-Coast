'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendlyButton } from '@/components/CalendlyButton'
import { COMPANY } from '@/lib/content/coast'
import { GOOGLE_LISTING_URL } from '@/lib/schema'
import styles from './contact-page.module.css'

type Rating = { average: number; count: number }

/** Direct channels beside the form: email (click to copy), phone, location,
 *  response time, the live Google rating, booking, and the long-form intake. */
export function ContactChannels({ rating }: { rating: Rating | null }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(COMPANY.email)
      setCopied(true)
      return
    } catch {}
    // Clipboard API refused (permissions / insecure context): legacy path.
    try {
      const ta = document.createElement('textarea')
      ta.value = COMPANY.email
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      if (ok) {
        setCopied(true)
        return
      }
    } catch {}
    window.location.href = `mailto:${COMPANY.email}`
  }

  const tel = COMPANY.phone.replace(/[^\d+]/g, '')
  const full = rating ? Math.max(0, Math.min(5, Math.round(rating.average))) : 0

  return (
    <div className={styles.side}>
      <div>
        <h2 className={`${styles.sideTitle} no-marble`}>Reach us directly</h2>
        <ul className={styles.channels}>
          <li className={styles.channel}>
            <span className={styles.chKey}>Email</span>
            <span className={styles.chVal}>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <button
                type="button"
                className={styles.copy}
                onClick={copyEmail}
                data-copied={copied}
                aria-label={copied ? 'Email address copied' : 'Copy email address'}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </span>
          </li>
          <li className={styles.channel}>
            <span className={styles.chKey}>Phone</span>
            <span className={styles.chVal}>
              <a href={`tel:${tel}`}>{COMPANY.phone}</a>
            </span>
          </li>
          <li className={styles.channel}>
            <span className={styles.chKey}>Based in</span>
            <span className={styles.chVal}>Dallas-Fort Worth, Texas &middot; Central Time</span>
          </li>
          <li className={styles.channel}>
            <span className={styles.chKey}>Response</span>
            <span className={styles.chVal}>Within 24 hours</span>
          </li>
          {rating && rating.count > 0 && (
            <li className={styles.channel}>
              <span className={styles.chKey}>Google</span>
              <span className={styles.chVal}>
                <a href={GOOGLE_LISTING_URL} target="_blank" rel="noopener noreferrer">
                  <span className={styles.stars} aria-hidden="true">
                    {'★'.repeat(full)}
                    {'☆'.repeat(5 - full)}
                  </span>
                  {rating.average.toFixed(1)} from {rating.count} reviews
                </a>
              </span>
            </li>
          )}
        </ul>
      </div>

      <div className={styles.sideBlock}>
        <h2 className={`${styles.sideTitle} no-marble`}>Prefer to talk?</h2>
        <CalendlyButton variant="ghost" size="sm">
          Book a quick call
        </CalendlyButton>
      </div>

      <div className={styles.sideBlock}>
        <p>
          Have a full brief ready?{' '}
          <Link href="/get-started" className={styles.sideLink}>
            Start the guided intake
          </Link>{' '}
          and we&rsquo;ll scope it from there.
        </p>
      </div>
    </div>
  )
}
