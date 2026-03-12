'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import PricingSection from '@/components/pricing'

export default function PricingPage() {
  const router = useRouter()

  return (
    <BlueprintLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-mono text-muted-foreground/50 block mb-3">Pricing</span>
            <h1 className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">Invest in Your Brand</h1>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
              Monthly retainer packages designed to keep your brand sharp, consistent, and always evolving.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionBoundary />

      {/* Pricing Cards */}
      <section className="py-20 md:py-32">
        <PricingSection />
      </section>

      <SectionBoundary />

      {/* One-time services CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-body text-muted-foreground text-lg mb-4">
              Need a one-time project instead? Check out our à la carte services.
            </p>
            <button
              onClick={() => router.push('/services')}
              className="inline-flex items-center gap-3 text-mono text-sm text-primary hover:text-foreground transition-colors duration-300"
            >
              View Services & Pricing
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
