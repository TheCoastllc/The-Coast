import { Suspense } from 'react'
import About from '@/components/pages/landingPage/About'
import Services from '@/components/pages/landingPage/Services'
import ProcessSection from '@/components/pages/landingPage/ProcessSection'
import Portfolio from '@/components/pages/landingPage/Portfolio'
import Clients from '@/components/pages/landingPage/Clients'
import FAQ from '@/components/pages/landingPage/FAQ'
import BlogPreview from '@/components/pages/landingPage/BlogPreview'
import Contact from '@/components/pages/landingPage/Contact'
import { HeroSection } from '@/components/hero'
import { LogosSection } from '@/components/logos-section'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'

export default function HomePage() {
  return (
    <BlueprintLayout>
      {/* Hero area */}
      <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
        <div className="relative max-w-6xl mx-auto grow">
          <HeroSection />
          <LogosSection />
        </div>
      </div>

      <SectionBoundary />
      <About />
      <SectionBoundary />
      <Services />
      <SectionBoundary />
      <ProcessSection />
      <SectionBoundary />
      <Portfolio />
      <SectionBoundary />
      <Clients />
      <SectionBoundary />
      <FAQ />
      <SectionBoundary />
      <Suspense>
        <BlogPreview />
      </Suspense>
      <SectionBoundary />
      <Contact />
    </BlueprintLayout>
  )
}
