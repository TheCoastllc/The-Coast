import { ArrowUpRight } from 'lucide-react'
import { AnimatedSectionLabel, AnimatedSectionHeading, FadeIn } from './AnimationWrappers'
import { ContactForm } from './ContactForm'

export default function Contact() {
  return (
    <section className="py-32 bg-black" id="contact">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <AnimatedSectionLabel>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">10</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Contact</span>
          </AnimatedSectionLabel>
          <AnimatedSectionHeading
            text="Let's Talk"
            highlight={["Talk"]}
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          {/* Contact info - rendered server-side for AI crawlers */}
          <FadeIn direction="left">
            <p className="text-white/70 font-light leading-relaxed mb-12 max-w-md">
              Ready to build your empire? Whether you&apos;re opening your first coffee shop, launching a startup, or ready to rebrand and level up - we&apos;re here to make your brand unforgettable.
            </p>
            <a href="mailto:hello@coastglobal.org" className="text-xl md:text-3xl font-display uppercase tracking-tighter hover:text-primary transition-colors duration-300 flex items-center gap-4 group w-fit">
              hello@coastglobal.org
              <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-300 text-primary" />
            </a>
            <div className="mt-8">
              <a href="tel:+16827020374" className="text-white/70 hover:text-primary transition-colors text-sm font-mono uppercase tracking-wider">
                +1 (682) 702-0374
              </a>
            </div>
          </FadeIn>

          {/* Form - client component for interactivity */}
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
