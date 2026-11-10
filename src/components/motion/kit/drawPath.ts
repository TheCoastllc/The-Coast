import { BEZIER } from './tween'

type DrawOpts = { duration?: number; delay?: number; easing?: string }

/** Hide a stroke so it can be drawn: dasharray = dashoffset = total length. */
export function preparePath(el: SVGGeometryElement): number {
  const L = el.getTotalLength()
  el.style.strokeDasharray = `${L}`
  el.style.strokeDashoffset = `${L}`
  return L
}

/** Draw a prepared (or unprepared) stroke from nothing to full. Clears the inline dash on finish. */
export function drawPath(el: SVGGeometryElement, { duration = 800, delay = 0, easing = BEZIER.outCubic }: DrawOpts = {}): Animation {
  const L = el.getTotalLength()
  el.style.strokeDasharray = `${L}`
  el.style.strokeDashoffset = `${L}`
  const a = el.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration, delay, easing, fill: 'forwards' })
  a.onfinish = () => {
    el.style.strokeDasharray = ''
    el.style.strokeDashoffset = ''
    a.cancel()
  }
  return a
}

const STROKABLE = 'path, circle, ellipse, line, polyline, polygon, rect'

/** Draw every stroked shape inside a root (icons), staggered. Shapes with no stroke are skipped. */
export function drawAll(root: Element | null, { duration = 480, delay = 0, stagger = 60, easing = BEZIER.outCubic }: DrawOpts & { stagger?: number } = {}): Animation[] {
  if (!root) return []
  const out: Animation[] = []
  root.querySelectorAll<SVGGeometryElement>(STROKABLE).forEach((el, i) => {
    if (typeof el.getTotalLength !== 'function') return
    const cs = getComputedStyle(el)
    if (cs.stroke === 'none' || cs.strokeWidth === '0px') return
    out.push(drawPath(el, { duration, delay: delay + i * stagger, easing }))
  })
  return out
}
