import type { MetadataRoute } from 'next'

import { client } from '@/sanity/client'
import { SITEMAP_QUERY } from '@/sanity/queries'
import { i18n } from '@/i18n/i18n-config'
import { siteUrl } from '@/sanity/env'

function pathFor(type: string, slug: string): string {
  switch (type) {
    case 'page':
      return slug === '/' ? '' : `/${slug}`
    case 'blogPost':
      return `/blog/${slug}`
    case 'author':
      return `/blog/author/${slug}`
    case 'category':
      return `/blog/category/${slug}`
    default:
      return `/${slug}`
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLocale = await Promise.all(
    i18n.locales.map(async (locale) => {
      const docs = await client.fetch(SITEMAP_QUERY, { language: locale })
      return docs
        .filter((doc) => !doc.noIndex)
        .map((doc) => ({
          url: new URL(`/${locale}${pathFor(doc._type, doc.slug ?? '')}`, siteUrl).toString(),
          lastModified: new Date(doc._updatedAt),
        }))
    }),
  )

  return perLocale.flat()
}
