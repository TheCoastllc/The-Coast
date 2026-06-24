import Link from 'next/link'
import { CONSENT } from '@/lib/content/coast'

/**
 * Marketing-consent disclosure shown directly beneath the submit button on any
 * form that collects an email or phone number. Small and muted so it reads as
 * fine print, with Privacy Policy + Terms links (point-of-collection consent for
 * TCPA / A2P 10DLC SMS compliance). Pass `className` to tune spacing/alignment.
 * Pass `sms` on forms that collect a phone number to also show the carrier-
 * standard SMS opt-in line.
 */
export function ConsentNotice({ className = '', sms = false }: { className?: string; sms?: boolean }) {
  return (
    <div className={`text-[11px] leading-relaxed text-white/40 ${className}`.trim()}>
      <p>
        {CONSENT.marketing}.{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white/70">
          Privacy Policy
        </Link>
        {' · '}
        <Link href="/terms" className="underline underline-offset-2 hover:text-white/70">
          Terms
        </Link>
      </p>
      {sms ? <p className="mt-2">{CONSENT.sms}</p> : null}
    </div>
  )
}
