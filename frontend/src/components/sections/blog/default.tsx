import { stegaClean } from 'next-sanity'

import type { ExtractPageBuilderType } from "@/sanity/page-builder"

import { BlogPostWithData, SectionHeader, ViewAllButton, BlogPostCard } from './shared'

type BlogSectionProps = ExtractPageBuilderType<'blogSection'> & {
  locale: string
  posts: BlogPostWithData[]
}

export default function Default({
  heading = 'Artigos mais recentes',
  subheading,
  showFeaturedPostLarge = 'true',
  viewAllButton,
  viewAllUrl = '/blog',
  viewAllButtonText = 'Ver todos os artigos',
  locale,
  posts,
}: BlogSectionProps) {
  const hasPosts = posts.length > 0
  const showFeatured = stegaClean(showFeaturedPostLarge) === 'true' && hasPosts
  const featuredPost = showFeatured ? posts[0] : null
  const regularPosts = showFeatured ? posts.slice(1) : posts

  return (
    <section className="w-full py-20 lg:py-40">
      <div className="container mx-auto px-4 md:px-6 flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <SectionHeader heading={heading} subheading={subheading} />

          <ViewAllButton
            viewAllButton={viewAllButton}
            viewAllUrl={viewAllUrl}
            viewAllButtonText={viewAllButtonText}
            locale={locale}
          />
        </div>

        {!hasPosts ? (
          <div className="text-center py-20 text-muted-foreground">
            No blog posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPost && <BlogPostCard post={featuredPost} isFeatured={true} locale={locale} />}

            {regularPosts.map((post) => (
              <BlogPostCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
