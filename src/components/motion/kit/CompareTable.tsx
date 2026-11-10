'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { usePlayOnce } from './usePlayOnce'
import { resolveMotionMode } from './useMotionMode'
import { drawPath, preparePath } from './drawPath'
import { BEZIER } from './tween'
import { SPRING } from './spring'
import type { BaseMotionProps } from './types'
import kit from './kit.module.css'
import styles from './CompareTable.module.css'

export type CompareCell = boolean | string
export type CompareRow = { label: string; them: CompareCell; us: CompareCell }

export type CompareTableProps = BaseMotionProps & {
  rows: CompareRow[]
  columns?: { them: string; us: string }
  /** ms between rows (default 450) */
  rowDelay?: number
  /** screen-reader caption */
  caption?: string
  cta?: ReactNode
}

function Cell({ value, kind }: { value: CompareCell; kind: 'them' | 'us' }) {
  if (typeof value === 'string') return <span data-ct-text="">{value}</span>
  if (value) {
    return (
      <span className={`${styles.icon} ${styles.check}`} data-ct-check="" aria-label="Yes">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="11" data-ct-circle="" />
          <path d="M7.5 12.5l3 3 6-6.5" data-ct-path="" />
        </svg>
      </span>
    )
  }
  return (
    <span className={`${styles.icon} ${styles.x}`} data-ct-x="" aria-label={kind === 'them' ? 'No' : 'No'}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7l10 10" data-ct-path="" />
        <path d="M17 7L7 17" data-ct-path="" />
      </svg>
    </span>
  )
}

/**
 * Checks for us, calm words or crosses for them. A real table: the "us"
 * column's panel grows in from the top, then rows reveal one by one - label
 * slides in, the "them" cell fades (or its cross draws), the "us" circle pops
 * and its check draws. SSR / reduced motion: the finished table.
 */
export function CompareTable({ rows, columns = { them: 'Typical agency', us: 'The Coast' }, rowDelay = 450, caption, cta, className, style, threshold, onDone, static: isStatic }: CompareTableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const { state, setDone } = usePlayOnce(ref, { threshold, disabled: isStatic || rows.length === 0 })
  const [panel, setPanel] = useState<{ left: number; width: number } | null>(null)

  // place the highlight panel behind the "us" column (and keep it there on resize)
  useEffect(() => {
    const measure = () => {
      const th = tableRef.current?.querySelector<HTMLElement>('th[data-ct-us]')
      const wrap = wrapRef.current
      if (!th || !wrap) return
      const a = th.getBoundingClientRect()
      const b = wrap.getBoundingClientRect()
      setPanel({ left: a.left - b.left + wrap.scrollLeft, width: a.width })
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (wrapRef.current && ro) ro.observe(wrapRef.current)
    return () => ro?.disconnect()
  }, [])

  // start state
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || isStatic || rows.length === 0 || resolveMotionMode() !== 'full') return
    if (panelRef.current) panelRef.current.style.transform = 'scaleY(0)'
    root.querySelectorAll<HTMLElement>('tbody tr').forEach((tr) => {
      tr.querySelectorAll<HTMLElement>('td').forEach((td) => {
        td.style.opacity = '0'
      })
      tr.querySelectorAll<SVGGeometryElement>('[data-ct-path]').forEach(preparePath)
      tr.querySelectorAll<HTMLElement>('[data-ct-circle]').forEach((c) => {
        c.style.transform = 'scale(0)'
        c.style.transformOrigin = 'center'
        c.style.transformBox = 'fill-box'
      })
    })
    if (ctaRef.current) ctaRef.current.style.opacity = '0'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const root = ref.current
    if (state !== 'playing' || !root) return
    const anims: Animation[] = []
    const timers: number[] = []
    const settle = (el: HTMLElement, props: string[]) => () => {
      props.forEach((p) => el.style.removeProperty(p))
    }
    if (panelRef.current) {
      const p = panelRef.current
      const a = p.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 520, easing: BEZIER.outCubic, fill: 'forwards' })
      a.onfinish = () => {
        p.style.transform = ''
        a.cancel()
      }
      anims.push(a)
    }
    const trs = Array.from(root.querySelectorAll<HTMLElement>('tbody tr'))
    trs.forEach((tr, i) => {
      timers.push(
        window.setTimeout(() => {
          const tds = Array.from(tr.querySelectorAll<HTMLElement>('td'))
          tds.forEach((td, j) => {
            const a = td.animate(
              [
                { opacity: 0, transform: j === 0 ? 'translateX(-8px)' : 'none' },
                { opacity: 1, transform: 'none' },
              ],
              { duration: 420, delay: j * 60, easing: BEZIER.outCubic, fill: 'forwards' },
            )
            a.onfinish = () => {
              settle(td, ['opacity'])()
              a.cancel()
            }
            anims.push(a)
          })
          tr.querySelectorAll<HTMLElement>('[data-ct-circle]').forEach((c) => {
            const a = c.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.12)', offset: 0.7 }, { transform: 'scale(1)' }], {
              duration: 380,
              delay: 140,
              easing: SPRING.SNAP,
              fill: 'forwards',
            })
            a.onfinish = () => {
              settle(c, ['transform'])()
              a.cancel()
            }
            anims.push(a)
          })
          tr.querySelectorAll<SVGGeometryElement>('[data-ct-path]').forEach((p, k) => {
            anims.push(drawPath(p, { duration: 260, delay: 220 + k * 90, easing: BEZIER.outCubic }))
          })
        }, 300 + i * rowDelay),
      )
    })
    const end = 300 + trs.length * rowDelay + 500
    if (ctaRef.current) {
      const c = ctaRef.current
      timers.push(
        window.setTimeout(() => {
          const a = c.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: BEZIER.outCubic, fill: 'forwards' })
          a.onfinish = () => {
            settle(c, ['opacity'])()
            a.cancel()
          }
          anims.push(a)
        }, end - 300),
      )
    }
    timers.push(
      window.setTimeout(() => {
        setDone()
        onDone?.()
      }, end + 300),
    )
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      anims.forEach((a) => a.playState === 'running' && a.finish())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (rows.length === 0) return null

  return (
    <div ref={ref} className={[kit.kit, styles.root, className ?? ''].filter(Boolean).join(' ')} style={style} data-motion="compare-table" data-motion-state={state}>
      <div ref={wrapRef} className={styles.wrap}>
        {panel && <div ref={panelRef} className={styles.panel} style={{ left: panel.left, width: panel.width }} aria-hidden="true" data-decor="" />}
        <table ref={tableRef} className={styles.table}>
          {caption && <caption className={kit.srOnly}>{caption}</caption>}
          <thead>
            <tr>
              <th scope="col" className={styles.label}>
                <span className={kit.srOnly}>What you get</span>
              </th>
              <th scope="col" className={styles.them}>
                {columns.them}
              </th>
              <th scope="col" className={`${styles.us} us`} data-ct-us="">
                {columns.us}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className={styles.label} style={{ fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 0, textTransform: 'none', color: 'inherit' }}>
                  {r.label}
                </th>
                <td className={styles.them}>
                  <Cell value={r.them} kind="them" />
                </td>
                <td className={styles.us}>
                  <Cell value={r.us} kind="us" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cta && (
        <div ref={ctaRef} className={styles.cta}>
          {cta}
        </div>
      )}
    </div>
  )
}
