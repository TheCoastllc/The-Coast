import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="min-h-[70vh] bg-[#0D1117] flex flex-col justify-center items-center px-6 md:px-16 py-20 text-center relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[760px] mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
          Did your brand pass?
        </h2>
        <p className="text-white/45 text-base font-light leading-relaxed mb-12">
          If you&apos;re not certain, that uncertainty is the answer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://coastglobal.org/get-started"
            className="inline-flex items-center justify-center gap-2.5 bg-[#C9A24B] text-[#0D1117] px-8 py-4 text-sm font-bold tracking-wide rounded-sm hover:bg-[#C9A24B]/90 transition-colors shadow-[0_4px_20px_rgba(201,162,75,0.25)]"
          >
            Get Your Free Brand Audit
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/offers-tools/brand-quiz"
            className="inline-flex items-center justify-center gap-2 border border-white/[0.28] text-white px-8 py-4 text-sm font-semibold tracking-wide rounded-sm hover:border-white/60 hover:bg-white/[0.05] transition-all"
          >
            Take the Brand Quiz
          </a>
        </div>

        <p className="mt-16 pt-7 border-t border-white/[0.07] text-white/20 text-[11px] tracking-wider">
          The Coast &nbsp;&middot;&nbsp; Branding &amp; Digital Agency &nbsp;&middot;&nbsp;
          <a href="https://coastglobal.org" className="text-white/30 hover:text-white/55 transition-colors">
            coastglobal.org
          </a>
        </p>
      </div>
    </section>
  )
}
