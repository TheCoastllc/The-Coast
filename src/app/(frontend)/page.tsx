import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/pages/landingPage/Hero'
import Manifesto from '@/components/pages/landingPage/Manifesto'
import About from '@/components/pages/landingPage/About'
import Services from '@/components/pages/landingPage/Services'
import ProcessSection from '@/components/pages/landingPage/ProcessSection'
import Portfolio from '@/components/pages/landingPage/Portfolio'
import Clients from '@/components/pages/landingPage/Clients'
import FAQ from '@/components/pages/landingPage/FAQ'
import BlogPreview from '@/components/pages/landingPage/BlogPreview'
import Contact from '@/components/pages/landingPage/Contact'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <About />
        <Services />
        <ProcessSection />
        <Portfolio />
        <Clients />
        <FAQ />
        <Suspense>
          <BlogPreview />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
