'use client'

import { useEffect, useState } from 'react'
import { GalleryHeader } from './GalleryHeader'
import { GallerySections } from './GallerySections'
import type { GallerySection } from './types'
import type { GalleryLinks } from '@/lib/gallery-links'
import styles from './GalleryExperience.module.css'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'coast-gallery-theme'

/**
 * Themed shell for the gallery. Holds the light/dark token set, paints the
 * canvas, and renders a permanent visitor-facing Light/Dark theme switch.
 * Default is Light (the Beardbrand look); a ?theme= deep link or a stored
 * choice override it, and the choice persists in localStorage.
 */
export function GalleryExperience({
  sections,
  links,
}: {
  sections: GallerySection[]
  links: GalleryLinks
}) {
  const [theme, setTheme] = useState<Theme>('light')

  // On mount: a ?theme= deep link wins, else the visitor's saved choice.
  // (Page stays static; this only runs client-side.)
  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('theme')
      const stored = localStorage.getItem(STORAGE_KEY)
      const t = param || stored
      if (t === 'dark' || t === 'light') setTheme(t)
    } catch {}
  }, [])

  const flip = (t: Theme) => {
    setTheme(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {}
    try {
      const u = new URL(window.location.href)
      u.searchParams.set('theme', t)
      window.history.replaceState(null, '', u.toString())
    } catch {}
  }

  return (
    <div className={styles.root} data-theme={theme}>
      <div className={styles.canvas} aria-hidden="true" />
      <GalleryHeader links={links} />
      <GallerySections sections={sections} />

      <div className={styles.toggle} role="group" aria-label="Color theme">
        <span className={styles.toggleLabel}>Theme</span>
        <button
          type="button"
          className={styles.toggleBtn}
          data-on={theme === 'light'}
          onClick={() => flip('light')}
          data-cursor="active"
        >
          Light
        </button>
        <button
          type="button"
          className={styles.toggleBtn}
          data-on={theme === 'dark'}
          onClick={() => flip('dark')}
          data-cursor="active"
        >
          Dark
        </button>
      </div>
    </div>
  )
}
