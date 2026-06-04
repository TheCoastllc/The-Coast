import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { FaqAccordion } from '@/components/faq/FaqAccordion'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about The Coast - our process, timelines, and ongoing support for branding and design projects.',
  alternates: { canonical: 'https://coastglobal.org/faq' },
  openGraph: {
    type: 'website',
    title: 'FAQ | The Coast',
    description:
      'Answers to common questions about our branding and design services.',
    url: 'https://coastglobal.org/faq',
    images: DEFAULT_OG_IMAGES,
  },
}

const hardcodedFaqs = [
  {
    question: "What is your typical project timeline?",
    answer: "Our engagements typically range from 2 to 6 weeks, depending on the scope and complexity of the project. A standalone logo design with three concepts and two revision rounds usually takes 2 to 3 weeks from kickoff to final delivery. A full brand identity system - including logo, color palette, typography, brand guidelines, and initial marketing collateral - typically runs 4 to 6 weeks. Every project follows our four-step process: Discover, Design, Develop, and Launch. The Discover phase (3–5 days) involves a deep-dive session into your business, audience, and competitors. Design (1–2 weeks) produces initial concepts. Develop (1–2 weeks) refines the chosen direction through revisions. Launch delivers production-ready assets in all required formats. We believe in moving fast without compromising on quality, and we provide clear milestone dates at the start of every engagement so you always know what to expect."
  },
  {
    question: "Do you work with startups or established businesses?",
    answer: "Both. The Coast was built specifically to make professional branding accessible to businesses at every stage. We partner with solo founders, early-stage startups, small businesses, and growing companies who are ready to level up their brand presence. Many of our clients are entrepreneurs launching their first business and need a complete brand identity from scratch - logo, visual system, website, and marketing materials. Others are established businesses going through a rebrand because their current identity no longer reflects who they are or where they are headed. We have delivered projects across industries including tech, healthcare, e-commerce, entertainment, food and beverage, and professional services. What unites our clients is ambition: they want a visual identity that commands attention, builds trust with their audience, and positions them as leaders in their space - regardless of whether they are a team of one or a team of fifty."
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer: "Yes - we view our client relationships as long-term partnerships, not one-off transactions. After your brand launches, your business will continue to evolve, and your brand needs to evolve with it. Our retainer packages provide continuous access to design, development, and strategic support so you never have to scramble for creative resources. Retainer clients receive priority turnaround on new requests, whether that is social media graphics for a campaign, updated pitch decks for investor meetings, new marketing collateral for a product launch, or seasonal refreshes to keep your brand feeling current. We also provide brand governance support - ensuring every new piece of content, every new hire's email signature, and every new touchpoint stays consistent with your established brand guidelines. Many of our clients started with a single project and transitioned to a retainer because they experienced how much easier it is to have a dedicated creative partner on call."
  }
]

async function getAllFAQs() {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({ slug: 'faq' })
    const published = (data.items ?? []).filter((item) => item.published)

    if (published.length === 0) return hardcodedFaqs

    return published.map((item) => ({ question: item.question, answer: item.answer }))
  } catch {
    return hardcodedFaqs
  }
}

export default async function FAQPage() {
  const faqs = await getAllFAQs()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://coastglobal.org/faq#faqpage',
    url: 'https://coastglobal.org/faq',
    name: 'Frequently Asked Questions',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ChamberShell
        index="09"
        label="FAQ"
        chamber="Common Inquiries"
        preface="Answers to the questions we hear most - scope, timelines, process, and how we work."
      >
        <section className="section">
          <p className="sectionLabel">Questions</p>
          <FaqAccordion items={faqs} />
          <p className="pill takeaway">Still curious? Reach out and we will answer.</p>
        </section>
      </ChamberShell>
    </>
  )
}
