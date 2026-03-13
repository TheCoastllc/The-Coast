'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus } from 'lucide-react'
import TextReveal from '@/components/TextReveal'

const faqs = [
  {
    question: "What is your typical project timeline?",
    answer: "Our engagements typically range from 2 to 6 weeks, depending on the scope and complexity of the project. We believe in moving fast without compromising on the quality we're known for."
  },
  {
    question: "Do you work with startups or established businesses?",
    answer: "Both. We partner with entrepreneurs, solo founders, small businesses, and growing companies who are ready to level up their brand presence and demand a visual identity that reflects their ambition."
  },
  {
    question: "What is your pricing structure?",
    answer: "We price based on value and scope, not hourly rates. Every project is unique, and we construct custom proposals after a discovery session to understand your exact needs. We also offer monthly retainer packages."
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer: "Yes. We view our client relationships as long-term partnerships. We offer retainer agreements for continuous design, development, and strategic support to ensure your brand evolves with your business."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-32 bg-black" id="faq">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-mono">07</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Questions</span>
          </motion.div>
          <TextReveal
            className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter"
            highlight={["Inquiries"]}
          >
            Common Inquiries
          </TextReveal>
        </div>

        <div className="max-w-4xl mx-auto border-t border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-b border-white/10"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-8 flex items-center justify-between gap-8 text-left group hover-target"
                >
                  <h3 className={`text-xl md:text-3xl font-display uppercase tracking-tight transition-colors duration-500 ${isOpen ? 'text-primary' : 'text-white/80 group-hover:text-white'}`}>
                    {faq.question}
                  </h3>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${isOpen ? 'bg-primary border-primary text-black' : 'border-white/10 text-muted-foreground group-hover:border-white/40 group-hover:text-white'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-white/50 font-light leading-relaxed max-w-2xl text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
