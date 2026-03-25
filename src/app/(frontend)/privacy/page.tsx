import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlueprintLayout } from '@/components/blueprint-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for The Coast — how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://coastglobal.org/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | The Coast',
    description: 'How The Coast collects, uses, and protects your personal information.',
    url: 'https://coastglobal.org/privacy',
  },
}

export default async function PrivacyPage() {
  let privacyData: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    privacyData = await payload.findGlobal({ slug: 'privacy-policy' })
  } catch {
    // Global not yet seeded
  }

  const lastUpdated = privacyData?.lastUpdated
    ? new Date(privacyData.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <BlueprintLayout>
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
          <span className="text-mono text-muted-foreground/50 block mb-3">Legal</span>
          <h1 className="text-heading text-4xl md:text-5xl mb-4">Privacy Policy</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>
          )}

          {privacyData?.content ? (
            <div className="prose prose-lg max-w-none">
              <RichText data={privacyData.content} />
            </div>
          ) : (
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                This Privacy Policy is being prepared. Please check back soon or contact us at{' '}
                <a href="mailto:hello@coastglobal.org">hello@coastglobal.org</a> with any privacy-related questions.
              </p>
              <p>
                <strong>The Coast LLC</strong> takes your privacy seriously. We collect personal information (name, email, phone, business details) through our intake and contact forms solely to provide our brand design services. We do not sell your data to third parties.
              </p>
            </div>
          )}
        </div>
      </div>
    </BlueprintLayout>
  )
}
