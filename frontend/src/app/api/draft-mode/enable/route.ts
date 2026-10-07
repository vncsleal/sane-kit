import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '@/sanity/client'
import { readToken } from '@/sanity/env.server'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken ?? '' }),
})
