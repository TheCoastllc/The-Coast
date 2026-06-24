import { getPayload, type Where } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { listSubfolders, listFolderImages, listChildren, downloadDriveFile, type DriveImage } from '@/lib/drive'

/**
 * GET /api/sync-gallery-from-drive
 *
 * Imports images from a Google Drive folder into the published gallery, with one
 * SECTION per subfolder (the subfolder's name). Images sitting directly in the
 * main folder import as an ungrouped section. Triggered daily by the Vercel Cron
 * in vercel.json (Vercel sends the Authorization: Bearer CRON_SECRET header).
 * Idempotent: each item stores its Drive file id, so re-runs skip imported files.
 *
 *   ?reset=true  ->  delete ALL existing gallery items first (a clean re-sync).
 *
 * Manual: curl -H "Authorization: Bearer <CRON_SECRET>" "<url>/api/sync-gallery-from-drive?reset=true"
 */
export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

const MAX_PER_RUN = 500 // safety backstop; the time budget below is the real limit
const TIME_BUDGET_MS = 250_000 // stop starting new files before the 300s function limit

const cleanTitle = (filename: string): string =>
  filename
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Untitled'

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/['‘’"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!folderId) {
    return Response.json({ error: 'GOOGLE_DRIVE_FOLDER_ID not set' }, { status: 500 })
  }

  const reset = new URL(request.url).searchParams.get('reset') === 'true'
  const inspect = new URL(request.url).searchParams.get('inspect') === 'true'

  const start = Date.now()
  let imported = 0
  let updated = 0
  let skipped = 0
  let deleted = 0
  const failed: string[] = []

  try {
    // Diagnostic: show exactly what the service account sees inside the folder
    // (subfolder names, and a breakdown of every child type) without importing.
    if (inspect) {
      const children = await listChildren(folderId)
      const byType: Record<string, number> = {}
      for (const c of children) byType[c.mimeType] = (byType[c.mimeType] ?? 0) + 1
      const folders = children
        .filter((c) => c.mimeType === 'application/vnd.google-apps.folder')
        .map((c) => ({ name: c.name, id: c.id }))
      return Response.json({
        ok: true,
        inspect: true,
        folderId,
        childCount: children.length,
        subfolders: folders,
        byType,
        sampleNames: children.slice(0, 25).map((c) => c.name),
      })
    }

    const payload = await getPayload({ config: configPromise })

    const exists = async (where: Where): Promise<boolean> =>
      (await payload.find({ collection: 'gallery', where, limit: 1, depth: 0, overrideAccess: true })).docs
        .length > 0

    // Plan: each subfolder is a section; loose images in the main folder are an
    // ungrouped section (section = null). Listing is metadata-only and fast.
    const subfolders = await listSubfolders(folderId)
    const plan: { section: string | null; files: DriveImage[] }[] = []
    const loose = await listFolderImages(folderId)
    if (loose.length) plan.push({ section: null, files: loose })
    for (const sf of subfolders) {
      const files = await listFolderImages(sf.id)
      if (files.length) plan.push({ section: sf.name, files })
    }
    const totalFiles = plan.reduce((n, p) => n + p.files.length, 0)

    // Fresh re-sync: wipe existing items first - but only once we've actually found
    // images to import, so a not-yet-shared folder (0 files) can't empty the gallery.
    if (reset && totalFiles > 0) {
      const res = await payload.delete({
        collection: 'gallery',
        where: { id: { exists: true } },
        overrideAccess: true,
      })
      deleted = Array.isArray((res as { docs?: unknown[] })?.docs) ? (res as { docs: unknown[] }).docs.length : 0
    }

    let timedOut = false
    outer: for (const unit of plan) {
      let order = 0
      for (const file of unit.files) {
        if (imported >= MAX_PER_RUN || Date.now() - start > TIME_BUDGET_MS) {
          timedOut = true
          break outer
        }
        try {
          // Already imported: keep the file but re-assign its section/order if the
          // Drive folder was renamed or the image was moved. No re-download.
          const found = await payload.find({
            collection: 'gallery',
            where: { driveFileId: { equals: file.id } },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          })
          if (found.docs.length) {
            const doc = found.docs[0] as { id: string | number; section?: string | null; order?: number }
            if ((doc.section ?? null) !== unit.section || doc.order !== order) {
              await payload.update({
                collection: 'gallery',
                id: doc.id,
                data: { section: unit.section, order },
                overrideAccess: true,
              })
              updated++
            } else {
              skipped++
            }
            order++
            continue
          }
          // beforeChange forces slug = slugify(title), so the TITLE must be unique.
          const base = cleanTitle(file.name)
          let title = base
          let n = 1
          while (await exists({ slug: { equals: slugify(title) } })) {
            n += 1
            title = `${base} ${n}`
          }
          const buffer = await downloadDriveFile(file.id)
          const media = await payload.create({
            collection: 'media',
            data: { alt: title },
            file: { data: buffer, mimetype: file.mimeType, name: file.name, size: buffer.length },
            overrideAccess: true,
          })
          await payload.create({
            collection: 'gallery',
            data: {
              title,
              image: media.id,
              driveFileId: file.id,
              section: unit.section,
              order,
              status: 'published',
            },
            overrideAccess: true,
          })
          imported++
          order++
        } catch (e) {
          failed.push(`${file.name}: ${e instanceof Error ? e.message : String(e)}`)
          order++
        }
      }
    }

    if (imported > 0 || updated > 0 || deleted > 0) {
      try {
        revalidatePath('/gallery')
      } catch {
        // best-effort
      }
    }

    const remaining = Math.max(0, totalFiles - skipped - imported - updated - failed.length)
    return Response.json({
      ok: true,
      reset,
      deleted,
      subfolders: subfolders.length,
      total: totalFiles,
      imported,
      updated,
      skipped,
      failed,
      sections: plan.map((u) => ({ name: u.section ?? '(ungrouped)', count: u.files.length })),
      remaining,
      timedOut,
      ...(timedOut || remaining > 0
        ? { note: 'Re-run WITHOUT ?reset to import the rest (idempotent).' }
        : {}),
    })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
