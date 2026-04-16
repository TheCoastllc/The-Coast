'use client'

import { useCbi } from '../CbiContext'
import { WAVE_SCALE } from '../data/waves'
import { WaveRow } from '../components/WaveRow'

const BRAND_GOLD = '#C9A24B'

export function HeroScreen() {
  const { dispatch } = useCbi()
  const go = () => dispatch({ type: 'SET_PHASE', phase: 'intake' })

  return (
    <div className="min-h-screen bg-[#070F11] overflow-auto font-sans text-white">
      <div className="flex items-center justify-between max-w-[900px] mx-auto px-8 py-6">
        <span className="text-[11px] font-bold tracking-[5px] text-white/60 uppercase">
          The Coast
        </span>
        <button
          onClick={go}
          className="text-[11px] font-bold tracking-[2px] uppercase text-[#C9A24B] hover:text-[#C9A24B]/80 transition-colors"
        >
          Get Your Score
        </button>
      </div>

      <section className="max-w-[560px] mx-auto px-8 pt-20 text-center">
        <div className="flex justify-center">
          <WaveRow count={5} color={BRAND_GOLD} size={36} gap={8} />
        </div>

        <h1 className="text-[42px] font-light leading-[1.15] tracking-[-0.5px] mt-10">
          How Strong Is Your Wave?
        </h1>

        <p className="text-[15px] text-white/75 font-light leading-[1.8] max-w-[440px] mx-auto mt-6">
          Most small businesses have no idea how their brand actually performs. We built a system
          to measure it.
        </p>

        <p className="text-[13px] text-white/55 mt-3 tracking-[0.5px]">
          5 pillars · 20 criteria · 100 points · One number.
        </p>

        <button
          onClick={go}
          className="mt-12 px-12 py-4 border border-[#C9A24B] text-[#C9A24B] text-xs font-bold tracking-[3px] uppercase transition-colors hover:bg-[#C9A24B] hover:text-[#070F11]"
        >
          Get Your Free Score
        </button>
        <p className="text-[11px] text-white/45 mt-4">Takes 2 minutes</p>
      </section>

      <div className="max-w-[60px] mx-auto my-[72px] h-px bg-white/15" />

      <section className="max-w-[480px] mx-auto px-8 text-center">
        <div className="text-[10px] tracking-[4px] text-white/55 uppercase font-semibold mb-7">
          The Wave Rating Scale
        </div>

        <div className="flex flex-col">
          {WAVE_SCALE.map((w, i) => (
            <div
              key={w.name}
              className={`flex items-center py-3.5 ${i < WAVE_SCALE.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <div className="w-[96px] text-left">
                <WaveRow count={w.w} color={w.color} size={14} gap={3} />
              </div>
              <div className="flex-1 text-left">
                <span
                  className="text-sm font-semibold tracking-[0.5px]"
                  style={{ color: w.color }}
                >
                  {w.name}
                </span>
              </div>
              <div className="w-[60px] text-right text-[12px] text-white/60">{w.range}</div>
            </div>
          ))}
        </div>

        <p className="text-[13px] text-white/55 mt-6 italic font-light">
          Where does your brand land?
        </p>
      </section>

      <div className="max-w-[60px] mx-auto my-14 h-px bg-white/15" />

      <section className="max-w-[600px] mx-auto px-8 text-center">
        <div className="text-[10px] tracking-[4px] text-white/55 uppercase font-semibold mb-9">
          How it works
        </div>
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} className="flex-1 text-center">
              <div className="text-[28px] font-extralight text-white/35 mb-3">{s.n}</div>
              <div className="text-[13px] font-semibold text-white/85 tracking-[0.3px] mb-2">
                {s.t}
              </div>
              <div className="text-xs text-white/55 leading-[1.6] font-light">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center px-8 pt-16 pb-12">
        <button
          onClick={go}
          className="px-12 py-4 border border-[#C9A24B] text-[#C9A24B] text-xs font-bold tracking-[3px] uppercase transition-colors hover:bg-[#C9A24B] hover:text-[#070F11]"
        >
          Get Your Free Score
        </button>
        <p className="text-[11px] text-white/45 mt-3.5">Your results arrive by email</p>
      </div>

      <div className="text-center px-8 pt-8 pb-14 border-t border-white/10">
        <div className="text-[9px] tracking-[4px] text-white/40 uppercase font-semibold">
          Proprietary methodology
        </div>
        <div className="text-[11px] text-white/40 mt-1.5">
          5 Pillars · 20 Criteria · 0–5 Scale · 100 Point Score · Wave Rating™
        </div>
      </div>
    </div>
  )
}

const HOW_IT_WORKS = [
  {
    n: '01',
    t: 'We score your brand',
    d: "5 pillars, 20 criteria, scored on what's observable.",
  },
  {
    n: '02',
    t: 'You get your wave',
    d: 'A total score, a wave rating, and a visual report card.',
  },
  {
    n: '03',
    t: 'We show the path up',
    d: 'Your weakest pillars mapped to a targeted plan.',
  },
] as const
