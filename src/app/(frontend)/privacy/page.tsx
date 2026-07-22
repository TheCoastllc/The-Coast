import { getPayloadClient } from '@/lib/payload-client'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlueprintLayout } from '@/components/blueprint-layout'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Practices',
  description: 'Privacy Policy for The Coast Global - how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://coastglobal.org/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Privacy Policy | The Coast Global',
    description: 'How The Coast Global collects, uses, and protects your personal information.',
    url: 'https://coastglobal.org/privacy',
    images: DEFAULT_OG_IMAGES,
  },
}

export default async function PrivacyPage() {
  let privacyData: any = null
  try {
    const payload = await getPayloadClient()
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

          <div className="mt-12 rounded-lg border border-border p-6 space-y-4">
            <p className="text-mono text-xs uppercase tracking-[0.2em] text-primary/80">SMS / Text Messaging Program</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The Coast LLC operates an SMS program for people who opt in by checking the consent box on our intake
              or get-started forms. We send two kinds of messages: (1) transactional messages about your project
              (updates, scheduling, and replies to your inquiries), and (2) marketing messages (offers, news, and
              updates) only to those who separately opt in to marketing. You will only receive texts after providing
              your phone number and checking the corresponding opt-in box.
            </p>
            <ul className="text-sm leading-relaxed text-muted-foreground list-disc pl-5 space-y-1">
              <li>Message frequency varies.</li>
              <li>Message and data rates may apply.</li>
              <li>Reply STOP to any message to opt out. Reply HELP for help, or email hello@coastglobal.org.</li>
              <li>Consent to receive marketing text messages is not a condition of any purchase.</li>
              <li>Carriers are not liable for delayed or undelivered messages.</li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground">
              No mobile information will be shared with third parties or affiliates for marketing or promotional
              purposes. Text-messaging opt-in data and consent will not be shared with any third parties. Information
              may be shared only with subcontractors that support our services (such as our messaging provider),
              solely to operate the SMS program.
            </p>
          </div>
        </div>
      </div>
    </BlueprintLayout>
  )
}
