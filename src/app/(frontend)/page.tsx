import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/pages/landingPage/Hero'
import VideoShowcase from '@/components/pages/landingPage/VideoShowcase'
import Portfolio from '@/components/pages/landingPage/Portfolio'
import Services from '@/components/pages/landingPage/Services'
import ProcessSection from '@/components/pages/landingPage/ProcessSection'
import StatsCounter from '@/components/pages/landingPage/StatsCounter'
import About from '@/components/pages/landingPage/About'
import GoogleReviews from '@/components/pages/landingPage/GoogleReviews'
import BlogPreview from '@/components/pages/landingPage/BlogPreview'
import Contact from '@/components/pages/landingPage/Contact'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <Header />
      <main>
        <Hero />
        <VideoShowcase />
        <Portfolio />
        <Services />
        <ProcessSection />
        <StatsCounter />
        <About />
        <GoogleReviews />
        <Suspense>
          <BlogPreview />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
