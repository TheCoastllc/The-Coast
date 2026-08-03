'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { CALENDLY_URL, calendlyUrl, trackCTA, type CtaLocation } from './funnel-track'
import { CAPACITY } from './capacity'
import { STATS } from '@/lib/content/coast'
import { TRUSTED_BRANDS_FALLBACK } from '@/lib/trusted-brands-fallback'
import { TrustedBy } from '@/components/home/TrustedBy'

/** Live Google rating passed down from the server component (null if the fetch failed). */
export type FunnelProof = { average: number; count: number } | null

/** Hero backdrop + statement tone. mood 'light' = ink text (bright skies),
 *  'dark' = cream text (moody skies). Swap src/mood together. */
const HERO = { src: '/ai/hero-shore.jpg', mood: 'dark' } as const

/**
 * /ai conversion funnel - faithful recreation of Coast_AI_Landing_Page.html.
 * All copy is verbatim from the source file. CTAs carry utm passthrough onto
 * Calendly (hydrated after mount so plain anchors work with or without JS) and
 * fire trackCTA on click.
 */

function CtaLink({
  location,
  className,
  children,
}: {
  location: CtaLocation
  className: string
  children: ReactNode
}) {
  // Hydrate the href with utm passthrough once mounted; the bare Calendly URL is
  // the no-JS / pre-hydration fallback, so cmd-click and middle-click also work.
  const [href, setHref] = useState(CALENDLY_URL)
  useEffect(() => {
    setHref(calendlyUrl())
  }, [])
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCTA(location)}
    >
      {children}
    </a>
  )
}

export function AiFunnelClient({ proof }: { proof: FunnelProof }) {
  // Scroll reveal - same IntersectionObserver behavior as the source page.
  // funnel.css forces .reveal visible under prefers-reduced-motion.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // SKAI-style first screen: the sticky sand nav stays hidden while the framed
  // hero is on screen, then slides down for the rest of the scroll.
  const [navVisible, setNavVisible] = useState(false)
  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <nav className="fnav" aria-label="Primary" data-visible={navVisible || undefined}>
        <div className="nav-in">
          <span className="nav-lockup">
            <Image
              className="nav-logo"
              src="/logolight.png"
              alt="The Coast Global"
              width={364}
              height={280}
              priority
            />
            <span className="nav-word">The Coast Global</span>
          </span>
          <CtaLink location="nav" className="btn btn-cta">
            Book a Strategy Session
          </CtaLink>
        </div>
      </nav>

      <header className="hero" data-mood={HERO.mood}>
        {/* golden-hour beach, full viewport (SKAI-style framed hero). data-mood
            flips the statement tones: 'light' = ink text on bright skies,
            'dark' = cream text on moody skies. */}
        <Image
          className="hero-photo"
          src={HERO.src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          quality={82}
        />
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-chrome">
          <a className="chrome-pill" href="mailto:hello@coastglobal.org">
            Contact us
          </a>
          <span className="chrome-brand">
            <Image src="/logolight.png" alt="" aria-hidden width={364} height={280} />
            <span>The Coast Global</span>
          </span>
          <CtaLink location="nav" className="chrome-pill chrome-cta">
            Book a Strategy Session
          </CtaLink>
        </div>
        <div className="drop" aria-hidden="true" />
        <div className="hero-center">
          <span className="eyebrow mono">AI Consulting &amp; Implementation</span>
          <h1>
            Put AI to work
            <br />
            in your <span className="accent">business.</span>
          </h1>
          <p className="hero-sub">
            {"We design, build, and deploy AI systems that give your team back 10+ hours a week and make sure no lead ever slips."}
          </p>
          <div className="cta-row">
            <CtaLink location="hero" className="btn btn-cta btn-big">
              Book Your AI Strategy Session
            </CtaLink>
          </div>
          <p className="cta-note">
            30 minutes {'•'} No obligation {'•'} You leave with a plan
          </p>
          <div className="scarcity">
            We take on {CAPACITY.buildsPerMonth} builds per month. {CAPACITY.spotsRemaining} spots
            remaining for {CAPACITY.month}.
          </div>
        </div>
        <div className="scroll-cue mono" aria-hidden="true">
          Scroll for more
          <span className="scroll-tick" />
        </div>
      </header>

      <section className="intro">
        <div className="wrap center">
          <p className="sub">
            {'From "we should use AI" to real, working systems. The Coast Global designs, builds, and deploys AI for founders and growth-stage teams.'}
          </p>
          <div className="proof-strip">
            {proof && (
              <div className="proof-item">
                <span className="proof-value">
                  {proof.average.toFixed(1)}
                  <span className="star"> ★</span>
                </span>
                <span className="proof-label">Google rating {'·'} {proof.count} reviews</span>
              </div>
            )}
            <div className="proof-item">
              <span className="proof-value">{STATS[0].value}</span>
              <span className="proof-label">{STATS[0].label}</span>
            </div>
            <div className="proof-item">
              <span className="proof-value">{STATS[2].value}</span>
              <span className="proof-label">{STATS[2].label}</span>
            </div>
          </div>
          <div className="badge-strip">
            <span>A launch Preferred partner in the Claude Partner Network Services Track</span>
            <Image
              src="/ai/claude-preferred-badge.png"
              alt="Preferred Services Partner, Claude Partner Network"
              width={520}
              height={164}
              unoptimized
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="problems">
        <div className="wrap center">
          <span className="eyebrow mono reveal">Sound familiar?</span>
          <h2 className="reveal">{"You're not behind because you don't care."}</h2>
          <p className="lead reveal">
            {"You're stuck because everyone's selling tools and nobody's giving you a plan."}
          </p>
          <div className="cards">
            <div className="card reveal">
              <p className="q">{'"We know we should use AI... we just don\'t know where to start."'}</p>
              <p>
                The hype is loud, the options are endless, and the first move is never obvious. So
                nothing moves.
              </p>
            </div>
            <div className="card reveal">
              <p className="q">{'"We tried some AI tools. Nothing actually changed."'}</p>
              <p>
                {"Buying ChatGPT seats isn't a strategy. Tools bolted on the side don't move the numbers that matter."}
              </p>
            </div>
            <div className="card reveal">
              <p className="q">{'"Our competitors are moving faster than we are."'}</p>
              <p>
                {"The businesses pulling ahead aren't smarter. They found a partner who had already done the work."}
              </p>
            </div>
          </div>
          <p className="stakes reveal">
            {"Every quarter you wait is another quarter of hours your team never gets back, and leads you never knew you lost. "}
            <b>The cost of doing nothing is not zero.</b>
          </p>
        </div>
      </section>

      <section className="trusted" id="trusted">
        <div className="wrap center">
          <span className="eyebrow mono reveal">Trusted by</span>
          <div className="reveal">
            <TrustedBy clients={TRUSTED_BRANDS_FALLBACK} variant="marquee" />
          </div>
        </div>
      </section>

      <section id="who">
        <div className="wrap center">
          <span className="eyebrow mono reveal">Who this is for</span>
          <h2 className="reveal">Built for the people doing the work.</h2>
          <div className="cards">
            <div className="card reveal">
              <p className="persona-name">The Founder</p>
              <p>
                {"You're building fast and wearing every hat. AI should be leverage you own, not another tool to babysit."}
              </p>
            </div>
            <div className="card reveal">
              <p className="persona-name">The Operator</p>
              <p>
                {"You run the day-to-day. The repetitive work is eating your team's week, and you can feel it."}
              </p>
            </div>
            <div className="card reveal">
              <p className="persona-name">The Growing Team</p>
              <p>
                {"Leads slip, follow-ups lag, data sits unused. You're ready for systems that scale with you."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sol" id="solutions">
        <div className="wrap center">
          <span className="eyebrow mono reveal">What we build</span>
          <h2 className="reveal">AI woven into how your business actually runs.</h2>
          <p className="lead reveal">
            Not bolted on the side. Built into operations, where it changes outcomes.
          </p>
          <div className="cards">
            <div className="card reveal">
              <span className="tag mono">Win back your time</span>
              <p className="h">Get 10+ hours a week back.</p>
              <p>
                AI systems that handle the repetitive work your team is drowning in, so you focus on
                what grows the business.
              </p>
            </div>
            <div className="card reveal">
              <span className="tag mono">Stop the leaks</span>
              <p className="h">Never lose a lead again.</p>
              <p>
                AI that captures, responds to, and qualifies every lead instantly, around the clock.
                Nothing slips through after hours.
              </p>
            </div>
            <div className="card reveal">
              <span className="tag mono">Data to decisions</span>
              <p className="h">{"Know exactly what's working."}</p>
              <p>
                We turn your scattered data into clear, AI-driven decisions, so you always know your
                next move.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap center">
          <span className="eyebrow mono reveal">How it works</span>
          <h2 className="reveal">Three steps from idea to working system.</h2>
          <div className="steps">
            <div className="step reveal">
              <span className="num">STEP 01</span>
              <span className="svc">AI Consultation</span>
              <p className="h">The Strategy Session</p>
              <p>
                A focused working session where we map the three highest-impact places AI can work in
                your business and define what a build would look like. This is where every engagement
                starts.
              </p>
            </div>
            <div className="step reveal">
              <span className="num">STEP 02</span>
              <span className="svc">AI Blueprint</span>
              <p className="h">The Blueprint</p>
              <p>
                A deep diagnostic and a documented roadmap you can act on, with clear priorities and
                scope. Credits toward your build if you proceed.
              </p>
            </div>
            <div className="step reveal">
              <span className="num">STEP 03</span>
              <span className="svc">AI Implementation</span>
              <p className="h">The Build</p>
              <p>
                We design, build, and deploy the systems, then make sure they hold up under real
                operating conditions. Done for you, working in production.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust" id="why">
        <div className="wrap">
          <div className="center">
            <span className="eyebrow mono reveal">Why The Coast Global</span>
            <h2 className="reveal">We built until we were ready.</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-badge reveal">
              <Image
                src="/ai/claude-preferred-badge.png"
                alt="Preferred Services Partner, Claude Partner Network"
                width={520}
                height={164}
                unoptimized
              />
              <p className="line">
                The Coast LLC is a launch Preferred partner in the Claude Partner Network Services
                Track.
              </p>
            </div>
            <div className="founder-wrap reveal">
              <div className="founder-photo">
                <Image
                  src="/founder.jpg"
                  alt="David Coast, Founder & CEO of The Coast Global"
                  fill
                  sizes="168px"
                  loading="lazy"
                />
              </div>
              <div className="quote">
                <p className="q">
                  {'"We didn\'t set out to earn a partnership. We set out to solve a real problem for the founders and small businesses who trusted us, and we built until we were ready."'}
                </p>
                <p className="who">David Coast {'•'} Founder &amp; CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="wrap center">
          <span className="eyebrow mono reveal">Ways to work with us</span>
          <h2 className="reveal">{"Start where you are. Scale when you're ready."}</h2>
          <div className="tiers">
            <div className="tier reveal">
              <p className="t-name">AI Consultation + Blueprint</p>
              <p className="t-price">
                $1,500<small> starting</small>
              </p>
              <ul>
                <li>A focused strategy session that maps your highest-leverage AI moves</li>
                <li>Deep AI diagnostic of your business</li>
                <li>Your top three AI opportunities, ranked by impact and effort</li>
                <li>Documented, prioritized roadmap with clear scope</li>
                <li>Build-vs-buy guidance on every tool, so you stop paying for the wrong ones</li>
                <li>Projected time savings on each recommendation</li>
                <li>Yours to keep and act on, with us or without us</li>
                <li>Every dollar credits toward your build</li>
              </ul>
              <CtaLink location="pricing_blueprint" className="btn btn-cta">
                Book a Strategy Session
              </CtaLink>
            </div>
            <div className="tier reveal">
              <p className="t-name">AI Strategy &amp; Advisory</p>
              <p className="t-price">
                $2,500<small>/month</small>
              </p>
              <ul>
                <li>A monthly working session with your team</li>
                <li>Ongoing roadmap and prioritization as the business changes</li>
                <li>Direct strategic guidance</li>
                <li>Vendor and tooling decisions, handled</li>
                <li>Direct access between sessions, not a ticket queue</li>
                <li>New AI opportunities flagged as they surface</li>
                <li>A quarterly review of what shipped and what it returned</li>
                <li>A partner in the room every month</li>
                <li>No long-term contract</li>
              </ul>
              <CtaLink location="pricing_advisory" className="btn btn-cta">
                Book a Strategy Session
              </CtaLink>
            </div>
            <div className="tier feat reveal">
              <span className="pop">MOST POPULAR</span>
              <p className="t-name">AI Implementation</p>
              <p className="t-price">
                $5,000<small>+ per build</small>
              </p>
              <ul>
                <li>We design, build, and deploy</li>
                <li>AI systems in real production</li>
                <li>Integrated into the tools you already use</li>
                <li>Fixed scope and price, agreed before we start</li>
                <li>Working increments you see early, not months of silence</li>
                <li>Team training and clean handoff</li>
                <li>30 days of post-launch support included</li>
                <li>You own everything we build, source and all</li>
                <li>Built to hold up, not to demo</li>
              </ul>
              <CtaLink location="pricing_build" className="btn btn-cta">
                Book a Strategy Session
              </CtaLink>
            </div>
          </div>
          <div className="tier-custom reveal">
            <div className="tier-custom-head">
              <p className="t-name">AI Custom Solutions</p>
              <p className="t-price t-price-custom">Custom quote</p>
            </div>
            <ul>
              <li>For operations that need what does not exist yet</li>
              <li>Bespoke systems designed around your stack</li>
              <li>Integrations, data, and workflows built to spec</li>
              <li>A dedicated build team and a named point of contact</li>
              <li>You own the source, the data, and the systems</li>
              <li>Scoped and priced around outcomes</li>
            </ul>
            <CtaLink location="pricing_custom" className="btn btn-cta">
              Book a Strategy Session
            </CtaLink>
          </div>
          <p className="audit-note reveal">
            Every engagement starts with <b>a Strategy Session.</b> Blueprint dollars credit toward
            your build. We only take on work we know we can deliver, so the first conversation is
            about fit, scope, and what your build actually looks like.
          </p>
        </div>
      </section>

      <section id="faq" style={{ paddingTop: 40 }}>
        <div className="wrap center">
          <span className="eyebrow mono reveal">Questions</span>
          <h2 className="reveal">Answered before you ask.</h2>
          <div className="faq-list">
            <details className="reveal">
              <summary>What happens in the Strategy Session?</summary>
              <div className="a">
                {"It's a working session, not a pitch. We look at how your business runs today, map the highest-impact places AI can create leverage, and define what a build would look like: scope, priorities, and a clear next step. You leave knowing exactly what we would build and why."}
              </div>
            </details>
            <details className="reveal">
              <summary>{"We're not technical. Is that a problem?"}</summary>
              <div className="a">
                {"Not at all, that's exactly who we built this for. You don't need to know the technology. You need to know your business. We handle the rest, and everything we deliver comes with training and a clean handoff."}
              </div>
            </details>
            <details className="reveal">
              <summary>How is this different from just buying AI tools?</summary>
              <div className="a">
                {"Tools sit on the side of your business. Systems live inside it. We don't hand you another subscription, we design and build AI into how you already operate: your leads, your workflows, your data, your follow-up. That's where results come from."}
              </div>
            </details>
            <details className="reveal">
              <summary>How fast do we see something working?</summary>
              <div className="a">
                The Strategy Session gives you clarity immediately. A Blueprint typically lands
                within two weeks. Build timelines depend on scope, but we build in working
                increments, so you see systems running early, not after months of silence.
              </div>
            </details>
            <details className="reveal">
              <summary>What does the Claude Partner Network badge mean?</summary>
              <div className="a">
                {"The Coast LLC is a launch Preferred partner in the Claude Partner Network Services Track, Anthropic's program for firms that help businesses put Claude into production. For you, it means you're working with a firm that's part of an ecosystem built around real, production-level AI deployment."}
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <span className="eyebrow mono">Your move</span>
          <h2>Bring us a drop.</h2>
          <p className="tagline">{"We'll deliver the ocean."}</p>
          <p className="success-line">
            {"Six weeks from now your team could have its week back, every lead answered in seconds, and systems running in production that you own outright."}
          </p>
          <div className="cta-row">
            <CtaLink location="final" className="btn btn-cta btn-big">
              Book Your AI Strategy Session
            </CtaLink>
          </div>
          <p className="scarcity">
            {CAPACITY.spotsRemaining} of {CAPACITY.buildsPerMonth} {CAPACITY.month} build spots
            remaining {'•'} Serious inquiries only
          </p>
        </div>
      </section>

      <footer className="ffooter">
        <div className="wrap">
          <p>
            <a href="https://coastglobal.org">coastglobal.org</a> &nbsp;{'•'}&nbsp;{' '}
            <a href="mailto:hello@coastglobal.org">hello@coastglobal.org</a>
          </p>
          <p className="fine">
            The Coast LLC is a launch Preferred partner in the Claude Partner Network Services Track.
          </p>
          <p className="fine">{'©'} 2026 The Coast Global. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
