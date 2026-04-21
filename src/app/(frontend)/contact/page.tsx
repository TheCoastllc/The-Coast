import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react'
import { BlueprintLayout, SectionBoundary } from '@/components/blueprint-layout'
import TextReveal from '@/components/TextReveal'
import { ShineButton } from '@/components/ui/ShineButton'
import { FadeOnLoad, FadeOnScroll, SubtleLabel } from '../about/AboutPageAnimations'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact The Coast',
  description:
    'Get in touch with The Coast. Reach our brand studio by email, phone, or form — we respond to every inquiry within 24 hours on business days.',
  alternates: { canonical: 'https://coastglobal.org/contact' },
  openGraph: {
    title: 'Contact The Coast | Brand Design Studio',
    description:
      'Questions, partnerships, press, or projects — reach The Coast team directly. We reply within 24 hours.',
    url: 'https://coastglobal.org/contact',
  },
}

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://coastglobal.org/contact#webpage',
  url: 'https://coastglobal.org/contact',
  name: 'Contact The Coast',
  description:
    'Contact The Coast — a brand design studio for entrepreneurs, startups, and growing businesses. Email hello@coastglobal.org or submit the contact form.',
  isPartOf: { '@id': 'https://coastglobal.org/#website' },
  about: { '@id': 'https://coastglobal.org/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coastglobal.org' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://coastglobal.org/contact' },
    ],
  },
}

const contactPoints = [
  {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@coastglobal.org',
    telephone: '+1-682-702-0374',
    availableLanguage: ['English'],
    areaServed: 'Worldwide',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'hello@coastglobal.org',
    availableLanguage: ['English'],
    areaServed: 'Worldwide',
  },
]

const organizationContactSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://coastglobal.org/#organization',
  name: 'The Coast',
  url: 'https://coastglobal.org',
  email: 'hello@coastglobal.org',
  telephone: '+1-682-702-0374',
  contactPoint: contactPoints,
}

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@coastglobal.org',
    href: 'mailto:hello@coastglobal.org',
    note: 'Best for detailed briefs, files, and ongoing threads.',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (682) 702-0374',
    href: 'tel:+16827020374',
    note: 'Mon–Fri, 9am–6pm CT. Leave a message after hours.',
  },
  {
    icon: MessageCircle,
    label: 'Start a Project',
    value: 'Guided intake wizard',
    href: '/get-started',
    note: 'The fastest way to get a quote and timeline.',
  },
]

const inquiryTypes = [
  { title: 'New Projects & Quotes', body: 'Branding, websites, print, video, or growth work. Share scope and timing — we scope it together.' },
  { title: 'Existing Clients', body: 'Revisions, feedback, or account questions. Reply to your last email thread so we keep context in one place.' },
  { title: 'Partnerships & Press', body: 'Collaborations, podcast invites, interviews, and speaking opportunities welcome.' },
  { title: 'Careers & Freelance', body: 'We occasionally bring on freelance designers, developers, and writers. Send a portfolio and a short note.' },
]

const faqs = [
  {
    q: 'How fast do you reply?',
    a: 'We respond to every inquiry within one business day — usually the same day. Requests sent on weekends are picked up Monday morning CT.',
  },
  {
    q: 'Do you share pricing before a call?',
    a: 'Yes. Pricing is published on our pricing page and in the get-started wizard. Custom projects are quoted after the intake form.',
  },
  {
    q: 'Where is The Coast based?',
    a: 'We are a remote-first studio with a home base in the United States and clients worldwide. All collaboration happens async plus scheduled calls.',
  },
  {
    q: 'Can I send NDAs, RFPs, or procurement forms?',
    a: 'Absolutely. Email them to hello@coastglobal.org and reference the project. We will route them to the right person the same day.',
  },
]

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationContactSchema) }} />

      <BlueprintLayout>
        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <SubtleLabel className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest block mb-4">
              Contact
            </SubtleLabel>
            <TextReveal as="h1" className="text-heading text-4xl md:text-6xl lg:text-7xl mb-6">
              Let&apos;s Build Something Worth Noticing.
            </TextReveal>
            <p className="text-body text-muted-foreground text-lg md:text-xl max-w-2xl">
              Tell us what you&apos;re working on. Whether it&apos;s a new brand, a rebrand,
              or something we haven&apos;t named yet — we reply to every message within 24 hours.
            </p>

            <FadeOnLoad delay={0.3} className="flex flex-wrap items-center gap-6 md:gap-8 mt-10 pt-8 border-t border-border">
              {[
                { value: '24h', label: 'Reply Time' },
                { value: 'M–F', label: '9am–6pm CT' },
                { value: 'Global', label: 'Clients Worldwide' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-heading text-2xl md:text-3xl text-foreground">{value}</span>
                  <span className="text-mono text-xs text-muted-foreground/60 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </FadeOnLoad>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── Channels ──────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll className="mb-10">
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-3">Ways to Reach Us</span>
              <p className="text-heading text-3xl md:text-4xl text-foreground max-w-xl">
                Three doors. Pick the one that fits.
              </p>
            </FadeOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border">
              {channels.map((c, i) => {
                const Icon = c.icon
                const isExternal = c.href.startsWith('mailto:') || c.href.startsWith('tel:')
                return (
                  <FadeOnScroll key={c.label} delay={i * 0.06}>
                    <a
                      href={c.href}
                      {...(isExternal ? {} : { 'data-internal': 'true' })}
                      className="group block p-8 bg-card relative overflow-hidden h-full"
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      <Icon className="w-5 h-5 text-primary mb-4" strokeWidth={1.5} />
                      <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 block mb-2">
                        {String(i + 1).padStart(2, '0')} — {c.label}
                      </span>
                      <p className="text-heading text-xl md:text-2xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {c.value}
                      </p>
                      <p className="text-body text-muted-foreground text-sm leading-relaxed">{c.note}</p>
                    </a>
                  </FadeOnScroll>
                )
              })}
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── Form + Side Info ──────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left: Form (wider) */}
              <FadeOnScroll className="lg:col-span-3">
                <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-3">Send a Message</span>
                <h2 className="text-heading text-3xl md:text-4xl text-foreground mb-3">
                  The more we know, the better we answer.
                </h2>
                <p className="text-body text-muted-foreground text-sm md:text-base leading-relaxed mb-10 max-w-xl">
                  Fields marked with an asterisk are required. Everything else helps us route
                  your message and reply with useful specifics instead of generics.
                </p>
                <ContactClient />
              </FadeOnScroll>

              {/* Right: Side info */}
              <FadeOnScroll delay={0.15} className="lg:col-span-2 space-y-10">
                <div>
                  <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 block mb-3">Direct Line</span>
                  <a
                    href="mailto:hello@coastglobal.org"
                    className="text-heading text-xl md:text-2xl text-foreground hover:text-primary transition-colors block"
                  >
                    hello@coastglobal.org
                  </a>
                  <a
                    href="tel:+16827020374"
                    className="text-mono text-sm text-muted-foreground hover:text-foreground transition-colors block mt-2"
                  >
                    +1 (682) 702-0374
                  </a>
                </div>

                <div className="border-t border-border pt-8 space-y-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-1" strokeWidth={1.5} />
                    <div>
                      <p className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-1">Hours</p>
                      <p className="text-body text-foreground text-sm">Monday – Friday</p>
                      <p className="text-body text-muted-foreground text-sm">9:00 AM – 6:00 PM Central Time</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" strokeWidth={1.5} />
                    <div>
                      <p className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-1">Base</p>
                      <p className="text-body text-foreground text-sm">Remote-first studio</p>
                      <p className="text-body text-muted-foreground text-sm">United States · Serving clients worldwide</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-1" strokeWidth={1.5} />
                    <div>
                      <p className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-1">Pro Tip</p>
                      <p className="text-body text-muted-foreground text-sm leading-relaxed">
                        Ready for a quote? The{' '}
                        <a href="/get-started" className="text-foreground hover:text-primary underline underline-offset-4">
                          get-started wizard
                        </a>{' '}
                        gets you a tailored reply faster than a free-form message.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeOnScroll>
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── Who Should Write ──────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll className="mb-10">
              <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-3">Who Should Write In</span>
              <p className="text-heading text-3xl md:text-4xl text-foreground max-w-xl">
                Every inquiry lands with a real person.
              </p>
            </FadeOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
              {inquiryTypes.map((t, i) => (
                <FadeOnScroll key={t.title} delay={i * 0.06}>
                  <div className="group p-8 bg-card relative overflow-hidden h-full">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 block mb-3">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-heading text-xl md:text-2xl text-foreground mb-3">{t.title}</h3>
                    <p className="text-body text-muted-foreground text-sm leading-relaxed">{t.body}</p>
                  </div>
                </FadeOnScroll>
              ))}
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <FadeOnScroll>
                <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-primary block mb-6">Before You Write</span>
                <p className="text-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                  Quick answers to the things people ask first.
                </p>
                <p className="text-body text-muted-foreground text-base mt-6 max-w-md">
                  If your question isn&apos;t here, ask it anyway. We&apos;d rather answer twice than have you wondering.
                </p>
              </FadeOnScroll>

              <FadeOnScroll delay={0.1} className="space-y-6">
                {faqs.map((item) => (
                  <div key={item.q} className="border-l-2 border-border hover:border-primary transition-colors pl-5">
                    <p className="text-heading text-base md:text-lg text-foreground mb-2">{item.q}</p>
                    <p className="text-body text-muted-foreground text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </FadeOnScroll>
            </div>
          </div>
        </section>

        <SectionBoundary />

        {/* ─── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <FadeOnScroll className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="text-mono text-muted-foreground/40 text-xs uppercase tracking-widest mb-2">
                  Not sure where to start?
                </p>
                <p className="text-heading text-2xl md:text-4xl text-foreground max-w-md">
                  Run the wizard. We&apos;ll take it from there.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <ShineButton href="/get-started" size="md">Start a Project</ShineButton>
                <ShineButton href="/pricing" size="md" variant="ghost">See Pricing</ShineButton>
              </div>
            </FadeOnScroll>
          </div>
        </section>
      </BlueprintLayout>
    </>
  )
}
