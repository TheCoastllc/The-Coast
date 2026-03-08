/**
 * One-time migration script: Supabase → Payload + Better Auth
 *
 * Usage:
 *   npx tsx scripts/migrate-from-supabase.ts
 *
 * Required env vars:
 *   SUPABASE_URL          — Supabase project URL
 *   SUPABASE_SERVICE_KEY  — Supabase service role key (not anon key)
 *   DATABASE_URL          — Turso/SQLite connection string (same as Payload)
 *   BETTER_AUTH_SECRET    — Better Auth secret
 *   BETTER_AUTH_URL       — Better Auth base URL
 *
 * This script:
 *   1. Reads all data from Supabase tables
 *   2. Creates Better Auth users for each Supabase auth user linked to a client
 *   3. Creates corresponding Payload documents with mapped fields
 *   4. Preserves relationships via ID mapping
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { getPayload } from 'payload'
import { importConfig } from 'payload/node'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ID mappings: Supabase UUID → Payload numeric ID
const clientIdMap = new Map<string, number>()
const projectIdMap = new Map<string, number>()

async function main() {
  console.log('Starting Supabase → Payload migration...\n')

  const config = await importConfig('../src/payload.config.ts')
  const payload = await getPayload({ config })

  // 1. Migrate Google Reviews
  console.log('--- Migrating Google Reviews ---')
  const { data: reviews } = await supabase
    .from('google_reviews')
    .select('*')
    .order('display_order', { ascending: true })

  if (reviews?.length) {
    for (const r of reviews) {
      try {
        await payload.create({
          collection: 'google-reviews',
          data: {
            name: r.name,
            initial: r.initial,
            color: r.color,
            category: r.category,
            text: r.text,
            rating: r.rating,
            displayOrder: r.display_order,
          },
          overrideAccess: true,
        })
        console.log(`  Created review: ${r.name}`)
      } catch (err) {
        console.error(`  Failed review ${r.name}:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No reviews found')
  }

  // 2. Migrate Clients + create Better Auth users
  console.log('\n--- Migrating Clients ---')
  const { data: clients } = await supabase.from('clients').select('*')

  if (clients?.length) {
    for (const c of clients) {
      try {
        // Create Better Auth user if client has an auth_id
        let betterAuthUserId: string | undefined
        if (c.auth_id) {
          // Get the Supabase auth user to get their email
          const { data: authUser } = await supabase.auth.admin.getUserById(c.auth_id)
          if (authUser?.user) {
            // Create user in Better Auth via the API
            const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: authUser.user.email,
                password: 'TemporaryPassword123!', // Users will need to reset
                name: c.contact_name || c.business_name || '',
              }),
            })
            if (res.ok) {
              const data = await res.json()
              betterAuthUserId = data.user?.id
              console.log(`  Created Better Auth user for: ${authUser.user.email}`)
            } else {
              console.error(`  Failed to create Better Auth user for ${authUser.user.email}: ${res.status}`)
            }
          }
        }

        const doc = await payload.create({
          collection: 'clients',
          data: {
            email: c.email,
            contactName: c.contact_name || '',
            businessName: c.business_name || '',
            phone: c.phone || '',
            status: c.status || 'active',
            subscriptionTier: c.subscription_tier || '',
            website: c.website || '',
            industry: c.industry || '',
            logoUrl: c.logo_url || '',
            notes: c.notes || '',
            ...(betterAuthUserId ? { betterAuthUserId } : {}),
          },
          overrideAccess: true,
        })
        clientIdMap.set(c.id, doc.id)
        console.log(`  Migrated client: ${c.contact_name || c.email} (${c.id} → ${doc.id})`)
      } catch (err) {
        console.error(`  Failed client ${c.email}:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No clients found')
  }

  // 3. Migrate Projects
  console.log('\n--- Migrating Projects ---')
  const { data: projects } = await supabase.from('projects').select('*')

  if (projects?.length) {
    for (const p of projects) {
      try {
        const clientId = clientIdMap.get(p.client_id)
        if (!clientId) {
          console.warn(`  Skipping project "${p.title}" — client ${p.client_id} not found in mapping`)
          continue
        }

        const doc = await payload.create({
          collection: 'projects',
          data: {
            client: clientId,
            title: p.title,
            description: p.description || '',
            serviceType: p.service_type || 'other',
            status: (p.status || 'pending').replace(/ /g, '_'),
            priority: p.priority || 'normal',
            dueDate: p.due_date || undefined,
          },
          overrideAccess: true,
        })
        projectIdMap.set(p.id, doc.id)
        console.log(`  Migrated project: ${p.title} (${p.id} → ${doc.id})`)
      } catch (err) {
        console.error(`  Failed project ${p.title}:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No projects found')
  }

  // 4. Migrate Project Files
  console.log('\n--- Migrating Project Files ---')
  const { data: files } = await supabase.from('project_files').select('*')

  if (files?.length) {
    for (const f of files) {
      try {
        const projectId = projectIdMap.get(f.project_id)
        if (!projectId) {
          console.warn(`  Skipping file "${f.file_name}" — project ${f.project_id} not found in mapping`)
          continue
        }

        await payload.create({
          collection: 'project-files',
          data: {
            project: projectId,
            fileName: f.file_name,
            fileType: f.file_type || '',
            fileSize: f.file_size || 0,
            fileUrl: f.file_url || '',
            status: (f.status || 'pending_review').replace(/ /g, '_'),
            clientFeedback: f.client_feedback || '',
          },
          overrideAccess: true,
        })
        console.log(`  Migrated file: ${f.file_name}`)
      } catch (err) {
        console.error(`  Failed file ${f.file_name}:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No project files found')
  }

  // 5. Migrate Project Updates
  console.log('\n--- Migrating Project Updates ---')
  const { data: updates } = await supabase.from('project_updates').select('*').order('created_at')

  if (updates?.length) {
    for (const u of updates) {
      try {
        const projectId = projectIdMap.get(u.project_id)
        if (!projectId) {
          console.warn(`  Skipping update — project ${u.project_id} not found in mapping`)
          continue
        }

        await payload.create({
          collection: 'project-updates',
          data: {
            project: projectId,
            message: u.message,
            isInternal: u.is_internal ?? false,
            createdBy: u.created_by || '',
          },
          overrideAccess: true,
        })
        console.log(`  Migrated update for project ${projectId}`)
      } catch (err) {
        console.error(`  Failed update:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No project updates found')
  }

  // 6. Migrate Requests
  console.log('\n--- Migrating Requests ---')
  const { data: requests } = await supabase.from('requests').select('*')

  if (requests?.length) {
    for (const r of requests) {
      try {
        const clientId = clientIdMap.get(r.client_id)
        if (!clientId) {
          console.warn(`  Skipping request "${r.title}" — client ${r.client_id} not found in mapping`)
          continue
        }

        await payload.create({
          collection: 'requests',
          data: {
            client: clientId,
            title: r.title,
            description: r.description || '',
            serviceType: r.service_type || 'other',
            priority: r.priority || 'normal',
          },
          overrideAccess: true,
        })
        console.log(`  Migrated request: ${r.title}`)
      } catch (err) {
        console.error(`  Failed request ${r.title}:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No requests found')
  }

  // 7. Migrate Intake Submissions
  console.log('\n--- Migrating Intake Submissions ---')
  const { data: intakes } = await supabase.from('intake_submissions').select('*')

  if (intakes?.length) {
    for (const i of intakes) {
      try {
        await payload.create({
          collection: 'intake-submissions',
          data: {
            fullName: i.full_name,
            email: i.email,
            phone: i.phone || '',
            businessName: i.business_name || '',
            website: i.website || '',
            businessDescription: i.business_description || '',
            idealCustomer: i.ideal_customer || '',
            servicesInterested: i.services_interested || [],
            brandVibes: i.brand_vibes || [],
            colorPreferences: i.color_preferences || [],
            colorsToAvoid: i.colors_to_avoid || '',
            brandsAdmired: i.brands_admired || '',
            budget: i.budget || '',
            timeline: i.timeline || '',
            additionalVision: i.additional_vision || '',
          },
          overrideAccess: true,
        })
        console.log(`  Migrated intake: ${i.full_name}`)
      } catch (err) {
        console.error(`  Failed intake ${i.full_name}:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No intake submissions found')
  }

  // 8. Migrate Event Intake Submissions
  console.log('\n--- Migrating Event Intake Submissions ---')
  const { data: events } = await supabase.from('event_intake_submissions').select('*')

  if (events?.length) {
    for (const e of events) {
      try {
        await payload.create({
          collection: 'event-intake-submissions',
          data: {
            contactName: e.contact_name,
            email: e.email,
            phone: e.phone || '',
            eventName: e.event_name,
            eventType: e.event_type || '',
            eventDate: e.event_date || '',
            eventLocation: e.event_location || '',
            expectedAttendees: e.expected_attendees || '',
            servicesNeeded: e.services_needed || [],
            budget: e.budget || '',
            timeline: e.timeline || '',
            eventDescription: e.event_description || '',
            additionalNotes: e.additional_notes || '',
          },
          overrideAccess: true,
        })
        console.log(`  Migrated event intake: ${e.contact_name}`)
      } catch (err) {
        console.error(`  Failed event intake ${e.contact_name}:`, (err as Error).message)
      }
    }
  } else {
    console.log('  No event intake submissions found')
  }

  // Summary
  console.log('\n=== Migration Complete ===')
  console.log(`Clients mapped:  ${clientIdMap.size}`)
  console.log(`Projects mapped: ${projectIdMap.size}`)
  console.log('\nIMPORTANT: All migrated users have temporary passwords.')
  console.log('Send password reset emails to each client so they can set new passwords.')

  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
