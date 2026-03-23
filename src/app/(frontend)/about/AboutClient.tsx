'use client'

import { motion } from 'motion/react'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { ArrowRight } from 'lucide-react'

const disciplines = [
  { number: '01', title: 'Brand Identity', description: 'Logo, colour, typography — the full visual system that makes you unmistakable.' },
  { number: '02', title: 'Collateral & Print', description: 'Flyers, pitch decks, press kits, and social assets that extend your brand into every touchpoint.' },
  { number: '03', title: 'Digital & Growth', description: 'Websites, video, SEO, and social management — presence that compounds over time.' },
]

const values = [
  { label: 'Clarity', body: 'We strip away noise and build brands that communicate in an instant.' },
  { label: 'Access', body: 'World-class design should not be gated behind enterprise budgets.' },
  { label: 'Impact', body: 'Every decision we make is measured against one question: does this move the needle?' },
  { label: 'Craft', body: 'Details are not optional. The difference between good and unforgettable is always in the details.' },
]

export default function AboutClient() {
  return (
    <BlueprintLayout>

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.span
            className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            About The Coast
          </motion.span>
          <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
            We Turn Visions Into Empires
          </TextReveal>
          <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
            A brand design studio built for the builders — entrepreneurs, founders, and creatives who refuse to be overlooked.
          </p>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-8 mt-10 pt-8 border-t border-border"
          >
            {[
              { value: '2022', label: 'Founded' },
              { value: '50+', label: 'Clients' },
              { value: '3', label: 'Disciplines' },
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

      {/* ─── The Story ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — anchor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-6">The Story</span>
              <p className="text-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                Invisible businesses don&apos;t survive.
              </p>
              <div className="mt-8 border-l-2 border-primary pl-6">
                <p className="text-body text-muted-foreground text-lg leading-relaxed">
                  &ldquo;Branding had been locked behind agency budgets most entrepreneurs can&apos;t touch. We changed that.&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Right — body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-5 text-body text-muted-foreground text-base md:text-lg leading-relaxed"
            >
              <p>Most small businesses don&apos;t fail because they lack talent or hustle.</p>
              <p><strong className="text-foreground">They fail because they&apos;re invisible.</strong></p>
              <p>
                In a crowded market, blending in is business suicide. But professional branding
                had been locked behind agency budgets most entrepreneurs couldn&apos;t touch.
              </p>
              <p>
                We believe every entrepreneur, every small business owner, every startup founder,
                every dreamer building something from scratch deserves a brand that commands
                attention and builds trust.
              </p>
              <p className="text-foreground font-medium">Not next year. Not when the budget allows. Now.</p>
            </motion.div>

          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* ─── Who We Are ────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-6">Who We Are</span>
              <p className="text-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                Built by builders, for builders.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-5 text-body text-muted-foreground text-base md:text-lg leading-relaxed"
            >
              <p>
                Founded by <strong className="text-foreground">David Coast</strong>, we&apos;re named after the idea
                of smooth sailing — navigating the choppy waters of business with clarity, creativity, and confidence.
                We&apos;ve been in the trenches. We&apos;ve built from side hustles. We know what it&apos;s like to
                compete against bigger players with deeper pockets.
              </p>
              <p>
                The Coast was built to level the playing field — to give small businesses, startups, and solo
                entrepreneurs the branding power that makes people stop, look, and remember.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* ─── What We Do ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 border-t border-border pt-4 mb-0">
            <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary">What We Do</span>
          </div>

          {disciplines.map((d, i) => (
            <motion.div
              key={d.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group relative border-b border-border"
            >
              <div className="absolute left-0 top-0 h-full w-[2px] bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
              <div className="flex items-center gap-4 md:gap-8 py-5 md:py-7 pl-5 md:pl-8 pr-4">
                <span className="text-mono text-xs text-primary/40 w-8 shrink-0 tabular-nums">{d.number}</span>
                <h3 className="text-heading text-xl md:text-3xl lg:text-4xl text-foreground flex-1 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300">
                  {d.title}
                </h3>
                <p className="text-body text-muted-foreground text-sm hidden md:block md:w-64 lg:w-80 shrink-0">
                  {d.description}
                </p>
                <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
              <p className="text-body text-muted-foreground text-xs pl-[52px] pr-14 pb-4 md:hidden leading-relaxed">
                {d.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionBoundary />

      {/* ─── Values ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-3">How We Operate</span>
            <p className="text-heading text-3xl md:text-4xl text-foreground max-w-lg">Four principles. No exceptions.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
            {values.map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="group p-8 bg-card relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 block mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-heading text-2xl text-foreground mb-3">{v.label}</h3>
                <p className="text-body text-muted-foreground text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* ─── Mission & Vision ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {[
              { label: 'Our Mission', body: 'To design the future — one brand at a time.' },
              { label: 'Our Vision', body: 'A world where every ambitious builder has a brand that matches their vision.' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-4">{item.label}</span>
                <p className="text-heading text-2xl md:text-3xl text-foreground leading-snug">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionBoundary />

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
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
              <p className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest mb-2">
                Ready to level up?
              </p>
              <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                Whether you&apos;re launching or rebranding — we&apos;re ready.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <ShineButton href="/get-started" size="md">Start a Project</ShineButton>
              <ShineButton href="/services" size="md" variant="ghost">View Services</ShineButton>
            </div>
          </motion.div>
        </div>
      </section>

    </BlueprintLayout>
  )
}
