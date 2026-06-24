import Image from 'next/image'
import styles from './team.module.css'

export type Member = { name: string; role: string; image: string }

const SIZES = '(max-width: 480px) 50vw, (max-width: 820px) 50vw, 33vw'

/** Clean portrait grid - the baseline + the touch fallback for The Reveal. */
export function TeamGrid({ members }: { members: readonly Member[] }) {
  return (
    <div className={styles.grid}>
      {members.map((m) => (
        <article key={m.name}>
          <div className={styles.gridPhoto}>
            <Image
              src={m.image}
              alt={m.role ? `${m.name}, ${m.role}` : m.name}
              fill
              sizes={SIZES}
              className="object-cover"
              style={{ objectPosition: '50% 18%' }}
            />
          </div>
          <h3 className={styles.gridName}>{m.name}</h3>
          {m.role ? <p className={styles.gridRole}>{m.role}</p> : null}
        </article>
      ))}
    </div>
  )
}
