'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Instagram, Linkedin } from 'lucide-react'

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const PinterestIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0a12 12 0 0 0-4.373 23.17c-.1-.937-.2-2.376.04-3.4.218-.926 1.407-5.965 1.407-5.965s-.36-.718-.36-1.78c0-1.667.967-2.912 2.17-2.912 1.023 0 1.518.77 1.518 1.69 0 1.03-.655 2.57-.993 3.995-.282 1.193.598 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.868-2.063-4.872-5.008-4.872-3.41 0-5.41 2.556-5.41 5.2 0 1.03.397 2.133.893 2.733a.36.36 0 0 1 .083.345c-.091.38-.293 1.193-.333 1.36-.052.22-.174.267-.4.16-1.499-.698-2.436-2.89-2.436-4.649 0-3.785 2.75-7.262 7.93-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146A12 12 0 1 0 12 0z" />
  </svg>
)

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { number: '01', title: 'We Create Digital Experiences', href: '#hero', isRoute: false, seoTitle: 'The Coast - Digital Experience Creators' },
  { number: '02', title: 'Client Origins', href: '/work', isRoute: true, seoTitle: 'Brand Design Portfolio & Stories' },
  { number: '03', title: 'Portfolio & Social Proof', href: '/portfolio', isRoute: true, seoTitle: 'Social Proof & Portfolio Showcase' },
  { number: '04', title: 'What We Do', href: '#services', isRoute: false, seoTitle: 'Brand Design Services & Pricing' },
  { number: '05', title: 'Journal', href: '/blog', isRoute: true, seoTitle: 'Brand Design Journal & Insights' },
  { number: '06', title: 'About Us', href: '#about', isRoute: false, seoTitle: 'About The Coast Agency' },
  { number: '07', title: "Let's Talk", href: '#contact', isRoute: false, seoTitle: 'Get in Touch with The Coast' },
]

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/coastglobal', icon: Instagram },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thecoastcompanylimited/', icon: Linkedin },
  { name: 'X', href: 'https://x.com/TCoast13363', icon: null, customIcon: XIcon },
  { name: 'Pinterest', href: 'https://pin.it/nW5MRvKEz', icon: null, customIcon: PinterestIcon },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const handleLinkClick = (href: string, isRoute: boolean) => {
    onClose()
    if (isRoute) {
      window.location.href = href
    } else {
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto"
          style={{ backgroundColor: 'rgba(10, 10, 10, 0.98)' }}
        >
          {/* Main navigation */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 pt-20 pb-8">
            <nav className="space-y-1 sm:space-y-2 md:space-y-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.number}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  onClick={() => handleLinkClick(item.href, item.isRoute)}
                  title={item.seoTitle}
                  className="group flex items-start gap-3 sm:gap-4 md:gap-8 w-full text-left py-1.5 sm:py-2 md:py-3"
                >
                  <span className="text-mono text-muted-foreground/60 text-xs sm:text-sm mt-1 sm:mt-2 md:mt-4">
                    {item.number}
                  </span>
                  <span className="text-heading text-xl sm:text-2xl md:text-5xl lg:text-7xl text-foreground group-hover:text-[#C9A24B] group-hover:translate-x-2 md:group-hover:translate-x-4 transition-all duration-300 leading-tight">
                    {item.title}
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="px-4 sm:px-6 md:px-12 lg:px-24 py-6 md:py-8 border-t border-border"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
              {/* Contact */}
              <div className="text-center md:text-left">
                <span className="text-mono text-muted-foreground text-xs block mb-1 md:mb-2">Get in Touch</span>
                <a
                  href="mailto:hello@coastglobal.org"
                  title="Email The Coast Agency"
                  className="text-body text-foreground text-sm md:text-lg hover:text-primary transition-colors duration-300"
                >
                  hello@coastglobal.org
                </a>
              </div>

              {/* Social links and Client Portal */}
              <div className="flex items-center justify-center md:justify-end gap-4 md:gap-6">
                <div className="flex items-center gap-4">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    const CustomIcon = (link as { customIcon?: typeof XIcon }).customIcon
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        title={`${link.name} Profile for The Coast`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-[#C9A24B] transition-colors duration-300"
                        aria-label={link.name}
                      >
                        {CustomIcon ? <CustomIcon size={18} /> : Icon ? <Icon size={18} /> : null}
                      </a>
                    )
                  })}
                </div>

                <div className="w-px h-5 bg-border/60" />

                <a
                  href="/portal/login"
                  title="Access the Client Portal"
                  onClick={onClose}
                  className="text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-300"
                >
                  Client Portal
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
