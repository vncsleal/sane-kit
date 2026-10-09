import type { StegaBranded, StegaCleaned } from '@sanity/client/stega'

import type { BLOG_POSTS_QUERY_RESULT, PAGE_QUERY_RESULT } from './types'

/**
 * Accepts both clean and stega-branded `sanityFetch` results.
 *
 * `sanityFetch` brands string fields with stega types unless the literal
 * `stega: false` is passed, so any prop that receives fetched content is typed
 * with this union. `_type`, `_key` and slugs stay literal, which keeps
 * discriminated unions narrowable.
 */
export type StegaAware<T> = StegaCleaned<T> | StegaBranded<T>

/**
 * A page-builder block as returned by the page queries.
 *
 * Derived from the query result rather than the schema so it matches what
 * `sanityFetch` actually returns. Mirrors the official
 * `sanity-template-nextjs-clean` (`sanity/lib/types.ts`).
 */
export type PageBuilderSection = StegaAware<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>[number]
>

/** Narrow a page-builder block to a specific `_type`. */
export type ExtractPageBuilderType<T extends PageBuilderSection['_type']> = Extract<
  PageBuilderSection,
  { _type: T }
>

/** A blog post as returned by `BLOG_POSTS_QUERY`. */
export type BlogSectionPost = StegaAware<BLOG_POSTS_QUERY_RESULT[0]>

/** A compare-features row, resolved from its referenced feature document. */
export interface CompareFeatureWithTitle {
  _id: string
  _key: string
  title: string
}

/**
 * Server-resolved data for page-builder sections that reference other
 * documents.
 *
 * The official `useOptimistic` page builder reconciles edits from the Studio
 * by swapping in the **raw** document, which carries references but not the
 * referenced documents' fields. Resolved data therefore travels out-of-band
 * (a server-fetched prop) so an in-flight edit never drops it.
 */
export interface ResolvedSectionData {
  posts?: BlogSectionPost[]
  features?: CompareFeatureWithTitle[]
}
