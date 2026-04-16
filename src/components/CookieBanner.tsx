'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'coast-cookie-consent'
const GA_ID = 'G-ZWSD7VN3DD'
const OPEN_EVENT = 'coast:open-cookie-settings'

type Consent = 'granted' | 'denied' | null

function injectGa() {
  if (typeof window === 'undefined') return
  if (document.getElementById('ga-script')) return

  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  const gtag = (...args: unknown[]) => w.dataLayer.push(args)
  gtag('js', new Date())
  gtag('config', GA_ID, { anonymize_ip: true })

  const s = document.createElement('script')
  s.id = 'ga-script'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
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
    if (initial === 'granted') injectGa()

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
    if (value === 'denied') {
      try {
        document.cookie.split(';').forEach((c) => {
          const name = c.split('=')[0]?.trim()
          if (name && (name.startsWith('_ga') || name === '_gid')) {
            document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`
            document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`
          }
        })
      } catch {}
    } else if (value === 'granted') {
      injectGa()
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
            <div className="relative rounded-2xl border border-white/10 bg-[#0D1117]/95 p-5 shadow-2xl backdrop-blur-md md:p-6">
              <button
                type="button"
                onClick={() => handleChoice('denied')}
                aria-label="Decline cookies"
                className="absolute right-3 top-3 text-white/50 transition hover:text-white"
              >
                <X className="size-4" />
              </button>

              <h2 className="pr-6 font-(family-name:--font-anton) text-lg uppercase tracking-wide text-white">
                We value your privacy
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-white/70">
                We use Google Analytics (GA4) cookies only if you consent, to understand how
                visitors use our site. No cookies are set unless you accept. Read our{' '}
                <Link
                  href="/privacy"
                  className="text-[#C9A24B] underline underline-offset-2 hover:text-[#C9A24B]/80"
                >
                  privacy policy
                </Link>
                .
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
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
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-[#C9A24B] px-4 text-sm font-medium text-[#0D1117] transition hover:bg-[#C9A24B]/90"
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
