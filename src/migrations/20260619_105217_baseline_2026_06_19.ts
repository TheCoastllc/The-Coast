import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`full_name\` text,
  	\`role\` text DEFAULT 'member' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`cloudinary_public_id\` text,
  	\`cloudinary_resource_type\` text,
  	\`cloudinary_format\` text,
  	\`cloudinary_secure_url\` text,
  	\`cloudinary_bytes\` numeric,
  	\`cloudinary_created_at\` text,
  	\`cloudinary_version\` text,
  	\`cloudinary_version_id\` text,
  	\`cloudinary_width\` numeric,
  	\`cloudinary_height\` numeric,
  	\`cloudinary_duration\` numeric,
  	\`cloudinary_pages\` numeric,
  	\`cloudinary_selected_page\` numeric DEFAULT 1,
  	\`cloudinary_thumbnail_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`posts_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`posts_tags_order_idx\` ON \`posts_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`posts_tags_parent_id_idx\` ON \`posts_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`status\` text DEFAULT 'draft',
  	\`published_at\` text,
  	\`category\` text NOT NULL,
  	\`reading_time\` numeric,
  	\`direct_answer\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`cover_image_id\` integer NOT NULL,
  	\`content\` text NOT NULL,
  	\`author_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`posts_cover_image_idx\` ON \`posts\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`gallery_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`gallery_tags_order_idx\` ON \`gallery_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`gallery_tags_parent_id_idx\` ON \`gallery_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`gallery\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`image_id\` integer NOT NULL,
  	\`caption\` text,
  	\`category\` text,
  	\`shop_url\` text,
  	\`pin_url\` text,
  	\`featured\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`status\` text DEFAULT 'draft',
  	\`published_at\` text,
  	\`drive_file_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`gallery_slug_idx\` ON \`gallery\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`gallery_image_idx\` ON \`gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`gallery_drive_file_id_idx\` ON \`gallery\` (\`drive_file_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`gallery_updated_at_idx\` ON \`gallery\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`gallery_created_at_idx\` ON \`gallery\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`clients\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`better_auth_user_id\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`contact_name\` text NOT NULL,
  	\`business_name\` text NOT NULL,
  	\`logo_url\` text,
  	\`phone\` text,
  	\`status\` text DEFAULT 'active',
  	\`subscription_tier\` text,
  	\`website\` text,
  	\`industry\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`clients_better_auth_user_id_idx\` ON \`clients\` (\`better_auth_user_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`clients_email_idx\` ON \`clients\` (\`email\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_updated_at_idx\` ON \`clients\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`clients_created_at_idx\` ON \`clients\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`service_type\` text NOT NULL,
  	\`status\` text DEFAULT 'pending',
  	\`priority\` text,
  	\`due_date\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`projects_client_idx\` ON \`projects\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`project_files\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`project_id\` integer NOT NULL,
  	\`file_name\` text NOT NULL,
  	\`file_type\` text,
  	\`file_size\` numeric,
  	\`file_url\` text,
  	\`file_id\` integer,
  	\`status\` text DEFAULT 'pending_review',
  	\`client_feedback\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`project_files_project_idx\` ON \`project_files\` (\`project_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`project_files_file_idx\` ON \`project_files\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`project_files_updated_at_idx\` ON \`project_files\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`project_files_created_at_idx\` ON \`project_files\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`project_updates\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`project_id\` integer NOT NULL,
  	\`message\` text NOT NULL,
  	\`is_internal\` integer DEFAULT false,
  	\`created_by\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`project_updates_project_idx\` ON \`project_updates\` (\`project_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`project_updates_updated_at_idx\` ON \`project_updates\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`project_updates_created_at_idx\` ON \`project_updates\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`requests\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`service_type\` text,
  	\`priority\` text DEFAULT 'normal',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`requests_client_idx\` ON \`requests\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`requests_updated_at_idx\` ON \`requests\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`requests_created_at_idx\` ON \`requests\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`intake_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`full_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`business_name\` text NOT NULL,
  	\`website\` text,
  	\`business_description\` text NOT NULL,
  	\`ideal_customer\` text,
  	\`services_interested\` text,
  	\`brand_vibes\` text,
  	\`color_preferences\` text,
  	\`colors_to_avoid\` text,
  	\`brands_admired\` text,
  	\`budget\` text,
  	\`timeline\` text,
  	\`additional_vision\` text,
  	\`sms_consent_transactional\` integer DEFAULT false,
  	\`sms_consent_marketing\` integer DEFAULT false,
  	\`sms_consent_at\` text,
  	\`sms_consent_text\` text,
  	\`consent_source\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`intake_submissions_updated_at_idx\` ON \`intake_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`intake_submissions_created_at_idx\` ON \`intake_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`event_intake_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`contact_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`event_name\` text NOT NULL,
  	\`event_type\` text,
  	\`event_date\` text,
  	\`event_location\` text,
  	\`expected_attendees\` text,
  	\`services_needed\` text,
  	\`budget\` text,
  	\`timeline\` text,
  	\`event_description\` text NOT NULL,
  	\`additional_notes\` text,
  	\`sms_consent_transactional\` integer DEFAULT false,
  	\`sms_consent_marketing\` integer DEFAULT false,
  	\`sms_consent_at\` text,
  	\`sms_consent_text\` text,
  	\`consent_source\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`event_intake_submissions_updated_at_idx\` ON \`event_intake_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`event_intake_submissions_created_at_idx\` ON \`event_intake_submissions\` (\`created_at\`);`)
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
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`tool_submissions\` (
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
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`tool_submissions_updated_at_idx\` ON \`tool_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`tool_submissions_created_at_idx\` ON \`tool_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`posts_id\` integer,
  	\`gallery_id\` integer,
  	\`clients_id\` integer,
  	\`projects_id\` integer,
  	\`project_files_id\` integer,
  	\`project_updates_id\` integer,
  	\`requests_id\` integer,
  	\`intake_submissions_id\` integer,
  	\`event_intake_submissions_id\` integer,
  	\`contact_submissions_id\` integer,
  	\`tool_submissions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gallery_id\`) REFERENCES \`gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`project_files_id\`) REFERENCES \`project_files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`project_updates_id\`) REFERENCES \`project_updates\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`requests_id\`) REFERENCES \`requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`intake_submissions_id\`) REFERENCES \`intake_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`event_intake_submissions_id\`) REFERENCES \`event_intake_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contact_submissions_id\`) REFERENCES \`contact_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tool_submissions_id\`) REFERENCES \`tool_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_gallery_id_idx\` ON \`payload_locked_documents_rels\` (\`gallery_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_project_files_id_idx\` ON \`payload_locked_documents_rels\` (\`project_files_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_project_updates_id_idx\` ON \`payload_locked_documents_rels\` (\`project_updates_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`requests_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_intake_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`intake_submissions_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_event_intake_submissions_i_idx\` ON \`payload_locked_documents_rels\` (\`event_intake_submissions_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_contact_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_submissions_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_tool_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`tool_submissions_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`privacy_policy\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`last_updated\` text,
  	\`content\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`terms_of_service\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`last_updated\` text,
  	\`content\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`category\` text DEFAULT 'general',
  	\`published\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`faq_items_order_idx\` ON \`faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`faq_items_parent_id_idx\` ON \`faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`faq\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`trusted_by_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`wordmark\` text,
  	\`category\` text,
  	\`year\` numeric,
  	\`case_study_slug\` text,
  	\`logo_id\` integer,
  	\`url\` text,
  	\`published\` integer DEFAULT true,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`trusted_by\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`trusted_by_items_order_idx\` ON \`trusted_by_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`trusted_by_items_parent_id_idx\` ON \`trusted_by_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`trusted_by_items_logo_idx\` ON \`trusted_by_items\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`trusted_by\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`gallery_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pinterest_url\` text DEFAULT 'https://pin.it/nW5MRvKEz',
  	\`shopify_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`users_sessions\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`users\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`media\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`posts_tags\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`posts\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`gallery_tags\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`gallery\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`clients\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`projects\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`project_files\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`project_updates\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`requests\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`intake_submissions\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`event_intake_submissions\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`contact_submissions\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`tool_submissions\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`payload_kv\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`privacy_policy\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`terms_of_service\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`faq_items\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`faq\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`trusted_by_items\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`trusted_by\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`gallery_settings\`;`)
}
