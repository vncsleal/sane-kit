import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'
import type {Metadata} from 'next'
import type {PortableText} from '@/sanity/types'
import type {ExpandedBlogPost} from '@/components/blog/AuthorPageUI'
import AuthorPageUI from '@/components/blog/AuthorPageUI'
import {getDictionary, type Dictionary} from '@/i18n/getDictionary'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {AUTHOR_PAGE_QUERY, AUTHOR_SLUGS_QUERY} from '@/sanity/queries'

interface PageParams {
  slug: string
  locale: string
}
interface PageProps {
  params: Promise<PageParams>
}

// Intermediate type for a category as returned by AUTHOR_PAGE_QUERY (within a post)
interface CategoryFromAuthorQuery {
  _id: string
  _type: 'category'
  title?: string
  slug: string // This is slug.current from the GROQ query
  description?: string
  language?: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// Intermediate type for a post as returned by AUTHOR_PAGE_QUERY
interface PostFromAuthorQuery {
  _id: string
  _type: 'blogPost'
  title?: string
  slug: string // This is slug.current from the GROQ query
  publishedAt?: string
  excerpt?: string // Excerpt is now plain text from query
  mainImage?: {asset?: {_ref: string}; alt?: string}
  featured?: boolean
  categories?: CategoryFromAuthorQuery[]
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// Query result for author page: author fields + posts array
interface AuthorPageQueryResult {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  name?: string
  slug: {current: string} // Author slug is an object from query
  role?: string
  bio?: string
  fullBio?: PortableText // Use PortableText type
  email?: string
  avatar?: {asset?: {_ref: string}; alt?: string}
  featuredImage?: {asset?: {_ref: string}; alt?: string}
  socialLinks?: Array<{
    _key: string
    _type: string
    platform?: string
    url?: string
    username?: string
  }>
  posts?: PostFromAuthorQuery[]
}

function resolveLocale(rawLocale: string): Locale {
  return hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const {data} = await cachedSanity({
    query: AUTHOR_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })

  const params: PageParams[] = []
  for (const author of data) {
    if (author.slug && author.locale && hasLocale(author.locale)) {
      params.push({slug: author.slug, locale: author.locale})
    }
  }
  return params
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug, locale: rawLocale} = await params
  const locale = resolveLocale(rawLocale)
  const {data} = await cachedSanity({
    query: AUTHOR_PAGE_QUERY,
    params: {slug, language: locale},
    // Metadata must never contain stega
    perspective: 'published',
    stega: false,
  })
  const page = data?.[0] ?? null
  const dict = await getDictionary(locale)
  if (!page?.name) {
    return {title: dict.notFound.authorTitle, description: dict.notFound.authorMessage}
  }
  return {
    title: `${page.name} - ${dict.author.articlesBy} ${page.name}`,
    description: page.bio || `${dict.author.articlesBy} ${page.name}`,
  }
}

export default async function AuthorPage({params}: PageProps) {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DraftAuthorPage params={params} />
      </Suspense>
    )
  }

  const {slug, locale: rawLocale} = await params
  return (
    <CachedAuthorPage
      slug={slug}
      locale={resolveLocale(rawLocale)}
      perspective="published"
      stega={false}
    />
  )
}

async function DraftAuthorPage({params}: Pick<PageProps, 'params'>) {
  const {slug, locale: rawLocale} = await params
  const dynamicOptions = await getDynamicFetchOptions()
  return <CachedAuthorPage slug={slug} locale={resolveLocale(rawLocale)} {...dynamicOptions} />
}

async function CachedAuthorPage({
  slug,
  locale,
  perspective,
  variant,
  stega,
}: {slug: string; locale: Locale} & DynamicFetchOptions) {
  const {data} = await cachedSanity({
    query: AUTHOR_PAGE_QUERY,
    params: {slug, language: locale},
    perspective,
    variant,
    stega,
  })
  const page = data?.[0] ?? null
  const dictionary = await getDictionary(locale)
  if (!page) notFound()

  const author = {
    _id: page._id,
    _type: 'author' as const,
    _createdAt: page._createdAt,
    _updatedAt: page._updatedAt,
    _rev: page._rev,
    name: page.name ?? undefined,
    slug: {...page.slug, _type: 'slug' as const},
    role: page.role ?? undefined,
    bio: page.bio ?? undefined,
    fullBio: page.fullBio
      ? page.fullBio.filter(
          (block): block is Exclude<typeof block, {_type: 'codeBlock'} | {_type: 'image'}> =>
            block._type === 'block',
        )
      : undefined,
    email: page.email ?? undefined,
    avatar: page.avatar
      ? {
          ...page.avatar,
          _type: 'image' as const,
          asset: page.avatar.asset
            ? {...page.avatar.asset, _type: 'reference' as const}
            : undefined,
        }
      : undefined,
    featuredImage: page.featuredImage
      ? {
          ...page.featuredImage,
          _type: 'image' as const,
          asset: page.featuredImage.asset
            ? {...page.featuredImage.asset, _type: 'reference' as const}
            : undefined,
        }
      : undefined,
    socialLinks: page.socialLinks?.map((link) => ({
      ...link,
      _type: 'socialLink' as const,
      platform: link.platform ?? undefined,
      url: link.url ?? undefined,
      username: link.username ?? undefined,
    })),
  }

  const posts = (page.posts || []).map((p) => {
    const categories = p.categories?.map((c) => ({
      ...c,
      title: c.title ?? undefined,
      description: c.description ?? undefined,
      language: c.language ?? undefined,
      slug: {_type: 'slug' as const, current: c.slug ?? ''},
    }))

    return {
      _id: p._id,
      _type: 'blogPost' as const,
      title: p.title ?? undefined,
      slug: {_type: 'slug' as const, current: p.slug ?? ''},
      publishedAt: p.publishedAt ?? undefined,
      excerpt: p.excerpt ?? undefined,
      mainImage: p.mainImage
        ? {
            ...p.mainImage,
            _type: 'image' as const,
            asset: p.mainImage.asset
              ? {...p.mainImage.asset, _type: 'reference' as const}
              : undefined,
          }
        : undefined,
      featured: p.featured ?? undefined,
      author,
      categories,
      _createdAt: p._createdAt,
      _updatedAt: p._updatedAt,
      _rev: p._rev,
    }
  })

  return <AuthorPageUI author={author} posts={posts} dictionary={dictionary} locale={locale} />
}

function PageFallback() {
  return (
    <div className="container mx-auto min-h-[60vh] animate-pulse px-4 py-24">
      <div className="mx-auto h-10 w-2/3 rounded bg-muted" />
    </div>
  )
}
