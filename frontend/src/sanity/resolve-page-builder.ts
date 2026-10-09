import 'server-only'

import { stegaClean } from 'next-sanity'

import type { Locale } from '@/i18n/i18n-config'

import { sanityFetch } from './live'
import type { PageBuilderSection, ResolvedSectionData } from './page-builder'
import { BLOG_POSTS_QUERY, COMPARE_FEATURES_QUERY } from './queries'

/**
 * Resolves the referenced documents for every page-builder section that needs
 * them — blog posts and compare-features titles — keyed by the section `_key`.
 *
 * Runs on the server so the client page builder receives plain, serializable
 * data. See {@link ResolvedSectionData} for why this is passed out-of-band.
 */
export async function resolvePageBuilderData(
  sections: PageBuilderSection[],
  locale: Locale,
): Promise<Record<string, ResolvedSectionData>> {
  const entries = await Promise.all(
    sections.map(async (section): Promise<[string, ResolvedSectionData] | null> => {
      switch (section._type) {
        case 'blogSection': {
          const variant = stegaClean(section.variant)
          const end = section.postsToShow ?? (variant === 'grid' ? 6 : 3)
          const { data } = await sanityFetch({
            query: BLOG_POSTS_QUERY,
            params: {
              language: locale,
              featuredOnly: stegaClean(section.featuredPostsOnly) === 'true',
              start: 0,
              end,
            },
          })
          return [section._key, { posts: data ?? [] }]
        }
        case 'compareFeaturesSection': {
          const refs = section.features ?? []
          const ids = refs
            .map((feature) => feature._ref)
            .filter((ref): ref is string => Boolean(ref))
          const { data } = await sanityFetch({
            query: COMPARE_FEATURES_QUERY,
            params: { ids },
          })
          const features = refs.map((feature) => ({
            _id: feature._ref ?? '',
            _key: feature._key || `feature-${feature._ref}`,
            title:
              data?.find((result) => result._id === feature._ref)?.title ||
              `Feature not found (${feature._ref?.slice(0, 8)})`,
          }))
          return [section._key, { features }]
        }
        default:
          return null
      }
    }),
  )

  return Object.fromEntries(
    entries.filter((entry): entry is [string, ResolvedSectionData] => entry !== null),
  )
}
