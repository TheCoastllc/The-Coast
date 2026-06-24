import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Idempotent: in dev the column may already exist via push; SQLite has no
  // ADD COLUMN IF NOT EXISTS, so swallow the duplicate-column error.
  try {
    await db.run(sql`ALTER TABLE \`gallery\` ADD \`section\` text;`)
  } catch {
    /* column already present */
  }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`gallery_section_idx\` ON \`gallery\` (\`section\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`gallery_section_idx\`;`)
  await db.run(sql`ALTER TABLE \`gallery\` DROP COLUMN \`section\`;`)
}
