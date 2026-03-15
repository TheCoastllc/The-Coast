'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'

export default function AboutClient() {
    return (
        <BlueprintLayout>
            {/* Hero Section */}
            <section className="pt-32 px-4 pb-16 md:pt-40 md:pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-mono text-muted-foreground/50 block mb-3 md:mb-4">About</span>
                        <TextReveal as="h1" className="text-display text-4xl md:text-6xl lg:text-7xl mb-6">
                            WE TURN VISIONS INTO EMPIRES
                        </TextReveal>
                        <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
                            Branding that makes small businesses unforgettable.
                        </p>
                    </motion.div>
                </div>
            </section>

            <SectionBoundary />

            {/* About The Coast */}
            <section className="py-20 px-4 md:py-32">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-mono text-primary mb-6 text-sm tracking-wider">ABOUT THE COAST</h2>
                        <h3 className="text-heading text-2xl md:text-3xl mb-8 text-foreground">
                            TURNING VISIONS INTO EMPIRES
                        </h3>

                        <div className="space-y-6 text-body text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
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
                </div>
            </section>

            <SectionBoundary />

            {/* Who We Are */}
            <section className="py-20 md:py-32 px-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-mono text-primary mb-6 text-sm tracking-wider">WHO WE ARE</h2>

                        <div className="space-y-6 text-body text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
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
                </div>
            </section>

            <SectionBoundary />

            {/* What We Do */}
            <section className="py-20 md:py-32 px-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-mono text-primary mb-6 text-sm tracking-wider">WHAT WE DO</h2>

                        <div className="space-y-6 text-body text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
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
                </div>
            </section>

            <SectionBoundary />

            {/* Mission & Vision */}
            <section className="py-20 md:py-32 px-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12"
                    >
                        <div className="border-l-2 border-primary pl-6 md:pl-8">
                            <h2 className="text-mono text-primary mb-4 text-sm tracking-wider">OUR MISSION</h2>
                            <p className="text-body text-muted-foreground text-base md:text-lg leading-relaxed">
                                To design the future
                            </p>
                        </div>

                        <div className="border-l-2 border-primary pl-6 md:pl-8">
                            <h2 className="text-mono text-primary mb-4 text-sm tracking-wider">OUR VISION</h2>
                            <p className="text-body text-muted-foreground text-base md:text-lg leading-relaxed">
                                To turn your vision into an empire.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <SectionBoundary />

            {/* Closing */}
            <section className="py-16 md:py-24 px-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <p className="text-body text-muted-foreground text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                            Whether you&apos;re opening your first coffee shop or an e-comm store, launching a
                            startup, or ready to rebrand and level up we&apos;re here to make your brand
                            unforgettable.
                        </p>
                        <p className="text-heading text-xl md:text-2xl text-foreground mb-8">
                            Welcome to The Coast.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/get-started"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-mono text-sm hover:bg-primary/90 transition-colors duration-300"
                            >
                                Start a Project
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-3 px-8 py-4 border border-border text-foreground rounded-full text-mono text-sm hover:border-primary hover:bg-primary/10 transition-all duration-300"
                            >
                                View Services
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </BlueprintLayout>
    )
}
