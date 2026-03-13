'use client'

import { motion } from 'motion/react'
import { createElement, type ElementType } from 'react'

const ease = [0.16, 1, 0.3, 1] as const

type TextRevealProps = {
  children: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  highlight?: string[]
  wordStyles?: Record<string, string>
}

export default function TextReveal({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.06,
  highlight = [],
  wordStyles = {},
}: TextRevealProps) {
  const words = children.split(' ')

  const getWordClassName = (word: string) => {
    const clean = word.replace(/[.,!?;:'"]/g, '').toLowerCase()
    if (highlight.some(h => h.toLowerCase() === clean)) return 'text-primary'
    const style = Object.entries(wordStyles).find(([key]) => key.toLowerCase() === clean)
    return style ? style[1] : ''
  }

  return createElement(
    Tag,
    { className },
    words.map((word, i) => (
      <span key={i} className="overflow-hidden inline-block pb-[0.15em] -mb-[0.15em]">
        <motion.span
          initial={{ y: '100%', rotate: 2 }}
          whileInView={{ y: 0, rotate: 0 }}
          viewport={{ once: false, margin: '-20px' }}
          transition={{ duration: 1, delay: delay + i * stagger, ease }}
          className={`inline-block origin-bottom-left ${getWordClassName(word)}`}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      </span>
    ))
  )
}
