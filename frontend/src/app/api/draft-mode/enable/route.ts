import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import type { NextRequest } from 'next/server'

import { client } from '@/sanity/client'
import { readToken } from '@/sanity/env.server'

// `defineEnableDraftMode` requires an authenticated client. When the read token
// is absent we return a clear 501 instead of throwing a 500.
const draftMode = readToken
  ? defineEnableDraftMode({ client: client.withConfig({ token: readToken }) })
  : null

export function GET(request: NextRequest) {
  if (!draftMode) {
    return new Response('SANITY_API_READ_TOKEN is not configured', { status: 501 })
  }
  return draftMode.GET(request)
}
