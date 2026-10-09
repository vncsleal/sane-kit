import { stegaClean } from 'next-sanity'

import type { ExtractPageBuilderType } from '@/sanity/page-builder'
import type { Locale } from '@/i18n/i18n-config'
import { sanityFetch } from '@/sanity/live'
import { BLOG_POSTS_QUERY } from '@/sanity/queries'

import type { BlogPostWithData } from './shared'
import Default from './default'
import Grid from './grid'

export type BlogSectionComponentProps = ExtractPageBuilderType<'blogSection'> & {
  locale: Locale
}

/**
 * Server component: fetches the posts with `sanityFetch` and hands them to the
 * presentational variant. Mirrors the official page-builder pattern (no
 * client-side fetching).
 */
export default async function BlogSectionComponent(props: BlogSectionComponentProps) {
  const { variant = 'default', postsToShow, featuredPostsOnly = 'false', locale } = props
  const cleanVariant = stegaClean(variant)
  const end = postsToShow ?? (cleanVariant === 'grid' ? 6 : 3)

  const { data } = await sanityFetch({
    query: BLOG_POSTS_QUERY,
    params: {
      language: locale,
      featuredOnly: stegaClean(featuredPostsOnly) === 'true',
      start: 0,
      end,
    },
  })
  const posts: BlogPostWithData[] = data ?? []

  switch (cleanVariant) {
    case 'grid':
      return <Grid {...props} posts={posts} />
    default:
      return <Default {...props} posts={posts} />
  }
}

export type { BlogPostWithData }
