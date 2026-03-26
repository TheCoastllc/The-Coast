const outcomes = [
  {
    label: 'The Invisible Brand',
    title: "The viewer couldn't tell what you do.",
    description:
      "The viewer couldn't identify what you do, who you serve, or why you exist. Your brand is not communicating \u2014 it's disappearing. Every impression is a missed opportunity, and there's no second chance to make the first one.",
    color: '#D94F3D',
  },
  {
    label: 'The Confusing Brand',
    title: 'The viewer got mixed signals.',
    description:
      "Visuals said one thing, words said another, or the positioning was unclear. Confusion at the first impression stage is fatal \u2014 customers default to clarity, and if they can't find it with you, they'll find it with your competitor.",
    color: '#C9A24B',
  },
  {
    label: 'The Credible Brand',
    title: 'The viewer immediately understood and engaged.',
    description:
      "The viewer immediately understood the brand, felt it was for them, and would engage further. This is the standard. This is achievable \u2014 and once it's in place, every other element of your marketing performs better because of it.",
    color: '#28A77A',
  },
]

export function OutcomesSection() {
  return (
    <section className="min-h-screen bg-white flex flex-col justify-center px-6 md:px-16 py-20">
      <div className="max-w-[760px] mx-auto w-full">
        <span className="text-[#C9A24B] text-[11px] font-bold tracking-[0.2em] uppercase mb-6 block">
          What the Test Reveals
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-[#0D2337] leading-tight tracking-tight mb-12">
          Three brands emerge from
          <br />
          the 3-second test
        </h2>

        <div className="space-y-5">
          {outcomes.map((outcome) => (
            <div
              key={outcome.label}
              className="border-l-[3px] bg-[#f8fafb] p-6 md:p-8"
              style={{ borderColor: outcome.color }}
            >
              <span
                className="text-[11px] font-bold tracking-[0.15em] uppercase block mb-2.5"
                style={{ color: outcome.color }}
              >
                {outcome.label}
              </span>
              <h3 className="text-[#0D2337] text-lg md:text-xl font-bold tracking-tight mb-3">
                {outcome.title}
              </h3>
              <p className="text-[#3A5268] text-[15px] leading-[1.72]">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
