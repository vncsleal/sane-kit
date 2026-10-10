import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import PageBuilder from '@/components/sections/PageBuilder'
import {dictionary} from '@/i18n/dictionaries.pt-BR'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {HOME_PAGE_QUERY} from '@/sanity/queries'
import {resolvePageBuilderData} from '@/sanity/resolve-page-builder'
import {resolveOpenGraphImage} from '@/sanity/utils'

interface PageParams {
  locale: string
}

interface Props {
  params: Promise<PageParams>
}

function resolveLocale(rawLocale: string): Locale {
  return hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
}

export function generateStaticParams(): PageParams[] {
  return i18n.locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const {data: page} = await cachedSanity({
    query: HOME_PAGE_QUERY,
    params: {language: locale},
    // Metadata must never contain stega
    perspective: 'published',
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
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DraftHomePage params={params} />
      </Suspense>
    )
  }

  const {locale: rawLocale} = await params
  return <CachedHomePage locale={resolveLocale(rawLocale)} perspective="published" stega={false} />
}

async function DraftHomePage({params}: Pick<Props, 'params'>) {
  const {locale: rawLocale} = await params
  const dynamicOptions = await getDynamicFetchOptions()
  return <CachedHomePage locale={resolveLocale(rawLocale)} {...dynamicOptions} />
}

async function CachedHomePage({
  locale,
  perspective,
  variant,
  stega,
}: {locale: Locale} & DynamicFetchOptions) {
  const {data: page} = await cachedSanity({
    query: HOME_PAGE_QUERY,
    params: {language: locale},
    perspective,
    variant,
    stega,
  })

  if (!page) notFound()

  const resolvedSections = await resolvePageBuilderData(page.pageBuilder ?? [], locale, {
    perspective,
    variant,
    stega,
  })

  return (
    <main>
      <PageBuilder page={page} locale={locale} resolvedSections={resolvedSections} />
    </main>
  )
}

function PageFallback() {
  return (
    <div className="container mx-auto min-h-[60vh] animate-pulse px-4 py-24">
      <div className="mx-auto h-10 w-2/3 rounded bg-muted" />
    </div>
  )
}
