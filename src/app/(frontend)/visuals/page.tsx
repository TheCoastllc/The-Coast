import type { Metadata } from 'next'
import { ChamberShell } from '@/components/ui/ChamberShell'
import { Plate } from '@/components/visuals/Plate'
import { FillText } from '@/components/visuals/FillText'
import { WaveSwell } from '@/components/visuals/waves/WaveSwell'
import { EDITORIAL } from '@/lib/content/coast'
import styles from './visuals.module.css'

export const metadata: Metadata = {
  title: 'Visuals',
  description: "A working archive of The Coast's visual language - brand plates, collected and catalogued.",
  alternates: { canonical: 'https://coastglobal.org/visuals' },
  openGraph: {
    type: 'website',
    title: 'Visuals | The Coast',
    description: "The studio's visual language, collected and catalogued.",
    url: 'https://coastglobal.org/visuals',
  },
}

const TILTS = [-3, 2.4, -2, 3, -2.6, 2.2, -3, 2.6, -2.2]
const ENTERS: ('left' | 'right' | 'bottom' | 'scale' | 'rotate')[] = [
  'left', 'right', 'bottom', 'scale', 'rotate', 'right', 'left', 'bottom', 'scale',
]
const code = (i: number) => `00${119 + i * 6}_0${(i % 4) + 1}`

export default function VisualsPage() {
  return (
    <ChamberShell
      index="02"
      label="Visuals"
      chamber="The Archive"
      preface="A working archive - the studio's visual language, collected and catalogued."
    >
      <div className={styles.intro}>
        <FillText
          className={styles.introText}
          text="Every brand begins as a sighting - a glimpse of who you could be, caught and developed and printed until the world can see it too. These are the plates."
        />
      </div>

      <div className={styles.archive}>
        <WaveSwell />
        <span className={styles.coordTop}>28.0000&deg; N</span>
        <span className={styles.coordBot}>50.0000&deg; W</span>

        {EDITORIAL.map((img, i) => (
          <div key={img.src} className={styles.row} data-side={i % 2 === 0 ? 'left' : 'right'}>
            <div className={styles.plateSlot}>
              <Plate
                src={img.src}
                code={code(i)}
                title="The Coast"
                meta={`PLATE ${String(i + 1).padStart(2, '0')}`}
                tilt={TILTS[i % TILTS.length]}
                parallax={5 + (i % 3) * 3}
                enter={ENTERS[i % ENTERS.length]}
              />
            </div>
            <div className={styles.textSlot}>
              <span className={styles.rowIdx}>
                {String(i + 1).padStart(2, '0')} / {EDITORIAL.length}
              </span>
              <p className={styles.cap}>{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </ChamberShell>
  )
}
