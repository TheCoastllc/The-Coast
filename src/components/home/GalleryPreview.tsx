'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './GalleryPreview.module.css'

export type GalleryPreviewItem = {
  id: string | number
  src: string
  width: number
  height: number
}

const GALLERY_URL = 'https://gallery.coastglobal.org'
const SHOWN = 8
const CYCLE_MS = 3500
const SIZES = '(max-width: 760px) 50vw, 25vw'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Homepage gallery teaser. Shuffles a random N on load, then auto-cycles - one
 * random tile swaps to a fresh pool image every few seconds (the image keys off
 * its id, so the new one fades in). Paused when the tab is hidden; off for
 * reduced-motion users.
 */
export function GalleryPreview({ items }: { items: GalleryPreviewItem[] }) {
  const [shown, setShown] = useState<GalleryPreviewItem[]>(() => items.slice(0, SHOWN))

  // per-load shuffle (stable first paint, then randomize on mount)
  useEffect(() => {
    setShown(shuffle(items).slice(0, SHOWN))
  }, [items])

  // auto-cycle: swap one random tile for a fresh pool image on an interval
  useEffect(() => {
    if (items.length <= SHOWN) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (document.hidden) return
      setShown((cur) => {
        const used = new Set(cur.map((i) => i.id))
        const pool = items.filter((i) => !used.has(i.id))
        if (!pool.length) return cur
        const next = pool[Math.floor(Math.random() * pool.length)]
        const idx = Math.floor(Math.random() * cur.length)
        const copy = cur.slice()
        copy[idx] = next
        return copy
      })
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [items])

  if (!shown.length) return null
  return (
    <div className={styles.grid}>
      {shown.map((item, i) => (
        <a
          key={i}
          href={GALLERY_URL}
          className={styles.cell}
          data-cursor-label="View"
          aria-label="View the gallery"
        >
          <Image
            key={item.id}
            className={styles.img}
            src={item.src}
            alt="The Coast gallery artwork"
            fill
            sizes={SIZES}
            loading="lazy"
          />
        </a>
      ))}
    </div>
  )
}
