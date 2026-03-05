'use client'

import { useState, useEffect } from 'react'

const SciFiDashboardClock = () => {
  // null until mounted — prevents server/client hydration mismatch on time-based values
  const [time, setTime] = useState<Date | null>(null)
  useEffect(() => {
    setTime(new Date())
    const t = setInterval(() => setTime(new Date()), 50)
    return () => clearInterval(t)
  }, [])

  // Render a same-size placeholder on the server / before hydration
  if (!time) return <div style={{ width: 150, height: 150 }} />

  const s = time.getSeconds() + time.getMilliseconds() / 1000
  const m = time.getMinutes() + s / 60
  const h = (time.getHours() % 12) + m / 60
  const size = 150
  const cx = size / 2
  const cy = size / 2

  const circumference = (r: number) => 2 * Math.PI * r

  const dotAt = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const sweepAngle = s * 6

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="scifiGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="sweepGrad" gradientTransform={`rotate(${sweepAngle - 90})`}>
            <stop offset="0%" stopColor="hsl(var(--accent-teal))" stopOpacity="0" />
            <stop offset="70%" stopColor="hsl(var(--accent-teal))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--accent-teal))" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Outer frame rings */}
        <circle cx={cx} cy={cy} r={72} fill="none" stroke="hsl(var(--border))" strokeWidth={0.3} />
        <circle cx={cx} cy={cy} r={70} fill="none" stroke="hsl(var(--accent-teal))" strokeWidth={0.5} opacity={0.3} />
        <circle cx={cx} cy={cy} r={58} fill="none" stroke="hsl(var(--border))" strokeWidth={0.3} />
        <circle cx={cx} cy={cy} r={46} fill="none" stroke="hsl(var(--border))" strokeWidth={0.3} />
        <circle cx={cx} cy={cy} r={34} fill="none" stroke="hsl(var(--border))" strokeWidth={0.3} />

        {/* 60 tick marks on outer ring */}
        {Array.from({ length: 60 }, (_, i) => {
          const a = i * 6
          const rad = ((a - 90) * Math.PI) / 180
          const isMaj = i % 5 === 0
          const r1 = isMaj ? 67 : 69
          const r2 = 72
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
              stroke={isMaj ? 'hsl(var(--accent-teal))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={isMaj ? 1.5 : 0.4}
              opacity={isMaj ? 0.9 : 0.3}
            />
          )
        })}

        {/* Cross-hair lines */}
        {[0, 90, 180, 270].map(a => {
          const rad = ((a - 90) * Math.PI) / 180
          return (
            <line
              key={a}
              x1={cx + 22 * Math.cos(rad)} y1={cy + 22 * Math.sin(rad)}
              x2={cx + 30 * Math.cos(rad)} y2={cy + 30 * Math.sin(rad)}
              stroke="hsl(var(--accent-teal))"
              strokeWidth={0.5}
              opacity={0.4}
            />
          )
        })}

        {/* Seconds ring */}
        <circle
          cx={cx} cy={cy} r={70}
          fill="none"
          stroke="hsl(var(--accent-teal))"
          strokeWidth={2}
          strokeDasharray={`${(s / 60) * circumference(70)} ${circumference(70)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#scifiGlow)"
        />

        {/* Minutes ring */}
        <circle
          cx={cx} cy={cy} r={58}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          strokeDasharray={`${(m / 60) * circumference(58)} ${circumference(58)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#scifiGlow)"
        />

        {/* Hours ring */}
        <circle
          cx={cx} cy={cy} r={46}
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth={3}
          strokeDasharray={`${(h / 12) * circumference(46)} ${circumference(46)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.7}
        />

        {/* Orbiting particles */}
        {[0, 120, 240].map((offset, i) => {
          const angle = sweepAngle + offset
          const pos = dotAt(angle, 70)
          return (
            <circle key={i} cx={pos.x} cy={pos.y} r={1.5} fill="hsl(var(--accent-teal))" opacity={0.5} />
          )
        })}

        {/* Radar sweep */}
        {(() => {
          const end = dotAt(sweepAngle, 34)
          return (
            <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="hsl(var(--accent-teal))" strokeWidth={0.8} opacity={0.3} />
          )
        })()}

        {/* Inner rotating ring */}
        <g transform={`rotate(${-s * 3} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={34} fill="none" stroke="hsl(var(--accent-teal))" strokeWidth={0.5} strokeDasharray="4 8" opacity={0.3} />
        </g>

        {/* Center */}
        <circle cx={cx} cy={cy} r={5} fill="hsl(var(--accent-teal))" filter="url(#scifiGlow)" opacity={0.6} />
        <circle cx={cx} cy={cy} r={2.5} fill="hsl(var(--background))" />
      </svg>

      {/* Center time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-xs font-mono tabular-nums tracking-[0.3em]"
          style={{ color: 'hsl(var(--accent-teal))', textShadow: '0 0 10px hsl(var(--accent-teal))' }}
        >
          {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
        </span>
        <span
          className="text-[7px] font-mono tracking-[0.2em] mt-0.5"
          style={{ color: 'hsl(var(--accent-teal))', opacity: 0.5 }}
        >
          {time.getSeconds().toString().padStart(2, '0')}s
        </span>
      </div>
    </div>
  )
}

export default SciFiDashboardClock
