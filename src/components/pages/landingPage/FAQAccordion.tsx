'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus } from 'lucide-react'

export function FAQAccordionList({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-4xl mx-auto border-t border-white/10">
      {items.map((faq, index) => {
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
  )
}
