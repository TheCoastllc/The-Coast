import type { Metadata } from 'next'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import { SERVICES, PROCESS, ENGAGEMENT, PILLARS } from '@/lib/content/coast'
import { ServiceStack } from '@/components/home/services/ServiceWorlds'
import { CardIcon } from '@/components/ui/CardIcon'
import { DEFAULT_OG_IMAGES, buildTwitter } from '@/lib/seo'
import styles from './services.module.css'

export const metadata: Metadata = {
  title: 'Branding, Digital & AI Services',
  description:
    'Logo design, brand identity, websites, digital marketing, and AI - fixed-scope creative services that turn small businesses into premium brands.',
  alternates: { canonical: 'https://coastglobal.org/services' },
  twitter: buildTwitter({
    title: 'Branding, Digital & AI Services | The Coast Global',
    description:
      'From logo design to full brand transformations - everything your business needs to stand out.',
  }),
  openGraph: {
    type: 'website',
    title: 'Branding, Digital & AI Services | The Coast Global',
    description:
      'From logo design to full brand transformations - everything your business needs to stand out.',
    url: 'https://coastglobal.org/services',
    images: DEFAULT_OG_IMAGES,
  },
}

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'The Coast Global - Brand Design Services',
  url: 'https://coastglobal.org/services',
  numberOfItems: 14,
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Branding & Marketing', description: 'Logo design, full branding, brand revamp, social media, marketing - small brands transformed to premium-tier.', url: 'https://coastglobal.org/services', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Digital Growth', description: 'Lead generation, paid ads, and everything digital marketing.', url: 'https://coastglobal.org/services/digital-marketing', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'AI & Software Solutions', description: 'AI consultancy and custom AI + software builds - chatbots, tools, automation.', url: 'https://coastglobal.org/services/ai-consulting', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Logo Design', description: 'Custom logo with 3 concepts & 2 revision rounds', url: 'https://coastglobal.org/services/logo-design', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'Full Rebrand', description: 'Complete brand transformation package', url: 'https://coastglobal.org/services/rebrand', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Brand Identity Guidelines', description: 'Logo, colors, typography & usage rules', url: 'https://coastglobal.org/services/brand-guidelines', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 7, item: { '@type': 'Service', name: 'Flyers', description: 'Print-ready promotional designs (digital + print)', url: 'https://coastglobal.org/services/flyers', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 8, item: { '@type': 'Service', name: 'EPK / Press Kit', description: 'Professional media kit for press & partners', url: 'https://coastglobal.org/services/epk-design', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 9, item: { '@type': 'Service', name: 'Social Graphics', description: '5-10 branded templates for social platforms', url: 'https://coastglobal.org/services/social-graphics', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 10, item: { '@type': 'Service', name: 'Pitch Deck', description: 'Investor-ready presentation design', url: 'https://coastglobal.org/services/pitch-deck', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 11, item: { '@type': 'Service', name: 'Website Design', description: 'Custom website design & development', url: 'https://coastglobal.org/services/website-design', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 12, item: { '@type': 'Service', name: 'Video & Motion', description: 'Promotional videos & animations', url: 'https://coastglobal.org/services/video-motion', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 13, item: { '@type': 'Service', name: 'Digital Marketing', description: 'SEO, ads setup, email campaigns', url: 'https://coastglobal.org/services/digital-marketing', provider: { '@id': 'https://coastglobal.org/#organization' } } },
    { '@type': 'ListItem', position: 14, item: { '@type': 'Service', name: 'Social Media Management', description: 'Content creation, scheduling & management', url: 'https://coastglobal.org/services/social-media-management', provider: { '@id': 'https://coastglobal.org/#organization' } } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://coastglobal.org/services' },
  ],
}

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ChamberShell
        index="03"
        label="Services"
        chamber="What We Do"
        preface="An end-to-end ecosystem for the visionaries behind the brands."
      >
        {/* The offering - three pillars, stacked (the Awwwards format) */}
        <section className="section">
          <ServiceStack />
        </section>

        {/* Services */}
        <section className="section">
          <p className="sectionLabel">Within the pillars</p>
          <div className={styles.list}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.name} variant={variantForIndex(i)}>
                <article className={`${styles.service} glass`} data-glow={['', 'gold', 'orange'][i % 3] || undefined}>
                  <CardIcon name={s.icon} className="cardIcon" />
                  <div className={styles.head}>
                    <span className={styles.idx}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={styles.name}>{s.name}</h3>
                  </div>
                  <p className={styles.body}>{s.body}</p>
                  <ul className={styles.items}>
                    {s.items.map((it) => (
                      <li key={it} className={styles.item}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="pill takeaway">Six services, one coherent system</p>
        </section>

        {/* Process */}
        <section className="section">
          <p className="sectionLabel">How we work</p>
          <h2 className="sectionTitle">Four steps, two to six weeks.</h2>
          <div className={styles.process}>
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} variant={variantForIndex(i)}>
                <div className={`${styles.step} glass`} data-glow={['', 'gold', 'orange'][i % 3] || undefined}>
                  <CardIcon name={p.icon} className="cardIcon" />
                  <span className={styles.stepNum}>{p.n}</span>
                  <h4 className={styles.stepTitle}>{p.title}</h4>
                  <p className={styles.stepBody}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="pill takeaway">Discovery to launch in two to six weeks</p>
        </section>

        {/* Engagement */}
        <section className="section">
          <p className="sectionLabel">Engagement</p>
          <h2 className="sectionTitle">{ENGAGEMENT.lead}</h2>
          <p className="prose">{ENGAGEMENT.body}</p>
          <div className={styles.models}>
            {ENGAGEMENT.models.map((m) => (
              <div key={m.name} className={`${styles.model} glass`}>
                <h4 className={styles.modelName}>{m.name}</h4>
                <p className={styles.modelDetail}>{m.detail}</p>
                <span className={styles.modelTime}>{m.time}</span>
              </div>
            ))}
          </div>
        </section>
      </ChamberShell>
    </>
  )
}
