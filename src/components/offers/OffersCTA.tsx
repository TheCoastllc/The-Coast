import { ArrowRight } from 'lucide-react'

export function OffersCTA({
  heading = 'Ready for a professional brand audit?',
  description = 'Our team will analyse your brand across every touchpoint and deliver a detailed report with actionable recommendations.',
}: {
  heading?: string
  description?: string
}) {
  return (
    <section className="py-20 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
          {heading}
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
          {description}
        </p>
        <a
          href="https://coastglobal.org/get-started"
          className="inline-flex items-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-7 py-3 text-sm font-semibold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors"
        >
          Get Your Free Brand Audit
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  )
}
