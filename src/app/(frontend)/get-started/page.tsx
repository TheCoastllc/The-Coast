import type { Metadata } from 'next'
import GetStartedClient from './GetStartedClient'

export const metadata: Metadata = {
  title: 'Get Started',
  description:
    'Start your brand project with The Coast. Tell us about your business and the services you need — we will respond within 24 hours.',
  alternates: { canonical: 'https://coastglobal.org/get-started' },
  openGraph: {
    title: 'Start Your Brand Project | The Coast',
    description:
      'Tell us about yourself, your services needed, and your budget. Get a custom quote from The Coast.',
    url: 'https://coastglobal.org/get-started',
  },
}

export default function GetStartedPage() {
  return <GetStartedClient />
}
