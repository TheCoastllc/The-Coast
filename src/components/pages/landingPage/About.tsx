'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Building2, Sparkles } from 'lucide-react'

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 lg:py-48 relative bg-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Hero Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-display text-3xl md:text-5xl lg:text-6xl mb-6 text-foreground">
            WE TURN VISIONS INTO EMPIRES
          </h2>
          <p className="text-body text-muted-foreground text-lg md:text-xl">
            Branding that makes small businesses unforgettable.
          </p>
        </motion.div>

        {/* About The Coast */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h3 className="text-mono text-primary mb-6 text-sm tracking-wider">ABOUT THE COAST</h3>
          <h4 className="text-heading text-2xl md:text-3xl mb-8 text-foreground">
            TURNING VISIONS INTO EMPIRES
          </h4>

          <div className="space-y-6 text-body text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>Most small businesses don&apos;t fail because they lack talent or hustle.</p>
            <p>
              <strong className="text-foreground">They fail because they&apos;re invisible.</strong>
            </p>
            <p>
              In a crowded market, blending in is business suicide. But professional branding?
              That&apos;s been locked behind agency budgets most entrepreneurs can&apos;t touch.
            </p>
            <p>
              <strong className="text-foreground">We changed that.</strong>
            </p>
            <p>
              We believe every entrepreneur, every small business owner, every startup founder,
              every dreamer building something from scratch deserves a brand that commands attention
              and builds trust.
            </p>
            <p>Not next year. Not when the budget allows. Now.</p>
            <p>
              <strong className="text-foreground">That&apos;s where The Coast comes in.</strong>
            </p>
          </div>
        </motion.div>

        {/* Who We Are */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h3 className="text-mono text-primary mb-6 text-sm tracking-wider">WHO WE ARE</h3>

          <div className="space-y-6 text-body text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              Founded by <strong className="text-foreground">David Coast</strong>, we&apos;re named
              after the idea of smooth sailing—navigating the choppy waters of business with
              clarity, creativity, and confidence. We&apos;ve been in the trenches. We&apos;ve
              built from side hustles. We know what it&apos;s like to compete against bigger players
              with deeper pockets.
            </p>
            <p>
              The Coast was built to level the playing field to give small businesses, startups, and
              solo entrepreneurs the branding power that makes people stop, look, and remember.
            </p>
          </div>
        </motion.div>

        {/* What We Do */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h3 className="text-mono text-primary mb-6 text-sm tracking-wider">WHAT WE DO</h3>

          <div className="space-y-6 text-body text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              We craft custom branding solutions that make small businesses look and feel like they
              belong in the big leagues:
            </p>

            <ul className="space-y-4 pl-0">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Custom Branding & Logo Design</strong>: Your
                  visual identity, refined and unforgettable.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Marketing Collateral</strong>: Flyers, social
                  graphics, and digital assets that convert.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Web Design & Digital Marketing</strong>:
                  Websites, SEO, and campaigns that drive real growth.
                </span>
              </li>
            </ul>

            <p>
              <strong className="text-foreground">
                Beautiful design meets real strategy. Affordability meets impact.
              </strong>
            </p>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 md:mb-20"
        >
          <div className="border-l-2 border-primary pl-6 md:pl-8">
            <h3 className="text-mono text-primary mb-4 text-sm tracking-wider">OUR MISSION</h3>
            <p className="text-body text-muted-foreground text-base md:text-lg leading-relaxed">
              To design the future
            </p>
          </div>

          <div className="border-l-2 border-primary pl-6 md:pl-8">
            <h3 className="text-mono text-primary mb-4 text-sm tracking-wider">OUR VISION</h3>
            <p className="text-body text-muted-foreground text-base md:text-lg leading-relaxed">
              To turn your vision into an empire.
            </p>
          </div>
        </motion.div>

        {/* Coast HQ Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h3 className="text-mono text-primary mb-6 text-sm tracking-wider">OUR VISION</h3>
          <div className="relative rounded-2xl overflow-hidden ring-2 ring-primary/30 group cursor-pointer">
            <img
              src="/images/Coast_HQ_nightglowing_beside-0.jpg"
              alt="The Coast HQ conceptual rendering, night view"
              className="w-full h-[300px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Conceptual Vision</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h4 className="text-heading text-2xl md:text-3xl text-foreground mb-2">
                The Coast HQ Concepts
              </h4>
              <p className="text-body text-foreground/70 text-sm md:text-base mb-4">
                Architecture & Vision, 2026
              </p>
              <Link
                href="/vision"
                title="View detailed HQ Vision and Concept"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group/link"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-body font-medium">Explore full concept →</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-body text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
            Whether you&apos;re opening your first coffee shop or an e-comm store, launching a
            startup, or ready to rebrand and level up we&apos;re here to make your brand
            unforgettable.
          </p>
          <p className="text-heading text-xl md:text-2xl text-foreground mb-8">
            Welcome to The Coast.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default About
