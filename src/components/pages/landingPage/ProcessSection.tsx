import { AnimatedSectionLabel, AnimatedSectionHeading } from './AnimationWrappers'
import { ProcessTimelineContainer, ProcessNode, ProcessCard } from './ProcessAnimations'

const steps = [
  {
    num: '01',
    title: 'Discover',
    desc: "We dive deep into your brand's DNA: story, audience, competitors, and aspirations. Understanding your vision is where empires begin.",
  },
  {
    num: '02',
    title: 'Design',
    desc: 'From mood boards to final concepts — every color, typeface, and element chosen with purpose. Crafting your identity with precision.',
  },
  {
    num: '03',
    title: 'Develop',
    desc: 'Designs become real-world assets: websites, social templates, print materials. Pixel-perfect and built for impact.',
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'Your brand goes live. Pixel-perfect, with guidelines for sustained growth. Your empire, released into the world.',
  },
]

export default function ProcessSection() {
  return (
    <section className="py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-24">
          <AnimatedSectionLabel>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">04</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Methodology</span>
          </AnimatedSectionLabel>
          <AnimatedSectionHeading
            text="How Does The Coast's Brand Design Process Work?"
            highlight={['Process', 'Work']}
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
          />
        </div>

        <ProcessTimelineContainer>
          <div className="flex flex-col gap-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0
              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 md:gap-16`}>
                  <ProcessNode />
                  <div className="hidden md:block md:w-1/2" />
                  <ProcessCard className="md:w-1/2 pl-16 md:pl-0 group hover-target" slideFrom={isEven ? 'right' : 'left'}>
                    <div className="p-8 bg-black border border-white/5 hover:border-white/20 transition-colors duration-500">
                      <div className="text-primary/50 font-mono text-sm mb-6 group-hover:text-primary transition-colors duration-500">
                        {step.num}
                      </div>
                      <h3 className="text-2xl font-display uppercase tracking-tight mb-4 text-white/80 group-hover:text-white transition-colors duration-500">
                        {step.title}
                      </h3>
                      <p className="text-white/60 text-sm font-light leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                        {step.desc}
                      </p>
                    </div>
                  </ProcessCard>
                </div>
              )
            })}
          </div>
        </ProcessTimelineContainer>
      </div>
    </section>
  )
}
