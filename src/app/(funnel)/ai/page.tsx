import type { Metadata } from 'next'
import { AiFunnelClient } from './AiFunnelClient'

const PAGE_URL = 'https://coastglobal.org/ai'
const TITLE = 'AI Consulting & Implementation | The Coast'
const DESCRIPTION =
  "From 'we should use AI' to real, working systems. The Coast designs, builds, and deploys AI for founders and growth-stage teams. Book an AI Strategy Session."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'The Coast',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@TheCoastHQ',
    creator: '@TheCoastHQ',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function AiFunnelPage() {
  return <AiFunnelClient />
}
