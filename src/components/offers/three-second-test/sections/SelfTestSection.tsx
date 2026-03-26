const steps = [
  {
    number: '1',
    text: 'Set a 3-second timer. Load your homepage.',
    detail:
      'Write down the first three things you noticed \u2014 not what you wanted to notice. What actually hit you first.',
  },
  {
    number: '2',
    text: 'Ask someone who has never seen your brand',
    detail:
      "to look at your homepage for 3 seconds. Ask them: What does this brand do? Who is it for? Would you trust it?",
  },
  {
    number: '3',
    text: 'Compare their answers to what you intended.',
    detail:
      "The gap between what you meant to communicate and what they received \u2014 that's your first impression problem.",
  },
]

export function SelfTestSection() {
  return (
    <section className="min-h-screen bg-[#f8fafb] flex flex-col justify-center px-6 md:px-16 py-20 relative overflow-hidden">
      <div className="max-w-[760px] mx-auto w-full relative z-10">
        <span className="text-[#C9A24B] text-[11px] font-bold tracking-[0.2em] uppercase mb-6 block">
          Try It Now
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-[#0D2337] leading-tight tracking-tight mb-12">
          Run the 3-Second Test
          <br />
          on your own brand
        </h2>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-5 bg-white border border-[#DDE8EF] p-5 md:p-6 rounded-sm"
            >
              <span className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[#C9A24B]/10 text-[#C9A24B] text-sm font-bold">
                {step.number}
              </span>
              <p className="text-[#3A5268] text-sm leading-relaxed">
                <strong className="text-[#0D2337]">{step.text}</strong>{' '}
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
