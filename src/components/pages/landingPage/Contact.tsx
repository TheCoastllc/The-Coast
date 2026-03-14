'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'

export default function Contact() {
  return (
    <section className="py-32 bg-black" id="contact">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">09</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Contact</span>
          </motion.div>
          <TextReveal
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
            highlight={["Talk"]}
          >
            {"Let's Talk"}
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/50 font-light leading-relaxed mb-12 max-w-md">
              Ready to build your empire? Whether you&apos;re opening your first coffee shop, launching a startup, or ready to rebrand and level up — we&apos;re here to make your brand unforgettable.
            </p>
            <a href="mailto:hello@coastglobal.org" className="text-xl md:text-3xl font-display uppercase tracking-tighter hover:text-primary transition-colors duration-300 flex items-center gap-4 group w-fit">
              hello@coastglobal.org
              <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-300 text-primary" />
            </a>
            <div className="mt-8">
              <a href="tel:+16827020374" className="text-white/50 hover:text-primary transition-colors text-sm font-mono uppercase tracking-wider">
                +1 (682) 702-0374
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">Name</label>
              <input type="text" className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors rounded-none" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">Email</label>
              <input type="email" className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors rounded-none" placeholder="john@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">Message</label>
              <textarea className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors resize-none h-24 rounded-none" placeholder="Tell us about your project..."></textarea>
            </div>
            <ShineButton full size='md' type="submit">
              Send Message
            </ShineButton>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
