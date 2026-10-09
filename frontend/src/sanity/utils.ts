import { createDataAttribute, type CreateDataAttributeProps } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'

import { dataset, projectId, studioUrl } from './env'
import { urlFor } from './image'

/** Resolve an Open Graph image (`fit: 'crop'`), respecting hotspot. */
export function resolveOpenGraphImage(
  image?: SanityImageSource | null,
  width = 1200,
  height = 630,
) {
  if (!image) return
  const url = urlFor(image).width(width).height(height).fit('crop').url()
  if (!url) return
  return { url, alt: (image as { alt?: string })?.alt || '', width, height }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

/**
 * Content Source Map attribute for **hardcoded** elements, so they become
 * click-to-edit in the Presentation tool (stega only covers Sanity strings).
 * https://www.sanity.io/docs/visual-editing/visual-editing-overlays
 */
export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({ projectId, dataset, baseUrl: studioUrl }).combine(config).toString()
}
