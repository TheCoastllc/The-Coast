import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`contact_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`contact_submissions_updated_at_idx\` ON \`contact_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`contact_submissions_created_at_idx\` ON \`contact_submissions\` (\`created_at\`);`)

  // Add contact_submissions_id column to payload_locked_documents_rels if it doesn't exist
  try {
    await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`contact_submissions_id\` integer REFERENCES \`contact_submissions\`(\`id\`) ON DELETE cascade;`)
  } catch {
    // Column may already exist from dev mode
  }
  try {
    await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_contact_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_submissions_id\`);`)
  } catch {
    // Index may already exist
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`contact_submissions\`;`)
}
