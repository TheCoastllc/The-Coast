'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react'

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const PinterestIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0a12 12 0 0 0-4.373 23.17c-.1-.937-.2-2.376.04-3.4.218-.926 1.407-5.965 1.407-5.965s-.36-.718-.36-1.78c0-1.667.967-2.912 2.17-2.912 1.023 0 1.518.77 1.518 1.69 0 1.03-.655 2.57-.993 3.995-.282 1.193.598 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.868-2.063-4.872-5.008-4.872-3.41 0-5.41 2.556-5.41 5.2 0 1.03.397 2.133.893 2.733a.36.36 0 0 1 .083.345c-.091.38-.293 1.193-.333 1.36-.052.22-.174.267-.4.16-1.499-.698-2.436-2.89-2.436-4.649 0-3.785 2.75-7.262 7.93-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146A12 12 0 1 0 12 0z" />
  </svg>
)

export default function FooterSection() {
  return (
    <footer className="bg-black pt-32 pb-12 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        {/* CTA */}
        <div className="flex flex-col items-center text-center mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter leading-none mb-12"
          >
            Let&apos;s <span className="text-primary">Create</span>
          </motion.h2>

          <motion.a
            href="/get-started"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative w-40 h-40 rounded-full border border-primary text-primary flex items-center justify-center text-sm font-display uppercase tracking-[0.2em] hover-target overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-300">
              Start
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-primary scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 ease-out z-0" />
          </motion.a>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-12 border-t border-white/10">
          <div className="md:col-span-2">
            <Link href="/">
              <h3 className="text-2xl font-display uppercase tracking-tight mb-6">The Coast.</h3>
            </Link>
            <p className="text-gray-400 max-w-sm font-light text-sm">
              Strategic brand design for entrepreneurs, artists, and growing businesses. We turn visions into empires.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Socials</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/coastglobal' },
                { name: 'X (Twitter)', href: 'https://x.com/TCoast13363' },
                { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thecoastcompanylimited/' },
                { name: 'Pinterest', href: 'https://pin.it/nW5MRvKEz' },
              ].map((social) => (
                <li key={social.name}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover-target inline-flex items-center gap-1 group">
                    {social.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a href="mailto:hello@coastglobal.org" className="hover:text-white transition-colors hover-target">
                  hello@coastglobal.org
                </a>
              </li>
              <li>
                <a href="tel:+16827020374" className="hover:text-white transition-colors hover-target">
                  +1 (682) 702-0374
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-24 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 uppercase tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} The Coast. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors hover-target">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors hover-target">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
