import styles from "./ChartField.module.css";

// portolan rhumb lines radiating from two compass hubs
const HUBS = [
  { x: 280, y: 230 },
  { x: 1160, y: 670 },
];
const RHUMBS = HUBS.flatMap((h) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    return {
      x1: h.x,
      y1: h.y,
      x2: (h.x + Math.cos(a) * 2200).toFixed(1),
      y2: (h.y + Math.sin(a) * 2200).toFixed(1),
    };
  })
);
const SOUNDINGS = [
  { x: 180, y: 120, v: "7" },
  { x: 520, y: 300, v: "12" },
  { x: 980, y: 175, v: "24" },
  { x: 1300, y: 420, v: "40" },
  { x: 120, y: 620, v: "31" },
  { x: 700, y: 760, v: "18" },
  { x: 1050, y: 840, v: "46" },
  { x: 430, y: 560, v: "9" },
  { x: 860, y: 470, v: "22" },
];

/** Faint site-wide nautical-chart field: rhumb lines from compass hubs + a
 *  lat/long grid + scattered depth soundings. Sits behind all content. */
export function ChartField() {
  return (
    <div className={styles.field} aria-hidden>
      <svg className={styles.svg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`v${i}`} x1={i * 160} y1="0" x2={i * 160} y2="900" className={styles.grid} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 150} x2="1440" y2={i * 150} className={styles.grid} />
        ))}
        {RHUMBS.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} className={styles.rhumb} />
        ))}
        {HUBS.map((h, i) => (
          <circle key={i} cx={h.x} cy={h.y} r="5" className={styles.hub} />
        ))}
        {SOUNDINGS.map((s, i) => (
          <text key={i} x={s.x} y={s.y} className={styles.sounding}>
            {s.v}
          </text>
        ))}
      </svg>
    </div>
  );
}
