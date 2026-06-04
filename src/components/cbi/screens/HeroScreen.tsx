'use client'

import { useCbi } from '../CbiContext'
import { WAVE_SCALE } from '../data/waves'
import { WaveRow } from '../components/WaveRow'
import { VideoWave } from '@/components/VideoWave'

export function HeroScreen() {
  const { dispatch } = useCbi()
  const go = () => dispatch({ type: 'SET_PHASE', phase: 'intake' })

  return (
    <div
      className="min-h-screen overflow-auto font-sans text-white"
      style={{ background: 'radial-gradient(125% 90% at 74% -8%, #12314f 0%, #08182a 46%, #05080f 100%)' }}
    >
      <div className="flex items-center justify-between max-w-[1180px] mx-auto px-8 py-6">
        <span className="font-mono text-[11px] font-medium tracking-[5px] text-white/60 uppercase">
          The Coast
        </span>
        <button
          onClick={go}
          className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#E6B24D] hover:text-[#E6B24D]/80 transition-colors"
        >
          Get Your Score
        </button>
      </div>

      <section className="max-w-[1180px] mx-auto px-8 pt-8 md:pt-14 pb-10 grid md:grid-cols-[1.05fr_0.9fr] gap-12 md:gap-16 items-center">
        <div className="text-center md:text-left">
          <span className="font-mono text-[11px] tracking-[4px] uppercase text-[#E6B24D]">
            The Coast Brand Index
          </span>
          <h1 className="font-serif text-[clamp(46px,6vw,78px)] font-light leading-[0.98] tracking-[-1.5px] mt-5">
            How Strong Is Your Wave?
          </h1>
          <p className="text-[16px] text-white/75 font-light leading-[1.7] max-w-[460px] mx-auto md:mx-0 mt-6">
            Most brands have no idea how they actually perform. The Coast Brand Index scores
            yours across five pillars and twenty criteria — and shows you exactly where to sharpen.
          </p>
          <div className="flex items-center gap-4 justify-center md:justify-start mt-7 font-mono text-[11px] tracking-[1.5px] uppercase text-white/50">
            <span>5 Pillars</span>
            <span className="text-white/20">/</span>
            <span>20 Criteria</span>
            <span className="text-white/20">/</span>
            <span>2 Minutes</span>
          </div>
          <div className="mt-9 flex flex-col sm:flex-row items-center md:items-start gap-4 justify-center md:justify-start">
            <button
              onClick={go}
              className="px-10 py-4 bg-[#E6B24D] text-[#06080C] text-xs font-mono font-semibold tracking-[3px] uppercase rounded-full transition-transform hover:-translate-y-0.5"
            >
              Get Your Free Score
            </button>
            <span className="text-[11px] text-white/45">Free · arrives by email</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[400px]">
          <div
            className="absolute -inset-8 -z-10 blur-3xl opacity-50"
            style={{ background: 'radial-gradient(circle at 50% 35%, rgba(230,178,77,0.28), transparent 70%)' }}
          />
          <div
            className="relative overflow-hidden rounded-[22px] border border-white/10"
            style={{ aspectRatio: '464 / 688', boxShadow: '0 50px 130px rgba(0,0,0,0.6)' }}
          >
            <VideoWave rounded={false} />
          </div>
        </div>
      </section>

      <div className="max-w-[60px] mx-auto my-[72px] h-px bg-white/15" />

      <section className="max-w-[480px] mx-auto px-8 text-center">
        <div className="text-[10px] tracking-[4px] text-white/55 uppercase font-mono mb-7">
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
        <div className="text-[10px] tracking-[4px] text-white/55 uppercase font-mono mb-9">
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
          className="px-12 py-4 border border-[#E6B24D] text-[#E6B24D] text-xs font-mono font-medium tracking-[3px] uppercase transition-colors hover:bg-[#E6B24D] hover:text-[#06080C]"
        >
          Get Your Free Score
        </button>
        <p className="text-[11px] text-white/45 mt-3.5">Your results arrive by email</p>
      </div>

      <div className="text-center px-8 pt-8 pb-14 border-t border-white/10">
        <div className="text-[9px] tracking-[4px] text-white/40 uppercase font-mono">
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
