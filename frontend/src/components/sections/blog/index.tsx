'use client'

import {stegaClean} from 'next-sanity'

import type {BlogSectionPost, ExtractPageBuilderType} from '@/sanity/page-builder'
import type {Locale} from '@/i18n/i18n-config'

import Default from './default'
import Grid from './grid'

export type BlogSectionComponentProps = ExtractPageBuilderType<'blogSection'> & {
  locale: Locale
  /** Posts resolved server-side by `resolvePageBuilderData`. */
  posts: BlogSectionPost[]
}

/**
 * Presentational router for the blog section. The posts are resolved on the
 * server (see `resolvePageBuilderData`) so this stays a client component the
 * optimistic page builder can render.
 */
export default function BlogSectionComponent(props: BlogSectionComponentProps) {
  const {variant = 'default', ...rest} = props

  switch (stegaClean(variant)) {
    case 'grid':
      return <Grid {...rest} />
    default:
      return <Default {...rest} />
  }
}

export type {BlogPostWithData} from './shared'
