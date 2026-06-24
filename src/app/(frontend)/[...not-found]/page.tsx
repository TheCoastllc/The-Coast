import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Keep 404s out of the index so the served robots meta matches the HTTP 404.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CatchAll() {
  notFound()
}
