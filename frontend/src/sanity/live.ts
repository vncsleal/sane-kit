import {defineLive} from 'next-sanity/live'

import {client} from './client'
import {token} from './token'

/**
 * Automatic revalidation and refreshing of fetched content.
 * https://github.com/sanity-io/next-sanity#1-configure-definelive
 */
export const {sanityFetch, SanityLive} = defineLive({
  client,
  // Required for showing draft content when the Presentation Tool is used.
  serverToken: token,
  // Only shared to the browser during a valid Next.js Draft Mode session.
  browserToken: token,
})
