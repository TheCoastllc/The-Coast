'use client'

import Link from 'next/link'
import { Instagram, Linkedin } from 'lucide-react'

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

const footerLinks = [
  {
    group: 'Services',
    items: [
      { title: 'Brand Strategy', href: '/services#brand-strategy' },
      { title: 'Digital Design', href: '/services#digital-design' },
      { title: 'Development', href: '/services#development' },
      { title: 'Motion & Video', href: '/services#motion-video' },
    ],
  },
  {
    group: 'Company',
    items: [
      { title: 'About', href: '#about' },
      { title: 'Work', href: '#work' },
      { title: 'Blog', href: '/blog' },
      { title: 'Contact', href: '#contact' },
    ],
  },
  {
    group: 'Legal',
    items: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
    ],
  },
]

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/coastglobal', icon: Instagram },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thecoastcompanylimited/', icon: Linkedin },
  { name: 'X', href: 'https://x.com/TCoast13363', icon: null, customIcon: XIcon },
  { name: 'Pinterest', href: 'https://pin.it/nW5MRvKEz', icon: null, customIcon: PinterestIcon },
]

export default function FooterSection() {
  return (
    <footer style={{ backgroundColor: '#050505' }} className="pt-16 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top: Logo + Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Logo + tagline */}
          <div className="md:col-span-4">
            <Link href="/" className="block mb-4">
              <img
                src="/footerlogodark.png"
                alt="The Coast"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-body text-muted-foreground text-sm max-w-xs">
              Strategic brand design for entrepreneurs, artists, and growing businesses.
            </p>
          </div>

          {/* Link groups */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((group) => (
              <div key={group.group}>
                <span className="text-mono text-foreground/60 mb-4 block">{group.group}</span>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-body text-muted-foreground text-sm hover:text-[#C9A24B] transition-colors duration-200"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm text-body">
            &copy; {new Date().getFullYear()} The Coast. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            {socialLinks.map((link) => {
              const Icon = link.icon
              const CustomIcon = (link as { customIcon?: typeof XIcon }).customIcon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#C9A24B] transition-colors duration-200"
                  aria-label={link.name}
                >
                  {CustomIcon ? <CustomIcon size={18} /> : Icon ? <Icon size={18} /> : null}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
