import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

/** Sanity image URL builder. Respects hotspot/crop when available. */
export const urlFor = (source: SanityImageSource) => builder.image(source)
