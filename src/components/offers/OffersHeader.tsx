'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const toolLinks = [
  { label: 'Quiz', href: '/brand-quiz' },
  { label: 'Checklist', href: '/brand-checklist' },
  { label: '3-Second Test', href: '/3-second-test' },
]

export function OffersHeader() {
  const pathname = usePathname()
  const activePath = pathname?.replace('/offers-tools', '') || ''

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0D1117]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-5">
        {/* Left: Logo + back link */}
        <a
          href="https://coastglobal.org"
          className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors text-sm"
        >
          <Image src="/logo.png" alt="The Coast" width={28} height={28} className="opacity-80" />
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-light tracking-wide">coastglobal.org</span>
        </a>

        {/* Center: Tool links */}
        <nav className="flex items-center gap-1">
          {toolLinks.map((link) => (
            <Link
              key={link.href}
              href={`/offers-tools${link.href}`}
              className={cn(
                'px-3 py-1.5 text-xs tracking-wide rounded-md transition-colors',
                activePath === link.href
                  ? 'text-[#C9A24B] bg-[#C9A24B]/10'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: CTA */}
        <a
          href="https://coastglobal.org/get-started"
          className="hidden sm:flex items-center text-xs text-[#C9A24B] hover:text-[#C9A24B]/80 transition-colors font-medium tracking-wide"
        >
          Free Brand Audit
        </a>
      </div>
    </header>
  )
}
