import {cookies, draftMode} from 'next/headers'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from 'next-sanity/live'

import {client} from './client'
import {token} from './token'

/**
 * Automatic revalidation and refreshing of fetched content.
 * https://github.com/sanity-io/next-sanity#1-configure-definelive
 *
 * `strict: true` requires every `sanityFetch` call to pass `perspective` and
 * `stega`, and `<SanityLive />` to receive `includeDrafts`. That is the explicit
 * data flow Cache Components needs: request-time values are resolved outside a
 * `'use cache'` boundary and passed into the cached fetch.
 */
export const {sanityFetch, SanityLive} = defineLive({
  client,
  // Required for showing draft content when the Presentation Tool is used.
  serverToken: token,
  // Only shared to the browser during a valid Next.js Draft Mode session.
  browserToken: token,
  strict: true,
})

/**
 * The app's single `'use cache'` boundary.
 *
 * `sanityFetch` tags and lifetimes its own result but does not create the cache
 * boundary, so this wrapper provides it once and every caller shares it.
 */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch(options)
}

/**
 * Request-scoped options that `cachedSanity` needs but must never resolve inside
 * a `'use cache'` boundary.
 *
 * `perspective` and `stega` are required by `strict: true`; `stega: false` is
 * only used for the published path so the returned data keeps clean TypeGen
 * types.
 */
export interface DynamicFetchOptions {
  perspective: LivePerspective
  variant?: string
  stega: boolean
}

/**
 * Resolves the perspective, variant and stega flag for the current request.
 *
 * `draftMode()` and `cookies()` are request-time APIs, so this runs outside any
 * `'use cache'` boundary and its result is passed into `cachedSanity`.
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return {perspective: 'published', stega: false}
  }

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  const variant = await resolveVariantFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', variant, stega: true}
}
