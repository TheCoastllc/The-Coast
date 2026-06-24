import Link from 'next/link'
import { CONSENT } from '@/lib/content/coast'

/**
 * Express SMS opt-in (Twilio toll-free A2P / CTIA, error 30446). TWO checkboxes,
 * both UNCHECKED by default (controlled by the parent form state). Transactional
 * and marketing consent are separate; marketing is voluntary ("not a condition of
 * any purchase"). Rendered at the point a phone number is collected. The parent
 * threads the values into the submission for the consent audit trail.
 */
export function SmsConsent({
  transactional,
  marketing,
  onChange,
  className = '',
}: {
  transactional: boolean
  marketing: boolean
  onChange: (field: 'transactional' | 'marketing', value: boolean) => void
  className?: string
}) {
  return (
    <fieldset className={`text-left ${className}`.trim()}>
      <legend className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
        Text messages (optional)
      </legend>

      <label className="mb-3 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={transactional}
          onChange={(e) => onChange('transactional', e.target.checked)}
          className="mt-[3px] h-4 w-4 shrink-0 accent-[#7fd3c7]"
        />
        <span className="text-[12px] leading-relaxed text-white/55">{CONSENT.smsTransactional}</span>
      </label>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={marketing}
          onChange={(e) => onChange('marketing', e.target.checked)}
          className="mt-[3px] h-4 w-4 shrink-0 accent-[#7fd3c7]"
        />
        <span className="text-[12px] leading-relaxed text-white/55">{CONSENT.smsMarketing}</span>
      </label>

      <p className="mt-3 text-[11px] leading-relaxed text-white/35">
        A phone number and these boxes are optional. See our{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white/70">
          Privacy Policy
        </Link>
        {' and '}
        <Link href="/terms" className="underline underline-offset-2 hover:text-white/70">
          Terms
        </Link>
        .
      </p>
    </fieldset>
  )
}
