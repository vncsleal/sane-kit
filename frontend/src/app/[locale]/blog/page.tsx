import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import BlogIndexPageUI from '@/components/blog/BlogIndexPageUI'
import {getDictionary, type Dictionary} from '@/i18n/getDictionary'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {BLOG_INDEX_PAGE_QUERY} from '@/sanity/queries'

interface PageParams {
  locale: string
}

interface PageProps {
  params: Promise<PageParams>
  searchParams: Promise<{page?: string}>
}

const POSTS_PER_PAGE = 10

function resolveLocale(rawLocale: string): Locale {
  return hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
}

export function generateStaticParams(): PageParams[] {
  return i18n.locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const {data} = await cachedSanity({
    query: BLOG_INDEX_PAGE_QUERY,
    params: {start: 0, end: POSTS_PER_PAGE, language: locale},
    // Metadata must never contain stega
    perspective: 'published',
    stega: false,
  })
  const dict = await getDictionary(locale)

  if (!data?.config) {
    return {
      title: dict.blog?.defaultTitle || 'Blog',
      description: dict.blog?.defaultDescription || 'Blog posts',
    }
  }

  const config = data.config
  const title = config.seo?.metaTitle || config.title || dict.blog?.defaultTitle || 'Blog'
  const description =
    config.seo?.metaDescription ||
    config.description ||
    dict.blog?.defaultDescription ||
    'Blog posts'

  return {
    title,
    description,
  }
}

export default async function BlogIndexPage({params, searchParams}: PageProps) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const dictionary = await getDictionary(locale)

  return (
    <Suspense fallback={<PageFallback />}>
      {isDraftMode ? (
        <DraftBlogIndex locale={locale} dictionary={dictionary} searchParams={searchParams} />
      ) : (
        <CachedBlogIndex
          locale={locale}
          dictionary={dictionary}
          searchParams={searchParams}
          perspective="published"
          stega={false}
        />
      )}
    </Suspense>
  )
}

async function DraftBlogIndex({
  locale,
  dictionary,
  searchParams,
}: {
  locale: Locale
  dictionary: Dictionary
  searchParams: Promise<{page?: string}>
}) {
  const dynamicOptions = await getDynamicFetchOptions()
  return (
    <CachedBlogIndex
      locale={locale}
      dictionary={dictionary}
      searchParams={searchParams}
      {...dynamicOptions}
    />
  )
}

async function CachedBlogIndex({
  locale,
  dictionary,
  searchParams,
  perspective,
  variant,
  stega,
}: {
  locale: Locale
  dictionary: Dictionary
  searchParams: Promise<{page?: string}>
} & DynamicFetchOptions) {
  const {page: pageParam} = await searchParams
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const {data} = await cachedSanity({
    query: BLOG_INDEX_PAGE_QUERY,
    params: {start, end, language: locale},
    perspective,
    variant,
    stega,
  })

  if (!data?.config) {
    notFound()
  }

  const {config, posts, totalPosts} = data
  const postsPerPage = config.postsPerPage || POSTS_PER_PAGE
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  const pagination = {
    currentPage,
    totalPages,
    totalPosts,
  }

  return (
    <BlogIndexPageUI
      config={config}
      posts={posts}
      pagination={pagination}
      dictionary={dictionary.blog}
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
