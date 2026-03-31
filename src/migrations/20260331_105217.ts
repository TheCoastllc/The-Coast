import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`tool_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`company\` text,
  	\`role\` text,
  	\`tool\` text NOT NULL,
  	\`score\` numeric,
  	\`result_tier\` text,
  	\`answers\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`tool_submissions_updated_at_idx\` ON \`tool_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tool_submissions_created_at_idx\` ON \`tool_submissions\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`tool_submissions_id\` integer REFERENCES tool_submissions(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tool_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`tool_submissions_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`author_title\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`author_bio\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`tool_submissions\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`posts_id\` integer,
  	\`clients_id\` integer,
  	\`projects_id\` integer,
  	\`project_files_id\` integer,
  	\`project_updates_id\` integer,
  	\`requests_id\` integer,
  	\`intake_submissions_id\` integer,
  	\`event_intake_submissions_id\` integer,
  	\`google_reviews_id\` integer,
  	\`contact_submissions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`project_files_id\`) REFERENCES \`project_files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`project_updates_id\`) REFERENCES \`project_updates\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`requests_id\`) REFERENCES \`requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`intake_submissions_id\`) REFERENCES \`intake_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`event_intake_submissions_id\`) REFERENCES \`event_intake_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`google_reviews_id\`) REFERENCES \`google_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contact_submissions_id\`) REFERENCES \`contact_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "clients_id", "projects_id", "project_files_id", "project_updates_id", "requests_id", "intake_submissions_id", "event_intake_submissions_id", "google_reviews_id", "contact_submissions_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "clients_id", "projects_id", "project_files_id", "project_updates_id", "requests_id", "intake_submissions_id", "event_intake_submissions_id", "google_reviews_id", "contact_submissions_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_project_files_id_idx\` ON \`payload_locked_documents_rels\` (\`project_files_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_project_updates_id_idx\` ON \`payload_locked_documents_rels\` (\`project_updates_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`requests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_intake_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`intake_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_event_intake_submissions_i_idx\` ON \`payload_locked_documents_rels\` (\`event_intake_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_google_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`google_reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contact_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_submissions_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`author_title\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`author_bio\` text;`)
}
