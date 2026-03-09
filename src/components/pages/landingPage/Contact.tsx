'use client'

import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

export default function Contact() {
  return (
    <section className="py-32 bg-black border-t border-white/5" id="contact">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">09</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Contact</span>
          </motion.div>
          <div className="overflow-hidden pb-4">
            <motion.h2
              initial={{ y: "100%", rotate: 2 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter origin-bottom-left"
            >
              Let&apos;s <span className="text-primary">Talk</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/50 font-light leading-relaxed mb-12 max-w-md">
              Ready to build your empire? Whether you&apos;re opening your first coffee shop, launching a startup, or ready to rebrand and level up — we&apos;re here to make your brand unforgettable.
            </p>
            <a href="mailto:hello@coastglobal.org" className="text-2xl md:text-4xl font-display uppercase tracking-tighter hover:text-primary transition-colors duration-300 flex items-center gap-4 group w-fit">
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
              <label className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">Name</label>
              <input type="text" className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors rounded-none" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">Email</label>
              <input type="email" className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors rounded-none" placeholder="john@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">Message</label>
              <textarea className="bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-primary transition-colors resize-none h-24 rounded-none" placeholder="Tell us about your project..."></textarea>
            </div>
            <button type="submit" className="self-start px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-primary transition-colors duration-300 mt-4">
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
