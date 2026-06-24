'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GalleryItem } from './types'
import { Lightbox } from './Lightbox'
import styles from './GalleryStrip.module.css'

/**
 * A de-emphasized horizontal scroll row at the bottom of the gallery - used for
 * near-duplicate sets (e.g. "Design the Future") so the main wall above shines.
 * One line, fixed height, scrolls sideways; click opens the shared lightbox.
 */
export function GalleryStrip({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (items.length === 0) return null

  const go = (next: number) => {
    const len = items.length
    setOpenIndex(((next % len) + len) % len)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.rail} role="list">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className={styles.cell}
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
            onClick={() => setOpenIndex(i)}
            aria-label="View image"
            data-cursor-label="View"
          >
            <Image
              className={styles.img}
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 520px) 55vw, 260px"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && items[openIndex] && (
        <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={go} />
      )}
    </div>
  )
}
