'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'

const designServices = [
  { number: '01', title: 'Logo Design', description: 'Custom logo with 3 concepts & 2 revision rounds' },
  { number: '02', title: 'Flyers', description: 'Print-ready promotional designs (digital + print)' },
  { number: '03', title: 'EPK / Press Kit', description: 'Professional media kit for press & partners' },
  { number: '04', title: 'Social Graphics', description: '5–10 branded templates for social platforms' },
  { number: '05', title: 'Full Rebrand', description: 'Complete brand transformation package' },
  { number: '06', title: 'Brand Identity Guidelines', description: 'Logo, colors, typography, brand guidelines' },
  { number: '07', title: 'Website Design', description: 'Custom website design & development' },
  { number: '08', title: 'Pitch Deck / Investor Materials', description: 'Investor-ready presentation design' },
  { number: '09', title: 'Video & Motion', description: 'Promotional videos & animations (per piece)' },
  { number: '10', title: 'Digital Marketing', description: 'SEO, ads setup, email campaigns' },
  { number: '11', title: 'Social Media Management', description: 'Content creation, scheduling & management' },
]

export default function ServicesClient() {
  const router = useRouter()

  return (
    <BlueprintLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-mono text-muted-foreground/50 block mb-3 md:mb-4">Services</span>
            <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">What We Create</TextReveal>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
              From identity design to complete brand transformations—everything you need to stand out.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionBoundary />

      {/* Services List */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-6 md:px-12">
          <div className="border-t border-border">
            {designServices.map((service, index) => (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => router.push('/get-started')}
                className="group border-b border-border py-6 md:py-8 lg:py-10 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
                  <span className="text-mono text-primary/70 text-sm md:w-12 shrink-0">{service.number}</span>

                  <h3 className="text-heading text-2xl md:text-4xl lg:text-5xl text-foreground shrink-0 md:w-72 group-hover:translate-x-2 transition-transform duration-300">
                    {service.title}
                  </h3>

                  <p className="text-body text-muted-foreground text-sm md:text-base flex-1 max-w-xl">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-mono text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300 shrink-0">
                    <span className="hidden md:inline">Request a Quote</span>
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-border group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-6 md:px-12">
          {/* CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-body text-muted-foreground text-lg mb-6">
              Want ongoing support? Check out our monthly retainer packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/get-started')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors duration-300"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="inline-flex items-center gap-3 px-8 py-4 border border-border text-foreground rounded-full text-mono text-sm hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                View Packages
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
