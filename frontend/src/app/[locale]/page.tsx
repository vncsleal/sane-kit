import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import PageBuilder from '@/components/sections/PageBuilder'
import {dictionary} from '@/i18n/dictionaries.pt-BR'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {sanityFetch} from '@/sanity/live'
import {HOME_PAGE_QUERY} from '@/sanity/queries'
import {resolvePageBuilderData} from '@/sanity/resolve-page-builder'
import {resolveOpenGraphImage} from '@/sanity/utils'

interface PageParams {
  locale: string
}

interface Props {
  params: Promise<PageParams>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: rawLocale} = await params
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
  const {data: page} = await sanityFetch({
    query: HOME_PAGE_QUERY,
    params: {language: locale},
    // Metadata must never contain stega
    stega: false,
  })

  if (!page) {
    return {
      title: dictionary.notFound.pageTitle,
      description: dictionary.notFound.pageMessage,
    }
  }

  const metadata: Metadata = {title: page.title || 'Página Inicial'}
  if (page.description) metadata.description = page.description
  const ogImage = resolveOpenGraphImage(page.seo.image ?? page.ogImage)
  if (ogImage) {
    metadata.openGraph = {images: [ogImage]}
  }
  return metadata
}

export default async function HomePage({params}: Props) {
  const {locale: rawLocale} = await params
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
  const {data: page} = await sanityFetch({
    query: HOME_PAGE_QUERY,
    params: {language: locale},
  })

  if (!page) notFound()

  const resolvedSections = await resolvePageBuilderData(page.pageBuilder ?? [], locale)

  return (
    <main>
      <PageBuilder page={page} locale={locale} resolvedSections={resolvedSections} />
    </main>
  )
}
