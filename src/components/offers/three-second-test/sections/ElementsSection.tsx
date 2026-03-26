const elements = [
  {
    number: '01',
    title: 'Visual Hierarchy',
    description:
      "Is it immediately clear where to look? The brain seeks a natural reading path. Clutter or flatness reads as disorganisation \u2014 and disorganisation reads as distrust.",
  },
  {
    number: '02',
    title: 'Colour Coherence',
    description:
      'Colour is processed before text. Inconsistent or jarring colour signals internal disorder. Intentional colour communicates control.',
  },
  {
    number: '03',
    title: 'Typography',
    description:
      'Fonts carry personality signals. A mismatch between font personality and brand positioning creates subconscious dissonance the customer feels without naming.',
  },
  {
    number: '04',
    title: 'Image Quality',
    description:
      "Low-quality or inconsistent imagery signals low investment. If the brand doesn't present itself with care, customers infer it may not care about the product either.",
  },
  {
    number: '05',
    title: 'Value Proposition Clarity',
    description:
      "Can they tell in three seconds what you do and who it's for? If not, the brand has failed its first test before a single word is read.",
  },
]

export function ElementsSection() {
  return (
    <section className="min-h-screen bg-[#0D1117] flex flex-col justify-center px-6 md:px-16 py-20">
      <div className="max-w-[760px] mx-auto w-full">
        <span className="text-[#C9A24B] text-[11px] font-bold tracking-[0.2em] uppercase mb-6 block">
          What They&apos;re Reading
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-12">
          Five things customers process
          <br />
          before conscious thought kicks in
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {elements.map((el) => (
            <div
              key={el.number}
              className="border border-white/[0.08] p-6 md:p-7 hover:border-[#C9A24B]/30 transition-colors"
            >
              <span className="text-[#C9A24B]/50 text-xs font-mono block mb-3">{el.number}</span>
              <h3 className="text-white text-lg font-semibold tracking-tight mb-3">
                {el.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{el.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
