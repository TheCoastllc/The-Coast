export type WaveName = 'Stranded' | 'Drifting' | 'Shoreline' | 'Harbor' | 'Lighthouse'

export type WaveTier = {
  name: WaveName
  w: 1 | 2 | 3 | 4 | 5
  range: string
  color: string
}

export type WaveResult = WaveTier & {
  scoreRange: readonly [number, number]
  line: string
}

/** Visual scale used on the hero + result summary. Range strings are 0-100 pts (marketing copy). */
export const WAVE_SCALE: readonly WaveTier[] = [
  { name: 'Lighthouse', w: 5, range: '85–100', color: '#0D5C63' },
  { name: 'Harbor', w: 4, range: '70–84', color: '#1A7A82' },
  { name: 'Shoreline', w: 3, range: '50–69', color: '#7A7530' },
  { name: 'Drifting', w: 2, range: '30–49', color: '#9B6B2F' },
  { name: 'Stranded', w: 1, range: '0–29', color: '#8B3A3A' },
] as const

/** Scoring bands for the 0-20 quick score. */
export const WAVES_RESULT: readonly WaveResult[] = [
  {
    name: 'Stranded',
    scoreRange: [0, 5],
    range: '0–29',
    w: 1,
    color: '#8B3A3A',
    line: "Your brand isn't visible yet. There's a clear path forward.",
  },
  {
    name: 'Drifting',
    scoreRange: [6, 9],
    range: '30–49',
    w: 2,
    color: '#9B6B2F',
    line: 'The foundation is here. The gaps are costing you.',
  },
  {
    name: 'Shoreline',
    scoreRange: [10, 13],
    range: '50–69',
    w: 3,
    color: '#7A7530',
    line: 'Functional — but not yet a competitive weapon.',
  },
  {
    name: 'Harbor',
    scoreRange: [14, 17],
    range: '70–84',
    w: 4,
    color: '#1A7A82',
    line: 'Strong brand. Minor gaps between you and category leadership.',
  },
  {
    name: 'Lighthouse',
    scoreRange: [18, 20],
    range: '85–100',
    w: 5,
    color: '#0D5C63',
    line: 'Exceptional. Your brand is actively driving growth.',
  },
] as const

export function getWave(score: number): WaveResult {
  return (
    WAVES_RESULT.find((w) => score >= w.scoreRange[0] && score <= w.scoreRange[1]) ??
    WAVES_RESULT[0]
  )
}
