import type { GalleryLinks } from '@/lib/gallery-links'
import styles from './GalleryHeader.module.css'

const MAIN_SITE = 'https://coastglobal.org'

function ArrowOut({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Gallery header: a sticky glass bar (The Coast mark + Pinterest/Shop links)
 * and an editorial hero. The hero <h1> is the page's sole heading.
 */
export function GalleryHeader({ links }: { links: GalleryLinks }) {
  return (
    <>
      <header className={styles.bar}>
        <a className={styles.mark} href={MAIN_SITE} data-cursor-label="The Coast">
          <span className={styles.markDiamond} aria-hidden="true" />
          The Coast
        </a>
        <nav className={styles.barLinks} aria-label="Gallery links">
          <a
            className={styles.barLink}
            href={links.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="Open"
          >
            Pinterest
            <ArrowOut className={styles.arrow} />
          </a>
          {links.shopify && (
            <a
              className={styles.barLink}
              href={links.shopify}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="Open"
            >
              Shop
              <ArrowOut className={styles.arrow} />
            </a>
          )}
        </nav>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>The Coast / Gallery</p>
        <h1 className={`${styles.title} no-marble`}>The Gallery</h1>
        <p className={styles.statement}>
          <em>Design The Future</em>
        </p>
        <p className={styles.lead}>
          Artwork, imagery, and original creatives from the studio - a curated, ever-growing
          collection. Save your favorites on Pinterest, or take a piece home from the shop.
        </p>
        <div className={styles.ctas}>
          <a
            className={`${styles.cta} ${styles.ctaPrimary}`}
            href={links.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="Open"
          >
            Follow on Pinterest
            <ArrowOut className={styles.arrow} />
          </a>
          {links.shopify && (
            <a
              className={`${styles.cta} ${styles.ctaGhost}`}
              href={links.shopify}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="Open"
            >
              Visit the Shop
              <ArrowOut className={styles.arrow} />
            </a>
          )}
        </div>
      </section>
    </>
  )
}
