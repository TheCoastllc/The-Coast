import type { Metadata } from 'next'
import BrandAvatarClient from './BrandAvatarClient'

export const metadata: Metadata = {
  title: 'Brand Builder — Design Your Custom Brand Package',
  description:
    'Build your custom brand package piece by piece. Select logo design, social media, copywriting, brand strategy, website design, marketing materials, and more.',
  alternates: { canonical: 'https://coastglobal.org/brand-avatar' },
  openGraph: {
    title: 'Brand Builder — Build Your Brand Avatar | The Coast',
    description:
      'Interactive brand builder tool. Select the services that make up your complete brand identity.',
    url: 'https://coastglobal.org/brand-avatar',
  },
}

export default function BrandAvatarPage() {
  return (
    <>
      <section className="sr-only">
        <h2>Design Your Custom Brand Package</h2>
        <p>
          The Brand Builder is an interactive configurator for assembling a complete brand
          identity package, piece by piece. Select the services your business actually needs —
          from logo design and visual identity, to social media kits, website design and
          development, copywriting, brand strategy, packaging, and ongoing marketing support — and
          the builder assembles a scope and indicative quote in real time. No two brands should be
          priced from the same template, and no founder should pay for deliverables they do not
          need.
        </p>
        <p>
          The services on offer include primary logo design and mark systems, complete visual
          identity with color palettes and typography, brand strategy and positioning workshops,
          social media content kits and templates, website design and development, copywriting and
          tone-of-voice development, print collateral including business cards and pitch decks,
          motion and animation, packaging design, and ongoing creative retainers. Mix and match
          based on what your brand needs right now, and add services later as you grow.
        </p>
        <p>
          The Brand Builder is a free scoping tool. At the end, you can send the configuration to
          our team and a strategist will follow up with a refined quote, recommendations, and
          next-step timing. If you prefer to speak to someone first, you can also request a
          discovery call from the /get-started page.
        </p>
      </section>
      <BrandAvatarClient />
    </>
  )
}
