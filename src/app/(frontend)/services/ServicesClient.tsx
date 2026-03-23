'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { usePageTransition } from '@/components/PageTransition'

const serviceGroups = [
  {
    category: 'Brand Identity',
    label: '01 — 03',
    services: [
      { number: '01', title: 'Logo Design', description: 'Custom logo with 3 concepts & 2 revision rounds' },
      { number: '02', title: 'Full Rebrand', description: 'Complete brand transformation package' },
      { number: '03', title: 'Brand Identity Guidelines', description: 'Logo, colors, typography & usage rules' },
    ],
  },
  {
    category: 'Collateral',
    label: '04 — 07',
    services: [
      { number: '04', title: 'Flyers', description: 'Print-ready promotional designs (digital + print)' },
      { number: '05', title: 'EPK / Press Kit', description: 'Professional media kit for press & partners' },
      { number: '06', title: 'Social Graphics', description: '5–10 branded templates for social platforms' },
      { number: '07', title: 'Pitch Deck', description: 'Investor-ready presentation design' },
    ],
  },
  {
    category: 'Digital',
    label: '08 — 11',
    services: [
      { number: '08', title: 'Website Design', description: 'Custom website design & development' },
      { number: '09', title: 'Video & Motion', description: 'Promotional videos & animations (per piece)' },
      { number: '10', title: 'Digital Marketing', description: 'SEO, ads setup, email campaigns' },
      { number: '11', title: 'Social Media Management', description: 'Content creation, scheduling & management' },
    ],
  },
]

function ServiceRow({ service, index }: { service: (typeof serviceGroups)[0]['services'][0]; index: number }) {
  const { navigateTo } = usePageTransition()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      viewport={{ once: true }}
      onClick={() => navigateTo('/get-started')}
      className="group relative border-b border-border cursor-pointer"
    >
      {/* Left primary bar indicator */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

      <div className="flex items-center gap-4 md:gap-8 py-5 md:py-7 pl-5 md:pl-8 pr-4">
        {/* Number */}
        <span className="text-mono text-xs text-primary/40 w-8 shrink-0 tabular-nums">
          {service.number}
        </span>

        {/* Title */}
        <h3 className="text-heading text-xl md:text-3xl lg:text-4xl text-foreground flex-1 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300">
          {service.title}
        </h3>

        {/* Description — hidden on mobile, shown md+ */}
        <p className="text-body text-muted-foreground text-sm hidden md:block md:w-64 lg:w-80 shrink-0">
          {service.description}
        </p>

        {/* Arrow — square to match design system */}
        <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>

      {/* Description — mobile only, below */}
      <p className="text-body text-muted-foreground text-xs pl-[52px] pr-14 pb-4 md:hidden leading-relaxed">
        {service.description}
      </p>
    </motion.div>
  )
}

export default function ServicesClient() {
  return (
    <BlueprintLayout>
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.span
            className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            What We Create
          </motion.span>
          <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
            Services
          </TextReveal>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
            From identity design to complete brand transformations — everything you need to stand out.
          </p>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-8 mt-10 pt-8 border-t border-border"
          >
            {[
              { value: '11', label: 'Services' },
              { value: '3', label: 'Disciplines' },
              { value: '∞', label: 'Custom scopes' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-heading text-2xl md:text-3xl text-foreground">{value}</span>
                <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionBoundary />

      {/* Services grouped */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {serviceGroups.map((group, gi) => (
            <div key={group.category} className={gi > 0 ? 'mt-14 md:mt-20' : ''}>
              {/* Category header */}
              <div className="flex items-center gap-4 mb-0 border-t border-border pt-4">
                <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60">
                  {group.category}
                </span>
                <span className="text-mono text-[10px] text-muted-foreground/30 ml-auto">
                  {group.label}
                </span>
              </div>

              {/* Rows */}
              {group.services.map((service, i) => (
                <ServiceRow key={service.number} service={service} index={gi * 4 + i} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <SectionBoundary />

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <p className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest mb-2">Ready to start?</p>
              <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                Want ongoing support? See our monthly retainer packages.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <ShineButton href="/get-started" size="md">Request a Quote</ShineButton>
              <ShineButton href="/pricing" size="md" variant="ghost">View Packages</ShineButton>
            </div>
          </motion.div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
