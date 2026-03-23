import * as migration_20260315_075841_add_contact_submissions from './20260315_075841_add_contact_submissions';
import * as migration_20260323_125300 from './20260323_125300';

export const migrations = [
  {
    up: migration_20260315_075841_add_contact_submissions.up,
    down: migration_20260315_075841_add_contact_submissions.down,
    name: '20260315_075841_add_contact_submissions',
  },
  {
    up: migration_20260323_125300.up,
    down: migration_20260323_125300.down,
    name: '20260323_125300'
  },
];
