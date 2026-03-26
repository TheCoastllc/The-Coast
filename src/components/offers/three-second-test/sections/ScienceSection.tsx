export function ScienceSection() {
  return (
    <section className="min-h-screen bg-[#0D1117] flex flex-col justify-center px-6 md:px-16 py-20">
      <div className="max-w-[760px] mx-auto w-full">
        <span className="text-[#C9A24B] text-[11px] font-bold tracking-[0.2em] uppercase mb-6 block">
          The Research
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-8">
          Your brand gets three seconds.
          <br />
          Here&apos;s what happens in them.
        </h2>

        <div className="space-y-5 text-white/50 text-[15px] leading-[1.72] mb-8">
          <p>
            Psychologists call it thin-slicing &mdash; the brain&apos;s ability to extract accurate, high-confidence judgments from tiny slices of experience. In milliseconds, your visual cortex processes colour, shape, spatial hierarchy, and contrast. Before a single word registers, a trust signal has already been sent.
          </p>
          <p>
            This isn&apos;t a quirk of unsophisticated buyers. It&apos;s a fundamental cognitive mechanism, and it applies equally to a seven-figure CMO as it does to a first-time online shopper. The brain is doing the most economical thing possible: making a fast call on whether this is worth more attention.
          </p>
          <p>
            For brands, this means your visual identity, your layout, your image quality, and your typographic voice are not decoration. They are your first &mdash; and often only &mdash; argument. If that argument is confused, absent, or misaligned with what you actually offer, the customer leaves before your copy has a chance to persuade them.
          </p>
        </div>

        {/* Pull quote */}
        <blockquote className="border-l-2 border-[#C9A24B] pl-6 my-10">
          <p className="text-white text-lg md:text-xl font-medium italic leading-relaxed">
            &ldquo;Customers don&apos;t evaluate your brand. They react to it.&rdquo;
          </p>
        </blockquote>

        {/* Stat callout */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/[0.03] border border-white/[0.08] rounded-sm p-6 md:p-8">
          <div className="text-center sm:text-left shrink-0">
            <span className="text-3xl md:text-4xl font-bold text-white block">50ms</span>
            <span className="text-white/30 text-xs tracking-wider uppercase">First impression</span>
          </div>
          <div className="w-px h-12 bg-white/[0.08] hidden sm:block" />
          <p className="text-white/50 text-sm leading-relaxed">
            First impressions of a website are formed in as little as 50 milliseconds &mdash; before conscious thought is possible. Full trust judgments follow within 3 seconds. Everything your brand communicates about competence, care, and credibility must be legible within that window.
          </p>
        </div>
      </div>
    </section>
  )
}
