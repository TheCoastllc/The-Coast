'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GalleryItem, categoryLabel, displayTitle } from './types'
import { Lightbox } from './Lightbox'
import styles from './GalleryGrid.module.css'

const SIZES = '(max-width: 520px) 100vw, (max-width: 820px) 50vw, (max-width: 1240px) 33vw, 25vw'

/**
 * One masonry wall + its lightbox. Grouping is handled one level up by
 * GallerySections (each Drive subfolder renders its own GalleryGrid), so this
 * just renders the items it is given, optionally under a section heading.
 */
export function GalleryGrid({
  items,
  heading,
}: {
  items: GalleryItem[]
  heading?: { name: string; count: number }
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return (
      <div className={styles.wrap}>
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>The gallery is being curated.</h2>
          <p className={styles.emptyBody}>
            New work is on its way. In the meantime, follow along on Pinterest above.
          </p>
        </div>
      </div>
    )
  }

  const open = (i: number) => setOpenIndex(i)
  const close = () => setOpenIndex(null)
  const go = (next: number) => {
    const len = items.length
    setOpenIndex(((next % len) + len) % len)
  }

  return (
    <div className={styles.wrap}>
      {heading && (
        <div className={styles.sectionHead}>
          <h2 className={`${styles.sectionTitle} no-marble`}>{heading.name}</h2>
          <span className={styles.sectionCount}>{heading.count}</span>
        </div>
      )}

      <div className={styles.grid}>
        {items.map((item, i) => {
          const shownTitle = displayTitle(item.title)
          return (
            <button
              type="button"
              key={item.id}
              className={styles.cell}
              onClick={() => open(i)}
              data-cursor-label="View"
              aria-label={`View ${shownTitle ?? 'gallery image'}`}
            >
              <span
                className={styles.frame}
                style={{ aspectRatio: `${item.width} / ${item.height}` }}
              >
                <Image
                  className={styles.img}
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={SIZES}
                  loading="lazy"
                />
              </span>
              <span className={styles.meta}>
                {shownTitle && <span className={styles.metaTitle}>{shownTitle}</span>}
                {item.category && <span className={styles.metaCat}>{categoryLabel(item.category)}</span>}
              </span>
            </button>
          )
        })}
      </div>

      {openIndex !== null && items[openIndex] && (
        <Lightbox items={items} index={openIndex} onClose={close} onNavigate={go} />
      )}
    </div>
  )
}
