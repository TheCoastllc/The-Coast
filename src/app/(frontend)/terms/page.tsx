import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlueprintLayout } from '@/components/blueprint-layout'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for The Coast — our service agreement, revision policy, and client responsibilities.',
  alternates: { canonical: 'https://coastglobal.org/terms' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Terms of Service | The Coast',
    description: 'Service agreement, revision policy, and client responsibilities for The Coast.',
    url: 'https://coastglobal.org/terms',
  },
}

export default async function TermsPage() {
  let termsData: any = null
  try {
    const payload = await getPayload({ config: configPromise })
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
                By engaging <strong>The Coast LLC</strong> for brand design services, you agree to the terms outlined in your project proposal and service agreement. All creative work remains the property of The Coast until final payment is received.
              </p>
            </div>
          )}
        </div>
      </div>
    </BlueprintLayout>
  )
}
