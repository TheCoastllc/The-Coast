'use client'

import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import MobileMenu from './MobileMenu'

const navItems = [
  { label: 'Work', href: '/work', isRoute: true, title: 'Brand Design Portfolio' },
  { label: 'Portfolio', href: '/portfolio', isRoute: true, title: 'Social Proof & Portfolio' },
  { label: 'Services', href: '/services', isRoute: true, title: 'Brand Design Services & Pricing' },
  { label: 'Pricing', href: '/pricing', isRoute: true, title: 'Monthly Retainer Packages' },
  { label: 'Blog', href: '/blog', isRoute: true, title: 'Brand Design Journal & Insights' },
  { label: 'About', href: '#about', title: 'About The Coast Agency' },
  { label: 'Contact', href: '#contact', title: 'Get in Touch with The Coast' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled && !menuOpen ? 'bg-background/90 backdrop-blur-md border-b border-border' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <a href="/" title="The Coast - Home" className="flex items-center">
            <Image
              src="/coast-logo.png"
              alt="The Coast Logo"
              width={140}
              height={48}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                title={item.title}
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault()
                    const el = document.querySelector(item.href)
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="text-mono text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop CTA */}
            <a
              href="/get-started"
              title="Start Your Brand Design Project"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-foreground text-background text-mono text-xs font-medium rounded-lg hover:bg-foreground/90 transition-all duration-300"
            >
              Get Started
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-50 w-10 h-10 flex items-center justify-center"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="block w-full h-0.5 bg-foreground origin-center"
                />
                <motion.span
                  animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="block w-full h-0.5 bg-foreground"
                />
                <motion.span
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="block w-full h-0.5 bg-foreground origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
