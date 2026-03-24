import { BlueprintLayout } from '@/components/blueprint-layout'
import { TransitionLink } from '@/components/PageTransition'
import { ShineButton } from '@/components/ui/ShineButton'
import { RetroGrid } from '@/components/RetroGrid'

const links = [
  { label: 'Services', href: '/services', desc: 'Explore what we offer' },
  { label: 'Our Work', href: '/work', desc: 'See the portfolio' },
  { label: 'About', href: '/about', desc: 'Learn who we are' },
  { label: 'Blog', href: '/blog', desc: 'Read the journal' },
]

export default function NotFound() {
  return (
    <BlueprintLayout>
      <section className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Background */}
        <RetroGrid
          angle={65}
          cellSize={50}
          opacity={0.08}
          darkLineColor="oklch(0.72 0.12 75 / 0.4)"
        />

        {/* Radial glow behind 404 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 50% 45%, oklch(0.72 0.12 75 / 0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="max-w-6xl mx-auto w-full px-6 md:px-12">
            {/* Meta label */}
            <span className="text-mono text-[10px] tracking-[0.3em] text-primary/60 block mb-5">
              Page Not Found
            </span>

            {/* Giant 404 */}
            <div className="relative mb-1 select-none" aria-hidden="true">
              <span
                className="text-outline block font-display leading-[0.82] tracking-tighter"
                style={{ fontSize: 'clamp(5rem, 2rem + 14vw, 14rem)' }}
              >
                404
              </span>
              <div className="mt-2 h-[2px] w-20 bg-primary/60" />
            </div>

            {/* Headline + body */}
            <div className="mt-8 max-w-xl">
              <h1 className="text-heading text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
                This page doesn&apos;t exist.
              </h1>
              <p className="text-body text-muted-foreground text-sm md:text-base leading-relaxed">
                Whatever you were looking for has moved, been removed, or never existed. Pick back
                up from one of these.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ShineButton href="/" size="sm">
                Back to Home
              </ShineButton>
              <ShineButton href="/#contact" size="sm" variant="ghost">
                Get in Touch
              </ShineButton>
            </div>

            {/* Quick links — inline grid, same section */}
            <div className="mt-12 pt-8 border-t border-border/40">
              <span className="text-mono text-[10px] tracking-[0.2em] text-primary/50 block mb-5">
                Quick Links
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {links.map((link, i) => (
                  <TransitionLink
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col gap-2 border border-border/30 bg-card/30 p-4 md:p-5 transition-colors duration-300 hover:border-primary/30 hover:bg-muted/20"
                  >
                    <span className="text-mono text-[10px] text-muted-foreground/20 group-hover:text-primary/50 transition-colors duration-300">
                      0{i + 1}
                    </span>
                    <span className="text-heading text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-300">
                      {link.label}
                    </span>
                    <span className="text-body text-[11px] text-muted-foreground/40 leading-snug">
                      {link.desc}
                    </span>
                  </TransitionLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlueprintLayout>
  )
}
