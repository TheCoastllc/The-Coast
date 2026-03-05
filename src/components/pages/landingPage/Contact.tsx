'use client'

import { motion } from 'motion/react'
import { Instagram, Linkedin } from 'lucide-react'

const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const PinterestIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0a12 12 0 0 0-4.373 23.17c-.1-.937-.2-2.376.04-3.4.218-.926 1.407-5.965 1.407-5.965s-.36-.718-.36-1.78c0-1.667.967-2.912 2.17-2.912 1.023 0 1.518.77 1.518 1.69 0 1.03-.655 2.57-.993 3.995-.282 1.193.598 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.868-2.063-4.872-5.008-4.872-3.41 0-5.41 2.556-5.41 5.2 0 1.03.397 2.133.893 2.733a.36.36 0 0 1 .083.345c-.091.38-.293 1.193-.333 1.36-.052.22-.174.267-.4.16-1.499-.698-2.436-2.89-2.436-4.649 0-3.785 2.75-7.262 7.93-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146A12 12 0 1 0 12 0z" />
  </svg>
)

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/coastglobal', icon: Instagram },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/thecoastcompanylimited/',
    icon: Linkedin,
  },
  { name: 'X', href: 'https://x.com/TCoast13363', icon: null, customIcon: XIcon },
  { name: 'Pinterest', href: 'https://pin.it/nW5MRvKEz', icon: null, customIcon: PinterestIcon },
]

const Contact = () => {
  return (
    <section id="contact" className="py-32 md:py-48 relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-heading text-4xl md:text-6xl lg:text-7xl mb-4">Have a project?</h2>
            <h2 className="text-heading text-4xl md:text-6xl lg:text-7xl mb-12 gradient-text">
              {"Let's create magic."}
            </h2>
          </motion.div>

          {/* Email */}
          <motion.a
            href="mailto:hello@coastglobal.org"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block text-heading text-3xl md:text-5xl lg:text-6xl text-foreground hover:text-primary transition-colors duration-300 mb-16"
          >
            hello@coastglobal.org
          </motion.a>

          {/* Contact columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 md:gap-24 max-w-2xl mx-auto mb-16"
          >
            <div className="text-center">
              <h3 className="text-mono text-muted-foreground mb-3">New Business</h3>
              <a
                href="tel:+16827020374"
                className="text-body text-foreground text-lg hover:text-primary transition-colors duration-300"
              >
                +1 (682) 702-0374
              </a>
            </div>
            <div className="text-center">
              <h3 className="text-mono text-muted-foreground mb-3">General</h3>
              <a
                href="mailto:hello@coastglobal.org"
                className="text-body text-foreground text-lg hover:text-primary transition-colors duration-300"
              >
                hello@coastglobal.org
              </a>
            </div>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6"
          >
            {socialLinks.map((link) => {
              const Icon = link.icon
              const CustomIcon = (link as { customIcon?: typeof XIcon }).customIcon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label={link.name}
                >
                  {CustomIcon ? <CustomIcon size={24} /> : Icon ? <Icon size={24} /> : null}
                </a>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
