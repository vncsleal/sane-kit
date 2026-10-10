import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import PageBuilder from '@/components/sections/PageBuilder'
import {getDictionary} from '@/i18n/getDictionary'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {PAGE_QUERY, PAGE_SLUGS_QUERY} from '@/sanity/queries'
import {resolvePageBuilderData} from '@/sanity/resolve-page-builder'
import {resolveOpenGraphImage} from '@/sanity/utils'

// Define the PageParams interface specifically for params
interface PageParams {
  slug: string
  locale: string
}

interface PageProps {
  params: Promise<PageParams>
}

function resolveLocale(rawLocale: string): Locale {
  return hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const {data} = await cachedSanity({
    query: PAGE_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })

  const params: PageParams[] = []
  for (const doc of data) {
    if (doc.slug && doc.locale && hasLocale(doc.locale)) {
      params.push({slug: doc.slug, locale: doc.locale})
    }
  }
  return params
}

// Generate metadata using the PageParams interface
export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug, locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const {data: page} = await cachedSanity({
    query: PAGE_QUERY,
    params: {slug, language: locale},
    // Metadata must never contain stega
    perspective: 'published',
    stega: false,
  })
  const dictionary = await getDictionary(locale)

  if (!page) {
    return {
      title: dictionary.notFound.pageTitle,
      description: dictionary.notFound.pageMessage,
    }
  }

  const metadata: Metadata = {
    title: page.seo.title || page.title || dictionary.defaultMeta.title,
    description: page.seo.description || page.description || dictionary.defaultMeta.description,
  }

  const ogImage = resolveOpenGraphImage(page.seo.image)
  if (ogImage) {
    metadata.openGraph = {images: [ogImage]}
  }

  if (page.seo.noIndex) {
    metadata.robots = {index: false, follow: false}
  }

  return metadata
}

// Page component using PageParams and removing searchParams
export default async function DynamicPage({params}: PageProps) {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DraftPage params={params} />
      </Suspense>
    )
  }

  const {slug, locale: rawLocale} = await params
  return (
    <CachedPage
      slug={slug}
      locale={resolveLocale(rawLocale)}
      perspective="published"
      stega={false}
    />
  )
}

async function DraftPage({params}: Pick<PageProps, 'params'>) {
  const {slug, locale: rawLocale} = await params
  const dynamicOptions = await getDynamicFetchOptions()
  return <CachedPage slug={slug} locale={resolveLocale(rawLocale)} {...dynamicOptions} />
}

async function CachedPage({
  slug,
  locale,
  perspective,
  variant,
  stega,
}: {slug: string; locale: Locale} & DynamicFetchOptions) {
  const {data: page} = await cachedSanity({
    query: PAGE_QUERY,
    params: {slug, language: locale},
    perspective,
    variant,
    stega,
  })

  if (!page) {
    notFound()
  }

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
