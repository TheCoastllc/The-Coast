import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
import { BlueprintLayout } from '@/components/blueprint-layout'
import { FAQAccordionList } from '@/components/pages/landingPage/FAQAccordion'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about The Coast — our process, pricing, timelines, and ongoing support for branding and design projects.',
  alternates: { canonical: 'https://coastglobal.org/faq' },
  openGraph: {
    title: 'FAQ | The Coast',
    description:
      'Answers to common questions about our branding and design services.',
    url: 'https://coastglobal.org/faq',
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
    question: "What is your pricing structure?",
    answer: "The Coast offers two pricing models to fit different business needs. For project-based work, pricing is determined by scope and value rather than hourly rates - a logo design package starts at a different price point than a full rebrand with brand guidelines, website design, and marketing collateral. Every project begins with a free discovery session where we assess your needs, timeline, and budget to create a custom proposal with no surprises. For ongoing support, we offer three monthly retainer tiers: the Starter plan (free) for freelancers and creative beginners includes up to 5 design projects and basic brand kit tools; the Professional plan ($25/month) provides unlimited projects, complete brand management, and team collaboration; and the Enterprise plan ($250/month) adds a dedicated creative strategist, white-label design system, and priority support. Most single projects range from 2 to 6 weeks from kickoff to delivery."
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
    <BlueprintLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="pt-40 pb-32 bg-black min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">
              FAQ
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter text-white">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="mt-6 text-white/50 max-w-2xl text-sm md:text-base font-light leading-relaxed">
              Everything you need to know about working with The Coast. Can&apos;t find
              what you&apos;re looking for? Reach out to our team.
            </p>
          </div>

          <FAQAccordionList items={faqs} />
        </div>
      </section>
    </BlueprintLayout>
  )
}
