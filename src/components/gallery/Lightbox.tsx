'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { GalleryItem, displayTitle } from './types'
import styles from './Lightbox.module.css'

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ArrowOut() {
  return (
    <svg className={styles.pillArrow} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onNavigate: (next: number) => void
}) {
  const [mounted, setMounted] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)

  // Keep latest values for the single keydown listener.
  const idxRef = useRef(index)
  idxRef.current = index
  const navRef = useRef(onNavigate)
  navRef.current = onNavigate
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    setMounted(true)
    const prevFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
      else if (e.key === 'ArrowLeft') navRef.current(idxRef.current - 1)
      else if (e.key === 'ArrowRight') navRef.current(idxRef.current + 1)
    }
    window.addEventListener('keydown', onKey)
    // Move focus into the dialog.
    requestAnimationFrame(() => closeBtn.current?.focus())

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocused?.focus?.()
    }
  }, [])

  if (!mounted) return null

  const item = items[index]
  if (!item) return null

  const shownTitle = displayTitle(item.title)
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return createPortal(
    <div
      className={styles.scrim}
      role="dialog"
      aria-modal="true"
      aria-label={shownTitle ?? 'Gallery image'}
      onClick={() => onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current
        if (Math.abs(dx) > 50) onNavigate(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <span className={styles.counter}>
        {index + 1} / {items.length}
      </span>
      <button ref={closeBtn} type="button" className={`${styles.ctrl} ${styles.close}`} onClick={(e) => { stop(e); onClose() }} aria-label="Close" data-cursor-label="Close">
        <CloseIcon />
      </button>

      {items.length > 1 && (
        <button type="button" className={`${styles.ctrl} ${styles.prev}`} onClick={(e) => { stop(e); onNavigate(index - 1) }} aria-label="Previous" data-cursor-label="Prev">
          <Chevron dir="left" />
        </button>
      )}

      <div className={styles.stage} onClick={stop}>
        <Image
          className={styles.img}
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="92vw"
          priority
          draggable={false}
        />
      </div>

      {items.length > 1 && (
        <button type="button" className={`${styles.ctrl} ${styles.next}`} onClick={(e) => { stop(e); onNavigate(index + 1) }} aria-label="Next" data-cursor-label="Next">
          <Chevron dir="right" />
        </button>
      )}

      <div className={styles.caption} onClick={stop}>
        {shownTitle && <h2 className={`${styles.capTitle} no-marble`}>{shownTitle}</h2>}
        {item.caption && <p className={styles.capText}>{item.caption}</p>}
        {(item.shopUrl || item.pinUrl) && (
          <div className={styles.capActions}>
            {item.shopUrl && (
              <a className={`${styles.pill} ${styles.pillPrimary}`} href={item.shopUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="Shop">
                Shop this
                <ArrowOut />
              </a>
            )}
            {item.pinUrl && (
              <a className={`${styles.pill} ${styles.pillGhost}`} href={item.pinUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="Open">
                View on Pinterest
                <ArrowOut />
              </a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
