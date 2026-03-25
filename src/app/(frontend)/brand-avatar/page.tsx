import type { Metadata } from 'next'
import BrandAvatarClient from './BrandAvatarClient'

export const metadata: Metadata = {
  title: 'Brand Builder',
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
  return <BrandAvatarClient />
}
