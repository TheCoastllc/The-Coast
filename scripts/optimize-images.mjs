// One-off image optimizer (sharp). Generates AVIF/WebP variants for the homepage
// glass backgrounds (consumed via CSS image-set) and a lighter video poster.
// Run: node scripts/optimize-images.mjs   (safe to delete after running)
import sharp from 'sharp'
import { statSync } from 'node:fs'

const kb = (n) => Math.round(n / 1024) + 'KB'
const size = (p) => { try { return kb(statSync(p).size) } catch { return 'missing' } }

async function variants(src, { width, avifQ, webpQ }) {
  const base = src.replace(/\.(jpg|jpeg|png)$/i, '')
  const pipe = () => sharp(src).resize({ width, withoutEnlargement: true })
  await pipe().avif({ quality: avifQ, effort: 4 }).toFile(`${base}.avif`)
  await pipe().webp({ quality: webpQ }).toFile(`${base}.webp`)
  console.log(`${src} (${size(src)}) -> .avif ${size(`${base}.avif`)} | .webp ${size(`${base}.webp`)}`)
}

// Full-bleed glass backgrounds: behind blur + grade, so aggressive is fine.
await variants('public/img/ocean-aerial-wide.jpg', { width: 2000, avifQ: 42, webpQ: 68 })
// Founder portrait (a person) - keep a touch more quality.
await variants('public/founder.jpg', { width: 1400, avifQ: 50, webpQ: 74 })

// Lighter video poster: the wave clip renders <=320px wide, so 640px is plenty.
await sharp('public/cbi-wave-poster.png')
  .resize({ width: 640, withoutEnlargement: true })
  .jpeg({ quality: 70, mozjpeg: true })
  .toFile('public/cbi-wave-poster.jpg')
console.log(`cbi-wave-poster.png (${size('public/cbi-wave-poster.png')}) -> .jpg ${size('public/cbi-wave-poster.jpg')}`)
