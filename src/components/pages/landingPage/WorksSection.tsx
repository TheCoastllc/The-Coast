'use client'

import { easeInOut, motion } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import { WORKS } from '@/constants'
import { ArrowUpRight } from 'lucide-react'

const headerVariants = {
    hidden: { opacity: 0, y: 80 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9,
            ease: easeInOut,
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 80 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9,
            delay: i % 2 !== 0 ? 0.2 : 0,
            ease: easeInOut,
        }
    })
}

const imageVariants = {
    hidden: { scale: 1.3, y: 40 },
    show: {
        scale: 1,
        y: 0,
        transition: {
            duration: 1.4,
            ease: easeInOut,
        }
    }
}

const WorksSection = () => {
    return (
        <section className="relative w-full py-32 bg-background overflow-hidden">
            <Container>

                {/* Header */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    className="flex items-end justify-between mb-24"
                >
                    <h2 className="leading-none max-w-sm ">
                        Selected Works
                    </h2>

                    <Button animate className="uppercase text-[10px] rounded-xs w-fit mb-1">
                        See all projects
                    </Button>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {WORKS.map((work, i) => (
                        <motion.div
                            key={work.title}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            className="group relative flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative w-full h-[450px] md:h-[600px] overflow-hidden rounded-3xl bg-muted">
                                <Image
                                    src={work.image}
                                    alt={work.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={i < 2}
                                />

                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                    style={{ backgroundColor: work.accentColor }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex items-center justify-between pt-8">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                                        Project {String(i + 1).padStart(2, '0')}
                                    </p>
                                    <h3 className="text-2xl font-medium tracking-tight">
                                        {work.title}
                                    </h3>
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex items-center justify-center w-14 h-14 rounded-full border border-border"
                                >
                                    <ArrowUpRight size={24} />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </Container>
        </section>
    )
}

export default WorksSection