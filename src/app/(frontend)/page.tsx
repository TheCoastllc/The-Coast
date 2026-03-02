import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import './styles.css'
import Header from '@/components/Header'
import Hero from '@/components/pages/landingPage/Hero'
import SmoothScrolling from '@/components/SmoothScrolling'
import FeaturesSection from '@/components/pages/landingPage/FeaturesSection'
import FooterSection from '@/components/footer'
import { ReviewsSection } from '@/components/pages/landingPage/ReviewsSection'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  await payload.auth({ headers })

  return (
    <SmoothScrolling>
      <div className='flex flex-col gap-2 min-h-dvh'>
        <Header />
        <main className='flex-1'>
          <Hero />
          <FeaturesSection />
          <ReviewsSection />
        </main>
        <FooterSection />
      </div>
    </SmoothScrolling>
  )
}
