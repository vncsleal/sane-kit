import 'server-only'

import {stegaClean} from 'next-sanity'

import type {Locale} from '@/i18n/i18n-config'

import {cachedSanity, type DynamicFetchOptions} from './live'
import type {PageBuilderSection, ResolvedSectionData} from './page-builder'
import {BLOG_POSTS_QUERY, COMPARE_FEATURES_QUERY} from './queries'

/**
 * Resolves the referenced documents for every page-builder section that needs
 * them — blog posts and compare-features titles — keyed by the section `_key`.
 *
 * Runs on the server so the client page builder receives plain, serializable
 * data. See {@link ResolvedSectionData} for why this is passed out-of-band.
 *
 * `options` carries the request's perspective/variant/stega so the fetched
 * content matches the page that requested it (published vs drafts).
 */
export async function resolvePageBuilderData(
  sections: PageBuilderSection[],
  locale: Locale,
  options: DynamicFetchOptions,
): Promise<Record<string, ResolvedSectionData>> {
  const {perspective, variant, stega} = options
  const entries = await Promise.all(
    sections.map(async (section): Promise<[string, ResolvedSectionData] | null> => {
      switch (section._type) {
        case 'blogSection': {
          const sectionVariant = stegaClean(section.variant)
          const end = section.postsToShow ?? (sectionVariant === 'grid' ? 6 : 3)
          const {data} = await cachedSanity({
            query: BLOG_POSTS_QUERY,
            params: {
              language: locale,
              featuredOnly: section.featuredPostsOnly === true,
              start: 0,
              end,
            },
            perspective,
            variant,
            stega,
          })
          return [section._key, {posts: data ?? []}]
        }
        case 'compareFeaturesSection': {
          const refs = section.features ?? []
          const ids = refs
            .map((feature) => feature._ref)
            .filter((ref): ref is string => Boolean(ref))
          const {data} = await cachedSanity({
            query: COMPARE_FEATURES_QUERY,
            params: {ids},
            perspective,
            variant,
            stega,
          })
          const features = refs.map((feature) => ({
            _id: feature._ref ?? '',
            _key: feature._key || `feature-${feature._ref}`,
            title:
              data?.find((result) => result._id === feature._ref)?.title ||
              `Feature not found (${feature._ref?.slice(0, 8)})`,
          }))
          return [section._key, {features}]
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
