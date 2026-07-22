import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Keep 404s out of the index so the served robots meta matches the HTTP 404.
// Full robots object (incl. googleBot) so the layout's index directives are
// overridden wholesale - no conflicting duplicate meta tags - plus a distinct
// title instead of inheriting the homepage's.
export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function CatchAll() {
  notFound()
}
