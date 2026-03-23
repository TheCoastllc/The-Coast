import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`privacy_policy\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`last_updated\` text,
  	\`content\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`terms_of_service\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`last_updated\` text,
  	\`content\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`users\` ADD \`full_name\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`author_title\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`author_bio\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`author_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`privacy_policy\`;`)
  await db.run(sql`DROP TABLE \`terms_of_service\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`status\` text DEFAULT 'draft',
  	\`published_at\` text,
  	\`category\` text NOT NULL,
  	\`reading_time\` numeric,
  	\`excerpt\` text,
  	\`cover_image_id\` integer NOT NULL,
  	\`content\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_posts\`("id", "title", "slug", "status", "published_at", "category", "reading_time", "excerpt", "cover_image_id", "content", "updated_at", "created_at") SELECT "id", "title", "slug", "status", "published_at", "category", "reading_time", "excerpt", "cover_image_id", "content", "updated_at", "created_at" FROM \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts\` RENAME TO \`posts\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_cover_image_idx\` ON \`posts\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`full_name\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`author_title\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`author_bio\`;`)
}
