import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '@/sanity/client'
import { token } from '@/sanity/token'

/**
 * Enables draft mode. Referenced by `presentationTool.previewUrl.previewMode.enable`
 * in the Studio config.
 * https://github.com/sanity-io/next-sanity#5-integrating-with-sanity-presentation-tool--visual-editing
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
})
