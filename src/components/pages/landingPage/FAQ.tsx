import { getPayloadClient } from '@/lib/payload-client'
import Link from 'next/link'
import { AnimatedSectionLabel, AnimatedSectionHeading } from './AnimationWrappers'
import { FAQAccordionList } from './FAQAccordion'

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

async function getFAQs() {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({ slug: 'faq' })
    const published = (data.items ?? []).filter((item) => item.published)

    if (published.length === 0) {
      return { faqs: hardcodedFaqs, totalCount: hardcodedFaqs.length }
    }

    return {
      faqs: published.slice(0, 5).map((item) => ({ question: item.question, answer: item.answer })),
      totalCount: published.length,
    }
  } catch {
    return { faqs: hardcodedFaqs, totalCount: hardcodedFaqs.length }
  }
}

export default async function FAQ() {
  const { faqs, totalCount } = await getFAQs()

  return (
    <section className="py-32 bg-black" id="faq">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <AnimatedSectionLabel>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">08</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Questions</span>
          </AnimatedSectionLabel>
          <AnimatedSectionHeading
            text="Common Inquiries"
            highlight={["Inquiries"]}
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
          />
        </div>

        {/* All FAQ text rendered server-side for AI crawlers */}
        <FAQAccordionList items={faqs} />

        {totalCount > 5 && (
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm tracking-[0.2em] uppercase font-mono"
            >
              See all questions
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
