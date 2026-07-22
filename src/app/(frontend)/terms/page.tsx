import { getPayloadClient } from '@/lib/payload-client'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlueprintLayout } from '@/components/blueprint-layout'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Terms of Service & Client Agreement',
  description: 'Terms of Service for The Coast Global - our service agreement, revision policy, and client responsibilities.',
  alternates: { canonical: 'https://coastglobal.org/terms' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Terms of Service | The Coast Global',
    description: 'Service agreement, revision policy, and client responsibilities for The Coast Global.',
    url: 'https://coastglobal.org/terms',
    images: DEFAULT_OG_IMAGES,
  },
}

export default async function TermsPage() {
  let termsData: any = null
  try {
    const payload = await getPayloadClient()
    termsData = await payload.findGlobal({ slug: 'terms-of-service' })
  } catch {
    // Global not yet seeded
  }

  const lastUpdated = termsData?.lastUpdated
    ? new Date(termsData.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <BlueprintLayout>
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
          <span className="text-mono text-muted-foreground/50 block mb-3">Legal</span>
          <h1 className="text-heading text-4xl md:text-5xl mb-4">Terms of Service</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>
          )}

          {termsData?.content ? (
            <div className="prose prose-lg max-w-none">
              <RichText data={termsData.content} />
            </div>
          ) : (
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                These Terms of Service are being prepared. Please contact us at{' '}
                <a href="mailto:hello@coastglobal.org">hello@coastglobal.org</a> with any questions about our service agreement.
              </p>
              <p>
                By engaging <strong>The Coast LLC</strong> for brand design services, you agree to the terms outlined in your project proposal and service agreement. All creative work remains the property of The Coast Global until final payment is received.
              </p>
            </div>
          )}

          <div className="mt-12 rounded-lg border border-border p-5">
            <p className="text-mono text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">SMS / Text Messaging</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you opt in to our SMS program, you agree to receive automated text messages from The Coast LLC as
              described in our Privacy Policy. Message frequency varies. Message and data rates may apply. Reply STOP
              to opt out, HELP for help. Consent to receive marketing texts is not a condition of any purchase.
            </p>
          </div>
        </div>
      </div>
    </BlueprintLayout>
  )
}
