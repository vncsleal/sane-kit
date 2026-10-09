import { stegaClean } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'

import { urlFor } from '@/sanity/image'
import type { ExtractPageBuilderType } from "@/sanity/page-builder"

import { BlogPostWithData, SectionHeader, ViewAllButton } from './shared'

type BlogSectionProps = ExtractPageBuilderType<'blogSection'> & {
  locale: string
  posts: BlogPostWithData[]
}

export default function Grid({
  heading = 'Artigos mais recentes',
  subheading,
  viewAllButton,
  viewAllUrl = '/blog',
  viewAllButtonText = 'Ver todos os artigos',
  locale,
  posts,
}: BlogSectionProps) {
  const hasPosts = posts.length > 0

  return (
    <section className="w-full py-20 lg:py-40">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <SectionHeader heading={heading} subheading={subheading} />

          {stegaClean(viewAllButton) === 'true' && (
            <ViewAllButton
              viewAllButton={viewAllButton}
              viewAllUrl={viewAllUrl}
              viewAllButtonText={viewAllButtonText}
              locale={locale}
            />
          )}
        </div>

        {!hasPosts ? (
          <div className="text-center py-20 text-muted-foreground">
            No blog posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/${locale}/blog/${post.slug?.current || ''}`}
                className="flex flex-col gap-2 hover:opacity-75 transition-opacity group"
              >
                <div className="bg-muted rounded-md aspect-video mb-4 overflow-hidden">
                  {post.mainImage?.asset?._ref ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.mainImage.alt || ''}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <h3 className="text-xl tracking-tight group-hover:text-primary transition-colors">
                  {post.title || ''}
                </h3>
                {post.excerpt && (
                  <p className="text-muted-foreground text-base line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
