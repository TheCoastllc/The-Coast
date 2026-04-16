'use client'

import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { useCbi } from '../CbiContext'
import { CBI_MAX_SCORE, questions } from '../data/questions'
import { WAVE_SCALE } from '../data/waves'
import { WaveIcon } from '../components/WaveIcon'

const STATS = [
  { n: '20', l: 'Criteria' },
  { n: '100', l: 'Points' },
  { n: '48h', l: 'Delivery' },
] as const

const EASE = [0.22, 1, 0.36, 1] as const

// Timeline anchors (seconds) for the reveal sequence.
const T = {
  label: 0.0,
  waves: 0.5,
  score: 1.8,
  waveName: 2.8,
  line: 3.2,
  rest: 3.7,
}

/** Score counter that counts up from 0 to `target` after a delay. */
function CountUp({ target, delay, duration = 1.0 }: { target: number; delay: number; duration?: number }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => Math.round(v).toString())

  useEffect(() => {
    const controls = animate(mv, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [mv, target, delay, duration])

  return <motion.span>{rounded}</motion.span>
}

export function ResultsScreen() {
  const { state, derived } = useCbi()
  const { form, answers } = state
  const { total, wave } = derived

  const pillars = questions.map((q) => ({
    id: q.id,
    name: q.pillar,
    num: q.num,
    score: answers[q.id] ?? 0,
  }))

  const weakest = pillars.reduce((min, p) => (p.score < min.score ? p : min), pillars[0])

  return (
    <div className="min-h-screen bg-[#070F11] text-white font-sans overflow-auto">
      <section className="flex flex-col items-center justify-center text-center min-h-[75vh] px-8 pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: T.label }}
          className="text-[10px] tracking-[4px] text-white/55 uppercase font-semibold mb-2"
        >
          Coast Brand Index
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: T.label + 0.15 }}
          className="text-sm text-white/70 mb-12"
        >
          {form.brand}
        </motion.div>

        {/* Dramatic wave reveal — stagger each icon in with scale + color */}
        <div className="inline-flex items-center gap-2" aria-label={`Wave rating ${wave.w} of 5`}>
          {Array.from({ length: 5 }, (_, i) => {
            const active = i < wave.w
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.4, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: T.waves + i * 0.18,
                  ease: EASE,
                }}
                style={{ color: active ? wave.color : 'rgba(255,255,255,0.25)' }}
              >
                <WaveIcon width={44} height={44} />
              </motion.div>
            )
          })}
        </div>

        {/* Big score — count up after waves land */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: T.score, ease: EASE }}
          className="text-[96px] font-extralight leading-none tracking-[-5px] mt-10"
        >
          <CountUp target={total} delay={T.score + 0.1} duration={1.1} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: T.score + 0.8 }}
          className="text-sm text-white/50 mt-2 tracking-[1px]"
        >
          out of {CBI_MAX_SCORE}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: T.waveName, ease: EASE }}
          className="text-[22px] font-semibold tracking-[3px] uppercase mt-6"
          style={{ color: wave.color }}
        >
          {wave.name}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: T.line }}
          className="text-sm text-white/75 mt-4 max-w-[420px] leading-[1.7] font-light"
        >
          {wave.line}
        </motion.p>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: T.rest, ease: EASE }}
        className="max-w-[440px] mx-auto px-8 pb-10"
      >
        <div className="border-t border-white/15 pt-8">
          {pillars.map((p, i) => {
            const pct = (p.score / 4) * 100
            const c = p.score >= 3 ? '#0D5C63' : p.score >= 2 ? '#7A7530' : '#8B3A3A'
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: T.rest + 0.1 + i * 0.08, ease: EASE }}
                className="flex items-center gap-4 py-3.5 border-b border-white/10"
              >
                <div className="w-[100px] shrink-0 text-[10px] tracking-[2px] text-white/60 uppercase font-semibold">
                  {p.name}
                </div>
                <div className="flex-1">
                  <div className="h-[3px] bg-white/15 rounded-sm overflow-hidden">
                    <motion.div
                      className="h-full rounded-sm"
                      style={{ background: c }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 1.0,
                        delay: T.rest + 0.3 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                </div>
                <div className="w-8 text-right text-[13px] font-semibold" style={{ color: c }}>
                  {p.score}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: T.rest + 0.8 }}
        className="max-w-[440px] mx-auto px-8 pb-10"
      >
        <div className="border-t border-white/15 pt-7">
          <div className="text-[10px] tracking-[4px] text-white/60 uppercase font-semibold text-center mb-5">
            Wave Rating Scale
          </div>
          {WAVE_SCALE.map((w) => {
            const isYou = w.name === wave.name
            return (
              <div
                key={w.name}
                className="flex items-center px-3 py-2.5 mb-0.5"
                style={{
                  borderRadius: isYou ? 6 : 0,
                  background: isYou ? `${w.color}30` : 'transparent',
                }}
              >
                <div className="w-[112px] inline-flex items-center gap-[3px]">
                  {Array.from({ length: 5 }, (_, i) => (
                    <WaveIcon
                      key={i}
                      width={14}
                      height={14}
                      style={{
                        color:
                          i < w.w
                            ? isYou
                              ? w.color
                              : 'rgba(255,255,255,0.45)'
                            : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>
                <div
                  className="flex-1 text-[13px]"
                  style={{
                    color: isYou ? w.color : 'rgba(255,255,255,0.75)',
                    fontWeight: isYou ? 700 : 500,
                  }}
                >
                  {w.name}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: isYou ? w.color : 'rgba(255,255,255,0.55)',
                    fontWeight: isYou ? 600 : 400,
                  }}
                >
                  {w.range}
                </div>
                {isYou && (
                  <div
                    className="ml-3 text-[9px] tracking-[2px] uppercase font-bold"
                    style={{ color: w.color }}
                  >
                    You
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: T.rest + 1.1 }}
        className="max-w-[440px] mx-auto px-8 pb-10"
      >
        <div className="border-t border-white/15 pt-7 text-center">
          <div className="text-[10px] tracking-[4px] uppercase font-semibold text-[#D94F3D] mb-3">
            Biggest Opportunity
          </div>
          <div className="text-base font-semibold text-white/85 tracking-[0.3px]">
            Pillar {weakest.num}: {weakest.name}
          </div>
          <p className="text-[13px] text-white/60 mt-2 leading-[1.6] font-light">
            This is where your brand is leaking the most value.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: T.rest + 1.35 }}
        className="max-w-[440px] mx-auto px-8 pb-12"
      >
        <div className="border-t border-white/15 pt-10 text-center">
          <div className="text-[10px] tracking-[4px] text-white/60 uppercase font-semibold mb-5">
            This was a quick score
          </div>
          <p className="text-sm text-white/75 leading-[1.8] font-light mb-7">
            The full Coast Brand Index evaluates 20 criteria on observable evidence — scored by our
            team, not self-reported.
          </p>

          <div className="flex justify-center gap-8 mb-9">
            {STATS.map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-light">{s.n}</div>
                <div className="text-[9px] tracking-[4px] text-white/55 uppercase font-semibold mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://coastglobal.org/get-started"
            className="inline-block px-12 py-4 border border-[#C9A24B] text-[#C9A24B] text-xs font-bold tracking-[3px] uppercase transition-colors hover:bg-[#C9A24B] hover:text-[#070F11]"
          >
            Get the Full Report
          </a>
          <p className="text-[11px] text-white/45 mt-4">Starting at $97</p>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: T.rest + 1.6 }}
        className="text-center px-8 py-12 border-t border-white/15"
      >
        <div className="text-base text-white/65 font-light tracking-[1px]">
          Build a bigger wave.
        </div>
        <div className="text-[10px] tracking-[4px] text-white/40 uppercase font-semibold mt-4">
          The Coast
        </div>
      </motion.div>
    </div>
  )
}
