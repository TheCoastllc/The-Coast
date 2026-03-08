'use client'

import { motion } from 'motion/react'
import { ArrowRight, Check, Zap, Star, Rocket, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/footer'

const packages = [
  {
    name: 'Starter',
    price: 400,
    priceId: 'price_1T3tboHa3nZ9PR4PMYK6bzva',
    icon: Zap,
    description: 'Perfect for new brands getting off the ground.',
    features: [
      'Logo design',
      'Social media graphics',
      'Basic brand support',
      '1 revision round/month',
    ],
    popular: false,
  },
  {
    name: 'Brand Foundation',
    price: 800,
    priceId: 'price_1T3tcKHa3nZ9PR4PnbnUJEFA',
    icon: Star,
    description: 'Full brand identity and ongoing design support.',
    features: [
      'Everything in Starter',
      'Full brand identity system',
      'Social media management',
      'Flyer & promo design',
      '2 revision rounds/month',
    ],
    popular: true,
  },
  {
    name: 'Growth Accelerator',
    price: 1500,
    priceId: 'price_1T3tccHa3nZ9PR4PQXFWl4LP',
    icon: Rocket,
    description: 'Advanced creative direction for scaling brands.',
    features: [
      'Everything in Brand Foundation',
      'Video & motion graphics',
      'Pitch deck design',
      'Advanced creative direction',
      'Priority turnaround',
      'Unlimited revisions',
    ],
    popular: false,
  },
  {
    name: 'Ultimate Takeover',
    price: 2500,
    priceId: 'price_1T3teOHa3nZ9PR4PNPj8wKCu',
    icon: Crown,
    description: 'Full-service creative agency on retainer.',
    features: [
      'Everything in Growth Accelerator',
      'Unlimited design requests',
      'Website & landing pages',
      'Branded merch design',
      'Dedicated creative lead',
      'Same-day priority support',
    ],
    popular: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const handleGetStarted = () => {
    router.push('/intake')
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24" style={{ backgroundColor: '#050505' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-mono text-muted-foreground/50 block mb-3">Pricing</span>
            <h1 className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">Invest in Your Brand</h1>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
              Monthly retainer packages designed to keep your brand sharp, consistent, and always evolving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 md:py-32" style={{ backgroundColor: '#050505' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon
              return (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col rounded-2xl border p-6 md:p-8 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 ${
                    pkg.popular
                      ? 'border-primary bg-primary/[0.04] shadow-[0_0_40px_-12px_hsl(var(--primary)/0.3)]'
                      : 'border-border bg-card'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-mono text-xs px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-heading text-xl text-foreground">{pkg.name}</h3>
                  </div>

                  <p className="text-body text-muted-foreground text-sm mb-6">{pkg.description}</p>

                  <div className="mb-6">
                    <span className="text-heading text-4xl text-foreground">${pkg.price.toLocaleString()}</span>
                    <span className="text-mono text-muted-foreground text-sm">/mo</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-body text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-mono text-sm font-medium transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border border-border text-foreground hover:border-primary hover:bg-primary/10'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )
            })}
          </div>

          {/* One-time services CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
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

      <Footer />
    </main>
  )
}
