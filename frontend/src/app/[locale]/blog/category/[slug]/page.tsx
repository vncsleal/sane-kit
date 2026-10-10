import CategoryPageUI from '@/components/blog/CategoryPageUI'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {getDictionary} from '@/i18n/getDictionary'
import type {Metadata, ResolvingMetadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {CATEGORY_PAGE_QUERY, CATEGORY_SLUGS_QUERY} from '@/sanity/queries'

// Define PageParams interface
interface PageParams {
  slug: string
  locale: string
}

// Define PageProps to expect a Promise of PageParams
interface PageProps {
  params: Promise<PageParams>
}

function resolveLocale(rawLocale: string): Locale {
  return hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
}

// Generate static paths for all categories and locales
export async function generateStaticParams(): Promise<PageParams[]> {
  const {data} = await cachedSanity({
    query: CATEGORY_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })

  const params: PageParams[] = []
  for (const category of data) {
    if (category.slug && category.locale && hasLocale(category.locale)) {
      params.push({slug: category.slug, locale: category.locale})
    }
  }
  return params
}

export async function generateMetadata(
  {params}: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {slug, locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const dictionary = await getDictionary(locale)
  const {data: result} = await cachedSanity({
    query: CATEGORY_PAGE_QUERY,
    params: {slug, language: locale},
    // Metadata must never contain stega
    perspective: 'published',
    stega: false,
  })

  if (!result) {
    return {
      title: dictionary.notFound.categoryTitle,
      description: dictionary.notFound.categoryMessage,
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: result.title
      ? `${result.title} | ${dictionary.app.title}`
      : dictionary.notFound.categoryTitle,
    description: result.description || dictionary.blog.defaultDescription,
    openGraph: {
      images: [...previousImages],
    },
  }
}

export default async function CategoryPage({params}: PageProps) {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DraftCategoryPage params={params} />
      </Suspense>
    )
  }

  const {slug, locale: rawLocale} = await params
  return (
    <CachedCategoryPage
      slug={slug}
      locale={resolveLocale(rawLocale)}
      perspective="published"
      stega={false}
    />
  )
}

async function DraftCategoryPage({params}: Pick<PageProps, 'params'>) {
  const {slug, locale: rawLocale} = await params
  const dynamicOptions = await getDynamicFetchOptions()
  return <CachedCategoryPage slug={slug} locale={resolveLocale(rawLocale)} {...dynamicOptions} />
}

async function CachedCategoryPage({
  slug,
  locale,
  perspective,
  variant,
  stega,
}: {slug: string; locale: Locale} & DynamicFetchOptions) {
  const dictionary = await getDictionary(locale)
  const {data: result} = await cachedSanity({
    query: CATEGORY_PAGE_QUERY,
    params: {slug, language: locale},
    perspective,
    variant,
    stega,
  })

  if (!result) {
    notFound()
  }

  return (
    <CategoryPageUI
      category={result}
      posts={result.posts}
      dictionary={dictionary}
      locale={locale}
    />
  )
}

function PageFallback() {
  return (
    <div className="container mx-auto min-h-[60vh] animate-pulse px-4 py-24">
      <div className="mx-auto h-10 w-2/3 rounded bg-muted" />
    </div>
  )
}
