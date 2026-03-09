'use client'

import { motion } from 'motion/react'
import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'

const services = [
  {
    number: '01',
    title: 'Brand Strategy',
    description: "Core identity, positioning & messaging that builds meaningful connections.",
  },
  {
    number: '02',
    title: 'Digital Design',
    description: 'Websites to apps — intuitive experiences that captivate and convert.',
  },
  {
    number: '03',
    title: 'Development',
    description: 'Scalable, performant digital products built with cutting-edge tech.',
  },
  {
    number: '04',
    title: 'Motion & Video',
    description: 'Dynamic storytelling through animation, video & interactive media.',
  },
  {
    number: '05',
    title: 'Marketing Assets',
    description: 'Pitch decks, digital ads & promotional materials that drive results.',
  },
]

// ─── Card 1: Brand Strategy — Orbiting shapes ───
function useBrandStrategyAnimation(cardRef: React.RefObject<HTMLDivElement | null>) {
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const shapesRef = useRef<HTMLDivElement[]>([])

  const setup = useCallback(() => {
    const card = cardRef.current
    if (!card) return

    const canvas = card.querySelector('.anim-canvas') as HTMLDivElement
    if (!canvas) return

    // Clean previous
    shapesRef.current.forEach(s => s.remove())
    shapesRef.current = []

    const shapes = ['circle', 'triangle', 'square', 'diamond']
    const colors = ['#C9A24B', '#e8c973', '#a07830', '#d4b058']

    shapes.forEach((type, i) => {
      const el = document.createElement('div')
      el.style.cssText = `position:absolute;width:24px;height:24px;opacity:0;pointer-events:none;`

      if (type === 'circle') {
        el.style.borderRadius = '50%'
        el.style.background = colors[i]
      } else if (type === 'triangle') {
        el.style.width = '0'
        el.style.height = '0'
        el.style.borderLeft = '12px solid transparent'
        el.style.borderRight = '12px solid transparent'
        el.style.borderBottom = `20px solid ${colors[i]}`
        el.style.background = 'none'
      } else if (type === 'square') {
        el.style.background = colors[i]
        el.style.borderRadius = '3px'
      } else {
        el.style.background = colors[i]
        el.style.borderRadius = '3px'
        el.style.transform = 'rotate(45deg)'
        el.style.width = '18px'
        el.style.height = '18px'
      }

      // Position around center
      const angle = (i / shapes.length) * Math.PI * 2
      const radius = 60
      el.style.left = `calc(50% + ${Math.cos(angle) * radius}px - 12px)`
      el.style.top = `calc(50% + ${Math.sin(angle) * radius}px - 12px)`

      canvas.appendChild(el)
      shapesRef.current.push(el)
    })
  }, [cardRef])

  const enter = useCallback(() => {
    setup()
    tlRef.current?.kill()
    const tl = gsap.timeline()

    shapesRef.current.forEach((shape, i) => {
      const angle = (i / shapesRef.current.length) * Math.PI * 2
      const radius = 60

      tl.to(shape, {
        opacity: 0.8,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      }, i * 0.08)

      // Orbit animation
      gsap.to(shape, {
        motionPath: {
          path: [
            { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
            { x: Math.cos(angle + Math.PI / 2) * radius, y: Math.sin(angle + Math.PI / 2) * radius },
            { x: Math.cos(angle + Math.PI) * radius, y: Math.sin(angle + Math.PI) * radius },
            { x: Math.cos(angle + Math.PI * 1.5) * radius, y: Math.sin(angle + Math.PI * 1.5) * radius },
          ],
        },
        duration: 4,
        repeat: -1,
        ease: 'none',
        delay: i * 0.15,
      })
    })

    tlRef.current = tl
  }, [setup])

  const leave = useCallback(() => {
    gsap.to(shapesRef.current, {
      opacity: 0,
      scale: 0.3,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        shapesRef.current.forEach(s => gsap.killTweensOf(s))
      },
    })
  }, [])

  return { enter, leave }
}

// ─── Card 2: Digital Design — Wireframe assembly ───
function useDigitalDesignAnimation(cardRef: React.RefObject<HTMLDivElement | null>) {
  const blocksRef = useRef<HTMLDivElement[]>([])

  const enter = useCallback(() => {
    const card = cardRef.current
    if (!card) return

    const canvas = card.querySelector('.anim-canvas') as HTMLDivElement
    if (!canvas) return

    blocksRef.current.forEach(b => b.remove())
    blocksRef.current = []

    const layouts = [
      { w: 80, h: 12, x: 10, y: 15 },   // nav bar
      { w: 50, h: 40, x: 10, y: 35 },   // main content
      { w: 25, h: 40, x: 65, y: 35 },   // sidebar
      { w: 80, h: 8, x: 10, y: 80 },    // footer
      { w: 35, h: 6, x: 15, y: 45 },    // text line 1
      { w: 25, h: 6, x: 15, y: 55 },    // text line 2
    ]

    layouts.forEach((layout, i) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position: absolute;
        width: ${layout.w}%;
        height: ${layout.h}%;
        left: ${layout.x}%;
        top: ${layout.y}%;
        background: rgba(201, 162, 75, 0.15);
        border: 1px solid rgba(201, 162, 75, 0.3);
        border-radius: 3px;
        opacity: 0;
        pointer-events: none;
      `
      canvas.appendChild(el)
      blocksRef.current.push(el)

      gsap.fromTo(el,
        { opacity: 0, scale: 0.5, x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 },
        { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.5, delay: i * 0.08, ease: 'power3.out' }
      )
    })
  }, [cardRef])

  const leave = useCallback(() => {
    gsap.to(blocksRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      stagger: 0.03,
      onComplete: () => blocksRef.current.forEach(b => b.remove()),
    })
  }, [])

  return { enter, leave }
}

// ─── Card 3: Development — Code rain ───
function useDevelopmentAnimation(cardRef: React.RefObject<HTMLDivElement | null>) {
  const charsRef = useRef<HTMLSpanElement[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const enter = useCallback(() => {
    const card = cardRef.current
    if (!card) return

    const canvas = card.querySelector('.anim-canvas') as HTMLDivElement
    if (!canvas) return

    charsRef.current.forEach(c => c.remove())
    charsRef.current = []

    const codeChars = '01{}[]<>/;:=()#$%&*+-~|\\^_`abcdefghijklmnopqrstuvwxyz'
    const columns = 14

    for (let col = 0; col < columns; col++) {
      const span = document.createElement('span')
      span.style.cssText = `
        position: absolute;
        left: ${(col / columns) * 100}%;
        top: -20px;
        font-family: monospace;
        font-size: 11px;
        color: #C9A24B;
        opacity: 0;
        pointer-events: none;
        writing-mode: vertical-lr;
        text-orientation: upright;
        letter-spacing: 4px;
        line-height: 1;
      `

      let text = ''
      for (let j = 0; j < 8; j++) {
        text += codeChars[Math.floor(Math.random() * codeChars.length)]
      }
      span.textContent = text

      canvas.appendChild(span)
      charsRef.current.push(span)

      gsap.fromTo(span,
        { y: -30, opacity: 0 },
        {
          y: 200,
          opacity: 0.6,
          duration: 1.5 + Math.random() * 2,
          delay: Math.random() * 0.8,
          ease: 'none',
          repeat: -1,
          onRepeat: () => {
            let newText = ''
            for (let j = 0; j < 8; j++) {
              newText += codeChars[Math.floor(Math.random() * codeChars.length)]
            }
            span.textContent = newText
          },
        }
      )
    }

    // Blinking cursor
    const cursor = document.createElement('div')
    cursor.style.cssText = `
      position: absolute;
      bottom: 20%;
      left: 20%;
      width: 8px;
      height: 16px;
      background: #C9A24B;
      pointer-events: none;
    `
    canvas.appendChild(cursor)
    charsRef.current.push(cursor as unknown as HTMLSpanElement)
    gsap.to(cursor, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true })
  }, [cardRef])

  const leave = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    charsRef.current.forEach(c => {
      gsap.killTweensOf(c)
      gsap.to(c, { opacity: 0, duration: 0.2, onComplete: () => c.remove() })
    })
    charsRef.current = []
  }, [])

  return { enter, leave }
}

// ─── Card 4: Motion & Video — Film strip ───
function useMotionVideoAnimation(cardRef: React.RefObject<HTMLDivElement | null>) {
  const elementsRef = useRef<HTMLDivElement[]>([])

  const enter = useCallback(() => {
    const card = cardRef.current
    if (!card) return

    const canvas = card.querySelector('.anim-canvas') as HTMLDivElement
    if (!canvas) return

    elementsRef.current.forEach(e => e.remove())
    elementsRef.current = []

    // Film strip
    const strip = document.createElement('div')
    strip.style.cssText = `
      position: absolute;
      top: 30%;
      left: -20%;
      width: 140%;
      height: 40%;
      display: flex;
      gap: 6px;
      opacity: 0;
      pointer-events: none;
    `

    for (let i = 0; i < 8; i++) {
      const frame = document.createElement('div')
      frame.style.cssText = `
        flex-shrink: 0;
        width: 50px;
        height: 100%;
        background: rgba(201, 162, 75, ${0.08 + i * 0.03});
        border: 1px solid rgba(201, 162, 75, 0.2);
        border-radius: 2px;
      `
      strip.appendChild(frame)
    }

    canvas.appendChild(strip)
    elementsRef.current.push(strip)

    gsap.to(strip, { opacity: 1, duration: 0.3 })
    gsap.to(strip, { x: -100, duration: 3, repeat: -1, ease: 'none' })

    // Play button
    const play = document.createElement('div')
    play.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #C9A24B;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
    `
    play.innerHTML = '<div style="width:0;height:0;border-left:12px solid #C9A24B;border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:3px"></div>'
    canvas.appendChild(play)
    elementsRef.current.push(play)

    gsap.to(play, { opacity: 1, duration: 0.3, delay: 0.2 })
    gsap.to(play, { scale: 1.1, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' })
  }, [cardRef])

  const leave = useCallback(() => {
    elementsRef.current.forEach(el => {
      gsap.killTweensOf(el)
      gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => el.remove() })
    })
    elementsRef.current = []
  }, [])

  return { enter, leave }
}

const ServiceCard = ({
  service,
  index,
  animHook,
}: {
  service: typeof services[0]
  index: number
  animHook: { enter: () => void; leave: () => void }
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleGlow = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--glow-x', `${x}%`)
    card.style.setProperty('--glow-y', `${y}%`)
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => {
        const card = cardRef.current
        if (card) card.style.setProperty('--glow-intensity', '1')
        animHook.enter()
      }}
      onMouseLeave={() => {
        const card = cardRef.current
        if (card) card.style.setProperty('--glow-intensity', '0')
        animHook.leave()
      }}
      onMouseMove={handleGlow}
      className="service-card group relative overflow-hidden rounded-lg p-6 md:p-8 transition-all duration-300"
      style={{
        backgroundColor: '#111',
        border: '1px solid rgba(201,162,75,0.08)',
        minHeight: index < 4 ? '280px' : '160px',
      }}
    >
      {/* Animation canvas */}
      <div className="anim-canvas absolute inset-0 overflow-hidden pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-4">
          <span className="text-mono text-[#C9A24B]/50 text-xs">{service.number}</span>
          <div className="w-8 h-8 rounded-full border border-[#C9A24B]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A24B]" />
          </div>
        </div>
        <div>
          <h3 className="text-heading text-2xl md:text-3xl text-foreground mb-2 group-hover:text-[#C9A24B] transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-body text-muted-foreground text-sm">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const Services = () => {
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const card4Ref = useRef<HTMLDivElement>(null)

  const anim1 = useBrandStrategyAnimation(card1Ref)
  const anim2 = useDigitalDesignAnimation(card2Ref)
  const anim3 = useDevelopmentAnimation(card3Ref)
  const anim4 = useMotionVideoAnimation(card4Ref)

  // Dummy anim for card 5
  const noopAnim = { enter: () => {}, leave: () => {} }

  return (
    <section
      id="services"
      className="py-20 md:py-32 lg:py-48 relative"
      style={{ backgroundColor: '#050505' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-heading text-3xl md:text-5xl lg:text-6xl text-foreground">What We Do</h2>
          <div className="w-16 h-px mt-4" style={{ backgroundColor: '#C9A24B' }} />
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div ref={card1Ref}>
            <ServiceCard service={services[0]} index={0} animHook={anim1} />
          </div>
          <div ref={card2Ref}>
            <ServiceCard service={services[1]} index={1} animHook={anim2} />
          </div>
          <div ref={card3Ref}>
            <ServiceCard service={services[2]} index={2} animHook={anim3} />
          </div>
          <div ref={card4Ref}>
            <ServiceCard service={services[3]} index={3} animHook={anim4} />
          </div>
        </div>

        {/* Full-width 5th card */}
        <ServiceCard service={services[4]} index={4} animHook={noopAnim} />
      </div>
    </section>
  )
}

export default Services
