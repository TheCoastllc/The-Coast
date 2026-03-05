'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    number: '01',
    title: 'Brand Strategy',
    description:
      "We define your brand's core identity, positioning, and messaging to create meaningful connections with your audience.",
  },
  {
    number: '02',
    title: 'Digital Design',
    description:
      'From websites to apps, we craft intuitive digital experiences that captivate users and drive results.',
  },
  {
    number: '03',
    title: 'Development',
    description:
      'We build scalable, performant digital products using cutting-edge technologies and best practices.',
  },
  {
    number: '04',
    title: 'Motion & Video',
    description:
      'Dynamic visual storytelling that brings brands to life through animation, video, and interactive media.',
  },
  {
    number: '05',
    title: 'Marketing Assets',
    description: 'Pitch decks, digital ads, and promotional materials that drive conversions.',
  },
]

const Services = () => {
  return (
    <section
      id="services"
      className="py-20 md:py-32 lg:py-48 relative"
      style={{ backgroundColor: '#050505' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-heading text-3xl md:text-5xl lg:text-6xl">What We Do</h2>
        </motion.div>

        {/* Services list */}
        <div className="border-t border-border">
          {services.map((service, index) => (
            <motion.a
              key={service.number}
              href="/services"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group border-b border-border py-6 md:py-8 lg:py-10 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer flex flex-col gap-3 md:flex-row md:items-center md:gap-8"
            >
              <span className="text-mono text-primary/70 text-sm md:w-12 shrink-0">
                {service.number}
              </span>

              <h3 className="text-heading text-2xl md:text-4xl lg:text-5xl text-foreground shrink-0 md:w-72 group-hover:translate-x-2 transition-transform duration-300">
                {service.title}
              </h3>

              <p className="text-body text-muted-foreground text-sm md:text-base flex-1 max-w-xl">
                {service.description}
              </p>

              <div className="flex items-center gap-2 text-mono text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300 shrink-0">
                <span className="hidden md:inline">Learn More</span>
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-border group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
