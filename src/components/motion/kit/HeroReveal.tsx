'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { resolveMotionMode } from './useMotionMode'
import { BEZIER } from './tween'
import { SPRING } from './spring'
import type { MotionState } from './types'
import kit from './kit.module.css'
import styles from './HeroReveal.module.css'

export type HeroRevealProps = {
  badge?: ReactNode
  title: ReactNode
  lead?: ReactNode
  actions?: ReactNode
  note?: ReactNode
  /** selector (inside the title) that gets the accent underline drawn under it */
  underlineSelector?: string
  /** ms between words (default 90) */
  stagger?: number
  className?: string
}

/** Wrap each word of the text nodes under `el` in [data-hr-word] > [data-hr-inner]. Elements are kept. */
function splitWords(el: HTMLElement) {
  if (el.dataset.hrSplit) return
  el.dataset.hrSplit = '1'
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const texts: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) if (n.nodeValue && n.nodeValue.trim()) texts.push(n as Text)
  texts.forEach((t) => {
    const parts = t.nodeValue!.split(/(\s+)/)
    const frag = document.createDocumentFragment()
    parts.forEach((p) => {
      if (!p) return
      if (/^\s+$/.test(p)) {
        frag.appendChild(document.createTextNode(p))
      } else {
        const w = document.createElement('span')
        w.setAttribute('data-hr-word', '')
        const inner = document.createElement('span')
        inner.setAttribute('data-hr-inner', '')
        inner.textContent = p
        w.appendChild(inner)
        frag.appendChild(w)
      }
    })
    t.parentNode?.replaceChild(frag, t)
  })
}

/**
 * The first three seconds of a landing page. Words of the title rise from a
 * blur one after another, the badge drops in first, the lead fades up, the
 * CTAs spring to size, and an accent underline draws under the key word.
 * Plays once on mount, after the fonts are ready (300ms cap). Copy and
 * markup are the consumer's own - only motion is added. SSR / reduced
 * motion: everything is simply visible.
 */
export function HeroReveal({ badge, title, lead, actions, note, underlineSelector = '.accent', stagger = 90, className }: HeroRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<MotionState>('idle')

  useLayoutEffect(() => {
    if (resolveMotionMode() !== 'full') {
      setState('static')
      return
    }
    const titleEl = titleRef.current
    if (!titleEl) return
    splitWords(titleEl)
    const inners = Array.from(titleEl.querySelectorAll<HTMLElement>('[data-hr-inner]'))
    const blocks = [badgeRef.current, leadRef.current, actionsRef.current, noteRef.current].filter(Boolean) as HTMLElement[]
    inners.forEach((w) => {
      w.style.opacity = '0'
      w.style.transform = 'translateY(28px)'
      w.style.filter = 'blur(14px)'
    })
    blocks.forEach((b) => {
      b.style.opacity = '0'
    })
    // accent underline target
    let underline: HTMLSpanElement | null = null
    const accent = underlineSelector ? titleEl.querySelector<HTMLElement>(underlineSelector) : null
    if (accent) {
      accent.style.position = 'relative'
      underline = document.createElement('span')
      underline.setAttribute('data-hr-underline', '')
      underline.setAttribute('aria-hidden', 'true')
      accent.appendChild(underline)
    }

    let cancelled = false
    const anims: Animation[] = []
    const play = () => {
      if (cancelled) return
      setState('playing')
      const clear = (el: HTMLElement) => () => {
        el.style.opacity = ''
        el.style.transform = ''
        el.style.filter = ''
      }
      if (badgeRef.current) {
        const b = badgeRef.current
        const a = b.animate([{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, easing: BEZIER.outCubic, fill: 'forwards' })
        a.onfinish = () => {
          clear(b)()
          a.cancel()
        }
        anims.push(a)
      }
      inners.forEach((w, i) => {
        const a = w.animate(
          [
            { opacity: 0, transform: 'translateY(28px)', filter: 'blur(14px)' },
            { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
          ],
          { duration: 700, delay: 120 + i * stagger, easing: BEZIER.outCubic, fill: 'forwards' },
        )
        a.onfinish = () => {
          clear(w)()
          a.cancel()
        }
        anims.push(a)
      })
      const wordsEnd = 120 + (inners.length - 1) * stagger + 700
      if (underline) {
        const u = underline
        const a = u.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 520, delay: wordsEnd - 300, easing: BEZIER.outCubic, fill: 'forwards' })
        a.onfinish = () => {
          u.style.transform = 'scaleX(1)'
          a.cancel()
        }
        anims.push(a)
      }
      if (leadRef.current) {
        const l = leadRef.current
        const a = l.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, delay: wordsEnd - 420, easing: BEZIER.outCubic, fill: 'forwards' })
        a.onfinish = () => {
          clear(l)()
          a.cancel()
        }
        anims.push(a)
      }
      if (actionsRef.current) {
        const c = actionsRef.current
        const a = c.animate([{ opacity: 0, transform: 'scale(0.94)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 560, delay: wordsEnd - 240, easing: SPRING.SNAP, fill: 'forwards' })
        a.onfinish = () => {
          clear(c)()
          a.cancel()
        }
        anims.push(a)
      }
      if (noteRef.current) {
        const nt = noteRef.current
        const a = nt.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: wordsEnd + 60, easing: 'ease-out', fill: 'forwards' })
        a.onfinish = () => {
          clear(nt)()
          a.cancel()
        }
        anims.push(a)
      }
      window.setTimeout(() => !cancelled && setState('done'), wordsEnd + 700)
    }
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 300))]).then(play)
    return () => {
      cancelled = true
      anims.forEach((a) => a.playState === 'running' && a.finish())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} className={[kit.kit, styles.root, className ?? ''].filter(Boolean).join(' ')} data-motion="hero" data-motion-state={state} data-motion-trigger="mount">
      {badge && <div ref={badgeRef} style={{ display: 'contents' }} data-hr-badge="">{badge}</div>}
      <div ref={titleRef} style={{ display: 'contents' }} data-hr-title="">
        {title}
      </div>
      {lead && <div ref={leadRef} style={{ display: 'contents' }}>{lead}</div>}
      {actions && <div ref={actionsRef} style={{ display: 'contents' }}>{actions}</div>}
      {note && <div ref={noteRef} style={{ display: 'contents' }}>{note}</div>}
    </div>
  )
}
