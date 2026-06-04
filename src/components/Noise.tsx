/**
 * Global film-grain layer.
 *
 * W9 tune (matte black system): opacity dialled down from 0.15 → 0.04 and
 * blend mode flipped from screen (lifts blacks toward grey) → overlay
 * (interacts with the surface tones, preserves the matte). Larger tile
 * (360px) reduces visible repetition on high-DPR displays.
 *
 * Fixed at z-index 30 - sits above content backgrounds but below the
 * preloader (z-index 9999) and overlays (z-index 9999).
 */
export default function Noise() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-[100vh] w-full overflow-hidden mix-blend-overlay"
      style={{
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 360 360' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '360px 360px',
      }}
    />
  )
}
