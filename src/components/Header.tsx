'use client'

import { motion, useScroll, useSpring } from 'motion/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import MobileMenu from './MobileMenu'
import Link from 'next/link'
import { ShineButton } from './ui/ShineButton'

const navItems = [
  { label: 'Work', href: '#work', title: 'Brand Design Portfolio' },
  { label: 'Services', href: '#services', title: 'Brand Design Services' },
  { label: 'About', href: '#about', title: 'About The Coast Agency' },
  { label: 'Contact', href: '#contact', title: 'Get in Touch with The Coast' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className={`fixed top-0 left-0 right-0 px-6 py-4 ${menuOpen ? 'z-50' : 'z-40 mix-blend-difference'}`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" title="The Coast - Home" className="flex items-center hover-target">
            <Image
              src="/logo.png"
              alt="The Coast Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-white">
            {navItems.map((item) => (
              <Link
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
                className="hover:text-primary transition-colors hover-target"
              >
                {item.label}
              </Link>
            ))}
            <ShineButton size='sm'>
              <Link href="/get-started" className=" font-mono ">
                Start Project
              </Link>
            </ShineButton>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-white hover-target"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
                transition={{ duration: 0.3 }}
                className="block w-full h-0.5 bg-white origin-center"
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="block w-full h-0.5 bg-white"
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
                transition={{ duration: 0.3 }}
                className="block w-full h-0.5 bg-white origin-center"
              />
            </div>
          </button>
        </div>
      </motion.nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
