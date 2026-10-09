import {client} from '@/sanity/client'
import {sanityFetch} from '@/sanity/live'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
// Remove unused imports Image and Slug since they're not used
import type {Author, Category, PortableText} from '@/sanity/types'
import type {ExpandedBlogPost} from '@/components/blog/AuthorPageUI'
import AuthorPageUI from '@/components/blog/AuthorPageUI'
import {getDictionary} from '@/i18n/getDictionary'
import {i18n, hasLocale, type Locale} from '@/i18n/i18n-config'
import {AUTHOR_PAGE_QUERY} from '@/sanity/queries'

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

// Fetch author + posts in one shot using consolidated query
async function getPageData(slug: string, locale: Locale) {
  const {data} = await sanityFetch({
    query: AUTHOR_PAGE_QUERY,
    params: {slug, language: locale},
  })
  return data?.[0] ?? null
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug, locale: rawLocale} = await params
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
  const {data} = await sanityFetch({
    query: AUTHOR_PAGE_QUERY,
    params: {slug, language: locale},
    // Metadata must never contain stega
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

export async function generateStaticParams() {
  // Use the same consolidated query but without filters to get all authors
  const authors = await client.fetch<Array<{slug: {current: string}; language: Locale}>>(
    AUTHOR_PAGE_QUERY,
    {slug: null, language: null},
  )

  if (!authors) return []

  return authors.map((author) => ({
    slug: author.slug.current,
    locale: author.language,
  }))
}

export default async function AuthorPage({params}: PageProps) {
  const {slug, locale: rawLocale} = await params
  const locale = hasLocale(rawLocale) ? rawLocale : i18n.defaultLocale
  const page = await getPageData(slug, locale)
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
