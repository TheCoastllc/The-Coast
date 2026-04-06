import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Cached Payload instance — avoids re-initializing on every call.
 * `getPayload` internally caches after first init, but this ensures
 * the config resolution is also cached via module-level promise.
 */
const payloadClientPromise = getPayload({ config: configPromise })

export function getPayloadClient() {
  return payloadClientPromise
}
