import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const tools = [
  {
    slug: 'brand-quiz',
    number: '01',
    title: 'Brand Quiz',
    subtitle: "What's Your Brand Actually Saying?",
    description:
      '10 strategic questions that reveal whether your brand is invisible, inconsistent, or established. Get your diagnosis in 60 seconds.',
    badge: '60s',
    accent: '#C9A24B',
  },
  {
    slug: 'brand-checklist',
    number: '02',
    title: 'Brand Consistency Checklist',
    subtitle: 'Score Your Brand Across 5 Pillars',
    description:
      '25 checkpoints across visual identity, written voice, digital presence, customer touchpoints, and trust signals. Real-time scoring as you go.',
    badge: '25 items',
    accent: '#C9A24B',
  },
  {
    slug: '3-second-test',
    number: '03',
    title: 'The 3-Second Test',
    subtitle: 'First Impressions Are Everything',
    description:
      'Learn the five things customers judge in the first three seconds \u2014 and run a self-test to see if your brand passes the scrutiny.',
    badge: 'Guide',
    accent: '#C9A24B',
  },
]

export default function OffersLandingPage() {
  return (
    <main className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-5">
          <a href="https://coastglobal.org" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="The Coast" width={28} height={28} className="opacity-80" />
            <span className="text-white/30 text-xs tracking-widest uppercase font-light">Brand Tools</span>
          </a>
          <a
            href="https://coastglobal.org/get-started"
            className="text-xs text-[#C9A24B] hover:text-[#C9A24B]/80 transition-colors font-medium tracking-wide"
          >
            Free Brand Audit
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-16 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C9A24B] text-xs tracking-[0.3em] uppercase font-light mb-6">
            Free &middot; Interactive &middot; Instant Results
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
            Diagnose your brand
            <br />
            <span className="text-white/40">in minutes</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Three free tools built by brand strategists to help you understand what your brand is really communicating.
          </p>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="pb-24 px-5">
        <div className="max-w-4xl mx-auto space-y-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/offers-tools/${tool.slug}`}
              className="group block relative border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#C9A24B]/20 transition-all duration-300 p-6 md:p-8"
            >
              <div className="flex items-start gap-6">
                {/* Number */}
                <span className="text-[#C9A24B]/30 font-light text-4xl md:text-5xl tabular-nums leading-none mt-1 hidden md:block">
                  {tool.number}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-[#C9A24B] transition-colors">
                      {tool.title}
                    </h2>
                    <span className="text-[10px] tracking-wider uppercase bg-[#C9A24B]/10 text-[#C9A24B] px-2.5 py-0.5 rounded-sm">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-white/30 text-sm italic mb-2">{tool.subtitle}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{tool.description}</p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 w-10 h-10 border border-white/[0.08] flex items-center justify-center group-hover:border-[#C9A24B]/30 group-hover:bg-[#C9A24B]/5 transition-all duration-300 mt-1">
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#C9A24B] group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>

              {/* Left accent bar on hover */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-[#C9A24B] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-5 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/30 text-sm mb-4">Want a deeper analysis from our team?</p>
          <a
            href="https://coastglobal.org/get-started"
            className="inline-flex items-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-7 py-3 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors"
          >
            Get Your Free Brand Audit
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
