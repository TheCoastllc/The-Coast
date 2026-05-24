// Calendly helpers.
//
// One source of truth for the booking URL and the embed-tuning query params,
// so every CTA, popup, and inline embed renders the same scheduled meeting.

const FALLBACK_URL = 'https://calendly.com/davidcoast-coastglobal/30min'

/**
 * Base Calendly URL (no query string). Reads from `NEXT_PUBLIC_CALENDLY_URL`
 * so the meeting link can be swapped without a code change.
 */
export function getCalendlyUrl(): string {
  return process.env.NEXT_PUBLIC_CALENDLY_URL || FALLBACK_URL
}

interface EmbedOptions {
  /** Hides the GDPR cookie banner inside the embed. Default true. */
  hideGdpr?: boolean
  /** Hides the event-type details panel for a tighter inline embed. Default false. */
  hideEventTypeDetails?: boolean
  /** Background hex (no #). Default '000000'. */
  background?: string
  /** Text hex (no #). Default 'ffffff'. */
  text?: string
  /** Primary/accent hex (no #). Default matches site primary. */
  primary?: string
}

/**
 * Build a Calendly embed URL with theming + embed_domain set.
 * Used by both the inline iframe and the popup dialog.
 */
export function buildCalendlyEmbedUrl(options: EmbedOptions = {}): string {
  const {
    hideGdpr = true,
    hideEventTypeDetails = false,
    background = '000000',
    text = 'ffffff',
    primary = 'c9a96e',
  } = options

  const params = new URLSearchParams({
    embed_domain: 'coastglobal.org',
    embed_type: 'Inline',
    hide_gdpr_banner: hideGdpr ? '1' : '0',
    hide_event_type_details: hideEventTypeDetails ? '1' : '0',
    background_color: background,
    text_color: text,
    primary_color: primary,
  })

  return `${getCalendlyUrl()}?${params.toString()}`
}
