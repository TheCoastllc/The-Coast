'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'coast-cookie-consent'
const OPEN_EVENT = 'coast:open-cookie-settings'

type Consent = 'granted' | 'denied' | null

/**
 * Flip GA4 Consent Mode v2 analytics_storage. gtag is bootstrapped in the root
 * layout with all storage defaulted to 'denied', so this only needs to grant or
 * re-deny analytics. No cookies are set until 'granted'; in the denied state GA
 * still sends cookieless modeling pings. (Ad signals stay denied - GA4 only.)
 */
function applyConsent(granted: boolean) {
  if (typeof window === 'undefined') return
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    })
  }
  // Meta Pixel holds its event queue while revoked and releases it on grant.
  if (typeof w.fbq === 'function') {
    w.fbq('consent', granted ? 'grant' : 'revoke')
  }
}

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let initial: Consent = null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'granted' || stored === 'denied') initial = stored
    } catch {}
    setConsent(initial)
    setHydrated(true)
    if (initial) applyConsent(initial === 'granted')

    const reopen = () => setConsent(null)
    window.addEventListener(OPEN_EVENT, reopen)
    ;(window as unknown as { openCookieSettings: () => void }).openCookieSettings = () =>
      window.dispatchEvent(new Event(OPEN_EVENT))

    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  const handleChoice = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {}
    applyConsent(value === 'granted')
    if (value === 'denied') {
      try {
        document.cookie.split(';').forEach((c) => {
          const name = c.split('=')[0]?.trim()
          if (name && (name.startsWith('_ga') || name === '_gid' || name.startsWith('_gtm') || name.startsWith('_gcl') || name.startsWith('_fbp') || name.startsWith('_fbc'))) {
            document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`
            document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`
          }
        })
      } catch {}
    }
    setConsent(value)
  }

  const showBanner = hydrated && consent === null

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            className="fixed bottom-4 left-4 right-4 z-100 md:left-6 md:right-auto md:max-w-md"
          >
            {/* compact on mobile - the banner was eating ~28% of a phone
                viewport; tighter padding/type + side-by-side buttons */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0A0C12]/95 p-4 shadow-2xl backdrop-blur-md md:p-6">
              <button
                type="button"
                onClick={() => handleChoice('denied')}
                aria-label="Decline cookies"
                className="absolute right-3 top-3 text-white/50 transition hover:text-white"
              >
                <X className="size-4" />
              </button>

              <h2 className="pr-6 font-(family-name:--font-anton) text-base uppercase tracking-wide text-white md:text-lg">
                We value your privacy
              </h2>

              <p className="mt-1.5 text-xs leading-snug text-white/70 md:mt-2 md:text-sm md:leading-relaxed">
                We use Google Analytics (GA4) cookies only if you consent, to understand how
                visitors use our site. No cookies are set unless you accept. Read our{' '}
                <Link
                  href="/privacy"
                  className="text-[#E6B24D] underline underline-offset-2 hover:text-[#E6B24D]/80"
                >
                  privacy policy
                </Link>
                .
              </p>

              <div className="mt-3 flex flex-row gap-2 md:mt-4">
                <button
                  type="button"
                  onClick={() => handleChoice('denied')}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => handleChoice('granted')}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-[#E6B24D] px-4 text-sm font-medium text-[#0A0C12] transition hover:bg-[#E6B24D]/90"
                >
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
