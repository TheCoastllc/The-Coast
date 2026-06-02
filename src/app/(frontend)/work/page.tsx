import type { Metadata } from 'next'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { WORK, type WorkItem } from '@/lib/content/coast'
import { DEFAULT_OG_IMAGES } from '@/lib/seo'
import styles from './work.module.css'

export const metadata: Metadata = {
  title: 'Our Work — Brand Transformations',
  description:
    'Brand transformations, creative projects, and the stories behind them - logo design, rebrands, and full visual identities from The Coast.',
  alternates: { canonical: 'https://coastglobal.org/work' },
  openGraph: {
    type: 'website',
    title: 'Our Work | Brand Transformations | The Coast',
    description: 'Brand transformations, creative projects, and the stories behind them.',
    url: 'https://coastglobal.org/work',
    images: DEFAULT_OG_IMAGES,
  },
}

const workBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://coastglobal.org/work' },
  ],
}

const workCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://coastglobal.org/work#webpage',
  url: 'https://coastglobal.org/work',
  name: 'Our Work',
  description: 'Explore brand transformations, logo design projects, and creative work from The Coast.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
}

function Card({ item, index, big = false }: { item: WorkItem; index: number; big?: boolean }) {
  return (
    <article className={`${styles.card} ${big ? styles.cardBig : ''}`} data-mode="3d">
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.cat}>{item.category}</span>
          <span className={styles.year}>{item.year}</span>
        </div>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.blurb}>{item.blurb}</p>
        <div className={styles.services}>
          {item.services.map((s) => (
            <span key={s} className={styles.service}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function WorkPage() {
  const featured = WORK.filter((w) => w.featured)
  const rest = WORK.filter((w) => !w.featured)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workBreadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workCollectionSchema) }} />

      <ChamberShell
        index="01"
        label="Work"
        chamber="Selected Work"
        preface="Thirty brands, fifty projects. A sample of what we have built."
      >
        <section className="section">
          <div className={styles.featured}>
            {featured.map((w, i) => (
              <Reveal key={w.name} variant={i % 2 === 0 ? 'mask-wipe' : 'rise-blur'} className={styles.featuredCell}>
                <Card item={w} index={i} big />
              </Reveal>
            ))}
          </div>

          <div className={styles.grid}>
            {rest.map((w, i) => (
              <Reveal key={w.name} variant={variantForIndex(i)} className={styles.cell}>
                <Card item={w} index={i + featured.length} />
              </Reveal>
            ))}
          </div>
        </section>
      </ChamberShell>
    </>
  )
}
