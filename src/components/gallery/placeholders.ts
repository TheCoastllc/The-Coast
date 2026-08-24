import type { GalleryItem } from './types'

const PIN = 'https://pin.it/nW5MRvKEz'

/**
 * Temporary placeholder wall - shown ONLY when the CMS has no published Gallery
 * items yet, so the subdomain never looks empty before David uploads real work.
 * Sources existing on-brand /public images with their true dimensions (no layout
 * shift). Auto-disappears the moment a real item is published in /admin -> Gallery.
 */
export const GALLERY_PLACEHOLDERS: GalleryItem[] = [
  { id: 'p1', title: 'Nocturne', caption: 'Editorial study in motion.', src: '/img/editorial/02.jpg', width: 1200, height: 1895, alt: 'Editorial study - Nocturne', category: 'artwork', shopUrl: null, pinUrl: PIN, featured: true },
  { id: 'p2', title: 'Coastline No. 1', caption: 'Aerial, turquoise water.', src: '/img/ocean-aerial-wide.jpg', width: 2400, height: 1500, alt: 'Aerial coastline photograph', category: 'photography', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p3', title: 'Undertow', caption: null, src: '/img/editorial/04.jpg', width: 1200, height: 1499, alt: 'Editorial study - Undertow', category: 'artwork', shopUrl: null, pinUrl: PIN, featured: false },
  { id: 'p4', title: 'Troi - Identity', caption: 'Brand system, selected frame.', src: '/portfolio/troi/hero.jpg', width: 4800, height: 2700, alt: 'Troi brand identity', category: 'brand', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p5', title: 'First Light', caption: null, src: '/img/editorial/01.jpg', width: 736, height: 977, alt: 'Editorial study - First Light', category: 'illustration', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p6', title: 'After Hours', caption: 'Vision render, night.', src: '/vision/night.jpeg', width: 736, height: 736, alt: 'Vision render - After Hours', category: 'artwork', shopUrl: null, pinUrl: PIN, featured: false },
  { id: 'p7', title: 'Ascend', caption: null, src: '/img/editorial/08.jpg', width: 1080, height: 1920, alt: 'Editorial study - Ascend', category: 'artwork', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p8', title: 'AMG - Record Sleeve', caption: 'Cover art.', src: '/portfolio/amg-records/cover.jpg', width: 3840, height: 2400, alt: 'AMG Records cover art', category: 'brand', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p9', title: 'Salt', caption: null, src: '/img/editorial/06.jpg', width: 736, height: 920, alt: 'Editorial study - Salt', category: 'photography', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p10', title: 'Deep Field', caption: 'Long-exposure water.', src: '/img/ocean-dark.jpg', width: 1800, height: 3200, alt: 'Deep field water photograph', category: 'photography', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p11', title: 'Daybreak', caption: 'Vision render, day.', src: '/vision/day.jpg', width: 1024, height: 1024, alt: 'Vision render - Daybreak', category: 'artwork', shopUrl: null, pinUrl: PIN, featured: false },
  { id: 'p12', title: 'Kando - System', caption: 'Brand system, selected frame.', src: '/portfolio/kando/hero.jpg', width: 4800, height: 2700, alt: 'Kando brand system', category: 'brand', shopUrl: null, pinUrl: null, featured: false },
  { id: 'p13', title: 'Out of Home', caption: 'Billboard plate.', src: '/img/billboard-plate.jpg', width: 1920, height: 1279, alt: 'Billboard out-of-home plate', category: 'brand', shopUrl: null, pinUrl: null, featured: false },
]
