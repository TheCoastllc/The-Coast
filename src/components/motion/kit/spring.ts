/**
 * Damped-spring easing as a CSS `linear()` timing function, so WAAPI/CSS
 * transitions get a physical settle without a JS loop. Feature-detected;
 * browsers without linear() get a cubic-bezier with a matching feel.
 */

type SpringOpts = { stiffness?: number; damping?: number; mass?: number; samples?: number }

const memo = new Map<string, string>()

function supportsLinear(): boolean {
  try {
    return typeof CSS !== 'undefined' && CSS.supports('animation-timing-function', 'linear(0, 1)')
  } catch {
    return false
  }
}

export function springLinear({ stiffness = 420, damping = 31, mass = 1, samples = 48 }: SpringOpts = {}, fallback = 'cubic-bezier(0.34, 1.3, 0.64, 1)'): string {
  const key = `${stiffness}|${damping}|${mass}|${samples}`
  const hit = memo.get(key)
  if (hit) return hit
  if (!supportsLinear()) {
    memo.set(key, fallback)
    return fallback
  }
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = Math.min(0.999, damping / (2 * Math.sqrt(stiffness * mass)))
  const wd = w0 * Math.sqrt(1 - zeta * zeta)
  // settle time: amplitude decays to ~0.2%
  const T = 6.2 / (zeta * w0)
  const pts: string[] = []
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * T
    const x = 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    pts.push((i === samples ? 1 : x).toFixed(4))
  }
  const out = `linear(${pts.join(', ')})`
  memo.set(key, out)
  return out
}

/** Presets. SNAP overshoots once by ~2.5%; SETTLE lands without overshoot. */
export const SPRING = {
  get SNAP() {
    return springLinear({ stiffness: 420, damping: 31 }, 'cubic-bezier(0.34, 1.3, 0.64, 1)')
  },
  get SETTLE() {
    return springLinear({ stiffness: 320, damping: 36 }, 'cubic-bezier(0.16, 1, 0.3, 1)')
  },
}
