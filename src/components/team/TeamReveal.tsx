'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './team.module.css'
import { TeamGrid, type Member } from './TeamGrid'

/**
 * The Reveal - editorial roster. Hovering a name summons that portrait, which
 * eases toward the cursor (position via CSS vars on the outer; scale-in on the
 * inner so tracking + reveal don't fight). Touch devices get the grid.
 */
export function TeamReveal({ members }: { members: readonly Member[] }) {
  const [active, setActive] = useState(-1)
  const [hoverable, setHoverable] = useState(true)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia?.('(hover: none)').matches) {
      setHoverable(false)
      return
    }
    const el = previewRef.current
    if (!el) return
    let raf = 0
    let cx = window.innerWidth / 2
    let cy = window.innerHeight / 2
    let tx = cx
    let ty = cy
    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const tick = () => {
      cx += (tx - cx) * 0.16
      cy += (ty - cy) * 0.16
      el.style.setProperty('--rx', `${cx}px`)
      el.style.setProperty('--ry', `${cy}px`)
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!hoverable) return <TeamGrid members={members} />

  return (
    <div className={styles.revealWrap} data-hovering={active >= 0} onMouseLeave={() => setActive(-1)}>
      <ul className={styles.revealList}>
        {members.map((m, i) => (
          <li
            key={m.name}
            className={styles.revealRow}
            data-active={active === i}
            onMouseEnter={() => setActive(i)}
          >
            <span className={styles.revealIndex}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.revealName}>{m.name}</span>
            <span className={styles.revealRole}>{m.role}</span>
          </li>
        ))}
      </ul>
      <p className={styles.revealHint}>Hover a name to meet the team</p>

      <div ref={previewRef} className={styles.revealPreview} data-show={active >= 0} aria-hidden="true">
        <div className={styles.revealPreviewInner}>
          {members.map((m, i) => (
            <div key={m.name} className={styles.revealPreviewImg} data-on={active === i}>
              <Image src={m.image} alt="" fill sizes="280px" className="object-cover" style={{ objectPosition: '50% 18%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
