import { mulberry32 } from './seededRandom'
import { BEZIER } from './tween'

type BurstOpts = {
  count?: number
  seed?: number
  colors?: string[]
  distance?: number
  duration?: number
}

/**
 * A restrained celebratory burst: a seeded handful of small gold / teal / ink
 * pieces thrown from the centre of `layer`, arcing under gravity, spinning and
 * fading in under a second. Identical on every replay. Never call under reduced motion.
 */
export function burst(
  layer: HTMLElement,
  { count = 18, seed = 7, colors = ['var(--mk-accent)', 'var(--mk-accent-2)', 'var(--mk-ink)'], distance = 64, duration = 900 }: BurstOpts = {},
) {
  const rnd = mulberry32(seed)
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    const angle = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.7
    const dist = distance * (0.55 + rnd() * 0.75)
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist
    const size = 3 + Math.round(rnd() * 3)
    const round = rnd() > 0.5
    el.style.cssText = `position:absolute;left:50%;top:50%;width:${size}px;height:${size}px;margin:-${size / 2}px 0 0 -${size / 2}px;border-radius:${round ? '50%' : '1px'};background:${colors[i % colors.length]};pointer-events:none;will-change:transform,opacity;`
    layer.appendChild(el)
    const rot = (rnd() - 0.5) * 540
    const a = el.animate(
      [
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1, offset: 0 },
        { transform: `translate(${dx * 0.78}px, ${dy * 0.78 - 10}px) rotate(${rot * 0.6}deg) scale(1)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy + 28}px) rotate(${rot}deg) scale(0.55)`, opacity: 0, offset: 1 },
      ],
      { duration: duration * (0.85 + rnd() * 0.3), easing: BEZIER.outCubic, fill: 'forwards' },
    )
    a.onfinish = () => el.remove()
  }
}
