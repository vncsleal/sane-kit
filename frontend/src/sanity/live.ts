import { defineLive } from 'next-sanity/live'

import { client } from './client'
import { readToken } from './env'

/**
 * Live Content API binding. `sanityFetch` returns `{ data, ... }` and handles
 * caching, revalidation, stega and draft/published perspectives automatically.
 * `SanityLive` streams content updates into the UI.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken ?? false,
  browserToken: readToken ?? false,
})
