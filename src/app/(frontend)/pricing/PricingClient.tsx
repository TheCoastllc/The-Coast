'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { ShineButton } from '@/components/ui/ShineButton'
import { TransitionLink } from '@/components/PageTransition'
import { Reveal } from '@/components/motion/Reveal'
import { variantForIndex } from '@/components/motion/revealVariants'
import styles from './pricing.module.css'

type Tier = {
  name: string
  desc: string
  monthly: number
  annually: number
  cta: string
  features: string[]
  featured?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Creator',
    desc: 'Ideal for freelance designers and creative beginners.',
    monthly: 0,
    annually: 0,
    cta: 'Start for free',
    features: [
      'Up to 5 design projects',
      'Basic brand kit tools',
      'Community feedback access',
      'Starter UI components',
      'Export in PNG & JPG',
    ],
  },
  {
    name: 'Studio',
    desc: 'Advanced toolkit for agencies and growing creative teams.',
    monthly: 50,
    annually: 25,
    cta: 'Start Creating',
    featured: true,
    features: [
      'Unlimited design projects',
      'Complete brand management',
      'Advanced UI component library',
      'Figma & Adobe integration',
      'Vector & SVG export',
      'Team collaboration workspace',
      'Priority creative support',
      'Version history & backups',
    ],
  },
  {
    name: 'Agency Pro',
    desc: 'Full-scale creative infrastructure for large design teams.',
    monthly: 500,
    annually: 250,
    cta: 'Go Agency Pro',
    features: [
      'Everything in Studio',
      'Dedicated creative strategist',
      'White-label design system',
      'Custom component development',
      'Advanced asset management',
      'SSO & enterprise security',
      'Custom contracts & billing',
      '24/7 premium support',
    ],
  },
]

export default function PricingClient() {
  const [billing, setBilling] = useState<'monthly' | 'annually'>('annually')

  return (
    <>
      <div className={styles.toggleRow}>
        <div className={styles.toggle}>
          <button type="button" className={styles.toggleBtn} data-on={billing === 'annually'} onClick={() => setBilling('annually')}>Annually</button>
          <button type="button" className={styles.toggleBtn} data-on={billing === 'monthly'} onClick={() => setBilling('monthly')}>Monthly</button>
        </div>
        {billing === 'annually' && <span className={styles.toggleNote}>Save with annual billing</span>}
      </div>

      <div className={styles.tiers}>
        {tiers.map((t, i) => (
          <Reveal key={t.name} variant={variantForIndex(i)}>
            <div className={`${styles.tier} glass`} data-featured={t.featured || undefined} data-glow={t.featured ? 'gold' : undefined}>
              {t.featured && <span className={styles.badge}>Most Popular</span>}
              <div>
                <h3 className={styles.tierName}>{t.name}</h3>
                <p className={styles.tierDesc}>{t.desc}</p>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.price}>${billing === 'annually' ? t.annually : t.monthly}</span>
                <span className={styles.priceUnit}>per {billing === 'monthly' ? 'month' : 'year'}, per user</span>
              </div>
              <div className={styles.ctaWrap}>
                <ShineButton href="/get-started" size="sm" full variant={t.featured ? 'default' : 'ghost'}>{t.cta}</ShineButton>
              </div>
              <div className={styles.features}>
                {t.features.map((f) => (
                  <div key={f} className={styles.feature}>
                    <Check className={styles.featureIcon} size={15} strokeWidth={2.5} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className={styles.alacarte}>
        <p className={styles.alacarteText}>Need a one-time project instead? Explore our à la carte services.</p>
        <TransitionLink href="/services" className="pill" data-cursor-label="View">View Services &amp; Pricing →</TransitionLink>
      </div>
    </>
  )
}
