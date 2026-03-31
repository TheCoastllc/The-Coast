import * as migration_20260315_075841_add_contact_submissions from './20260315_075841_add_contact_submissions';
import * as migration_20260323_125300 from './20260323_125300';
import * as migration_20260331_105217 from './20260331_105217';

export const migrations = [
  {
    up: migration_20260315_075841_add_contact_submissions.up,
    down: migration_20260315_075841_add_contact_submissions.down,
    name: '20260315_075841_add_contact_submissions',
  },
  {
    up: migration_20260323_125300.up,
    down: migration_20260323_125300.down,
    name: '20260323_125300',
  },
  {
    up: migration_20260331_105217.up,
    down: migration_20260331_105217.down,
    name: '20260331_105217'
  },
];
