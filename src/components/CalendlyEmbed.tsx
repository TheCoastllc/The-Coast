import { buildCalendlyEmbedUrl, getCalendlyUrl } from '@/lib/calendly'

interface CalendlyEmbedProps {
  /** Container height. Default '700px'. Calendly recommends 630px+. */
  height?: string
  className?: string
}

/**
 * Inline Calendly scheduler. Server component - zero JS shipped.
 * The iframe is lazy so it doesn't block hero/LCP on pages it's embedded in.
 * Falls back to a plain link when iframes are blocked or scripted out.
 */
export function CalendlyEmbed({ height = '700px', className = '' }: CalendlyEmbedProps) {
  const embedUrl = buildCalendlyEmbedUrl({ hideEventTypeDetails: false })
  const publicUrl = getCalendlyUrl()

  return (
    <div
      className={
        'relative w-full overflow-hidden rounded-lg border border-white/10 bg-black ' +
        className
      }
      style={{ minHeight: height }}
    >
      <iframe
        src={embedUrl}
        title="Book a 30-minute discovery call with The Coast"
        loading="lazy"
        className="block h-full w-full"
        style={{ minHeight: height, border: '0' }}
      />
      <noscript>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 text-center text-primary underline"
        >
          Open the scheduler on Calendly
        </a>
      </noscript>
    </div>
  )
}
