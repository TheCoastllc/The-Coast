import { Facebook, Instagram, Linkedin } from 'lucide-react'

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

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/coastglobal', icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/coastglobal', icon: Instagram },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thecoastcompanylimited/', icon: Linkedin },
  { name: 'X', href: 'https://x.com/TCoast13363', icon: null, customIcon: XIcon },
  { name: 'Pinterest', href: 'https://pin.it/nW5MRvKEz', icon: null, customIcon: PinterestIcon },
]

export default function Footer() {
  return (
    <footer id="contact" className="py-20 md:py-32 lg:py-48 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Main CTA */}
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <span className="text-mono text-accent-cycle mb-3 md:mb-4 block">Get In Touch</span>
          <h2 className="text-heading text-3xl md:text-5xl lg:text-6xl xl:text-8xl mb-6 md:mb-8">
            {"Let's create something great together"}
          </h2>
          <a
            href="mailto:hello@coastglobal.org"
            title="Email The Coast Agency"
            className="group inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
          >
            <span className="text-display text-xl sm:text-2xl md:text-4xl lg:text-5xl text-accent-cycle group-hover:text-foreground transition-colors duration-300 break-all sm:break-normal">
              hello@coastglobal.org
            </span>
            <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary transition-all duration-300 shrink-0">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary group-hover:text-background -rotate-45 group-hover:rotate-0 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 md:pt-12 border-t border-border flex flex-col items-center md:flex-row md:justify-between gap-6 md:gap-8">
          <div className="flex flex-col items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
            <span className="text-heading text-lg md:text-xl">THE COAST</span>
            <span className="text-body text-accent-cycle italic text-sm md:text-base">
              Bring us a drop, we&apos;ll deliver the ocean.
            </span>
            <span className="text-body text-muted-foreground text-xs md:text-sm">
              © {new Date().getFullYear()} The Coast. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
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
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    aria-label={link.name}
                  >
                    {CustomIcon ? <CustomIcon size={20} /> : Icon ? <Icon size={20} /> : null}
                  </a>
                )
              })}
            </div>

            <div className="w-px h-6 bg-border/60" />

            <a
              href="/portal/login"
              title="Access the Client Portal"
              className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors duration-300"
            >
              Client Portal
            </a>

            <div className="w-px h-6 bg-border/60" />

            <a
              href="https://www.google.com/maps/place/?q=place_id:237714582837436261"
              target="_blank"
              rel="noopener noreferrer"
              title="Find us on Google Maps"
              className="flex items-center gap-2 text-white/40 hover:text-white/60 text-xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Find us on Google
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
