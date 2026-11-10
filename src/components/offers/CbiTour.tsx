'use client'

import { useMemo, useState } from 'react'
import { CountUp, CursorTour, useMotionMode, type TourStep } from '@/components/motion/kit'
import { questions } from '@/components/cbi/data/questions'
import { CBI } from '@/app/(frontend)/offers/content'
import styles from './CbiTour.module.css'

/** The three questions the demo answers (real pillar copy from the Brand Index) and the option it picks. */
const SCRIPT: Array<{ q: number; pick: number }> = [
  { q: 0, pick: 2 },
  { q: 1, pick: 3 },
  { q: 2, pick: 1 },
]
/** illustrative per-pillar fill for the result bars (matches the 76 mock) */
const BARS = [0.6, 0.85, 0.45, 0.8, 0.9]

type View = { step: number; picked: number | null; result: boolean }

/**
 * A fake cursor takes the Coast Brand Index: it answers three real questions,
 * presses Next, and the Wave result counts up - a product demo without a
 * screen recording. Everything inside is non-interactive (the card around it
 * is the link). The score is the published illustrative mock, never a claim.
 */
export function CbiTour({ compact = false }: { compact?: boolean }) {
  const mode = useMotionMode()
  const [view, setView] = useState<View>(() => ({ step: 0, picked: null, result: false }))
  const steps = useMemo<TourStep[]>(() => {
    const out: TourStep[] = [{ kind: 'wait', ms: 700 }]
    SCRIPT.forEach((s, i) => {
      out.push({ kind: 'click', on: `o${s.pick}` })
      out.push({ kind: 'run', fn: () => setView({ step: i, picked: s.pick, result: false }) })
      out.push({ kind: 'wait', ms: 520 })
      out.push({ kind: 'click', on: 'next', zoom: false })
      if (i < SCRIPT.length - 1) {
        out.push({ kind: 'run', fn: () => setView({ step: i + 1, picked: null, result: false }) })
        out.push({ kind: 'zoom', level: null })
        out.push({ kind: 'wait', ms: 420 })
      }
    })
    out.push({ kind: 'zoom', level: null })
    out.push({ kind: 'run', fn: () => setView({ step: SCRIPT.length - 1, picked: null, result: true }) })
    out.push({ kind: 'wait', ms: 3200 })
    return out
  }, [])

  // reduced motion / ?motion=off: show the result, nothing moves
  const showResult = mode !== 'full' ? true : view.result
  const q = questions[SCRIPT[view.step].q]

  return (
    <CursorTour
      className={`${styles.root} ${compact ? styles.compact : ''}`}
      steps={steps}
      description={`Demo of the Coast Brand Index: a cursor answers three questions - ${SCRIPT.map((s) => questions[s.q].pillar).join(', ')} - and receives an illustrative Wave rating of ${CBI.mock.score} out of 100, ${CBI.mock.waveName}.`}
      onLoopStart={() => setView({ step: 0, picked: null, result: false })}
    >
      {showResult ? (
        <div className={`${styles.screen} ${styles.result}`}>
          <span className={styles.wave}>Your wave</span>
          <CountUp key={String(showResult)} value={String(CBI.mock.score)} className={styles.score} ring={{ percent: CBI.mock.score, size: 92, stroke: 5 }} duration={1500} />
          <span className={styles.wave}>{CBI.mock.waveName}</span>
          <p className={styles.line}>{CBI.mock.line}</p>
          <div className={styles.bars} aria-hidden="true">
            {BARS.map((f, i) => (
              <span key={i} className={styles.bar}>
                <span className={styles.barFill} style={{ ['--f' as string]: f } as React.CSSProperties} />
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.screen}>
          <div className={styles.meta}>
            <span className={styles.pillar}>{q.pillar}</span>
            <span>
              {String(q.num).padStart(2, '0')} / 05
            </span>
          </div>
          <p className={styles.question}>{q.question}</p>
          <ul className={styles.options}>
            {q.options.map((o, i) => (
              <li key={o.label} className={styles.option} data-tour={`o${i}`} data-on={view.picked === i}>
                <span className={styles.dot} />
                {o.label}
              </li>
            ))}
          </ul>
          <span className={styles.next} data-tour="next">
            Next →
          </span>
        </div>
      )}
    </CursorTour>
  )
}
