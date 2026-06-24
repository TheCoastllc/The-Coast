/**
 * Minimal Google Drive reader for the gallery auto-sync.
 *
 * Auth: a service account (read-only Drive scope). The service-account key JSON
 * is read from GOOGLE_SERVICE_ACCOUNT_JSON (raw JSON or base64-encoded). The
 * Drive folder must be shared with the service account's email (Viewer).
 * Server-only - imported from the cron route, which forces the nodejs runtime.
 */
import { drive as driveApi, auth as googleAuth, type drive_v3 } from '@googleapis/drive'

export type DriveImage = { id: string; name: string; mimeType: string }
export type DriveFolder = { id: string; name: string }
export type DriveChild = { id: string; name: string; mimeType: string }

let cached: drive_v3.Drive | null = null

/** List ALL non-trashed children (folders, images, shortcuts, ...) - for diagnostics. */
export async function listChildren(folderId: string): Promise<DriveChild[]> {
  const drive = getDrive()
  const out: DriveChild[] = []
  let pageToken: string | undefined
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'nextPageToken, files(id,name,mimeType)',
      pageSize: 1000,
      orderBy: 'folder,name',
      pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    })
    for (const f of res.data.files ?? []) {
      if (f.id && f.name && f.mimeType) out.push({ id: f.id, name: f.name, mimeType: f.mimeType })
    }
    pageToken = res.data.nextPageToken ?? undefined
  } while (pageToken)
  return out
}

function getDrive(): drive_v3.Drive {
  if (cached) return cached
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set')
  const json = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')
  const credentials = JSON.parse(json)
  const auth = new googleAuth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
  cached = driveApi({ version: 'v3', auth })
  return cached
}

/** List non-trashed subfolders directly inside the folder (each becomes a gallery section). */
export async function listSubfolders(folderId: string): Promise<DriveFolder[]> {
  const drive = getDrive()
  const out: DriveFolder[] = []
  let pageToken: string | undefined
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
      fields: 'nextPageToken, files(id,name)',
      pageSize: 1000,
      orderBy: 'name',
      pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    })
    for (const f of res.data.files ?? []) {
      if (f.id && f.name) out.push({ id: f.id, name: f.name })
    }
    pageToken = res.data.nextPageToken ?? undefined
  } while (pageToken)
  return out
}

/** List every non-trashed image file directly inside the folder (paginated). */
export async function listFolderImages(folderId: string): Promise<DriveImage[]> {
  const drive = getDrive()
  const out: DriveImage[] = []
  let pageToken: string | undefined
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
      fields: 'nextPageToken, files(id,name,mimeType)',
      pageSize: 1000,
      orderBy: 'createdTime',
      pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    })
    for (const f of res.data.files ?? []) {
      if (f.id && f.name && f.mimeType) out.push({ id: f.id, name: f.name, mimeType: f.mimeType })
    }
    pageToken = res.data.nextPageToken ?? undefined
  } while (pageToken)
  return out
}

/** Download a Drive file's raw bytes. */
export async function downloadDriveFile(fileId: string): Promise<Buffer> {
  const drive = getDrive()
  const res = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' },
  )
  return Buffer.from(res.data as unknown as ArrayBuffer)
}
