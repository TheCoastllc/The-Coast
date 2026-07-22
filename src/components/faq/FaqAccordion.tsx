'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import styles from './FaqAccordion.module.css'

type FaqItem = { question: string; answer: string }

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className={styles.list}>
      {items.map((faq, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`
        return (
          <div
            key={index}
            className={`${styles.item} glass`}
            data-glow={index % 3 === 1 ? 'gold' : undefined}
            data-open={isOpen || undefined}
          >
            <button
              id={buttonId}
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              data-cursor-label={isOpen ? 'Close' : 'Open'}
            >
              <h3 className={styles.question}>{faq.question}</h3>
              <span className={styles.toggle} aria-hidden="true">
                <span
                  className={styles.toggleIcon}
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </span>
            </button>
            {/* panels stay mounted so every answer is in the server-rendered
                DOM (text extractors and AI engines read all of them, not just
                the open one) - the toggle only animates height/opacity */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={styles.panel}
              initial={false}
              animate={
                isOpen
                  ? { height: 'auto', opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
              aria-hidden={!isOpen}
            >
              <p className={styles.answer}>{faq.answer}</p>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
