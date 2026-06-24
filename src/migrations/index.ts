import * as migration_20260619_105217_baseline_2026_06_19 from './20260619_105217_baseline_2026_06_19';
import * as migration_20260619_161451_add_gallery_section from './20260619_161451_add_gallery_section';

export const migrations = [
  {
    up: migration_20260619_105217_baseline_2026_06_19.up,
    down: migration_20260619_105217_baseline_2026_06_19.down,
    name: '20260619_105217_baseline_2026_06_19',
  },
  {
    up: migration_20260619_161451_add_gallery_section.up,
    down: migration_20260619_161451_add_gallery_section.down,
    name: '20260619_161451_add_gallery_section'
  },
];
