import { ImageResponse } from 'next/og'

import { client } from '@/sanity/client'
import { BLOG_POST_PAGE_QUERY } from '@/sanity/queries'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Blog post'

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params

  const post = await client
    .withConfig({ stega: false })
    .fetch(BLOG_POST_PAGE_QUERY, { slug, language: locale })

  const title = post?.title ?? 'Sane Kit'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#0b0b0f',
          color: '#fafafa',
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 400, opacity: 0.6 }}>Sane Kit</div>
        <div>{title}</div>
        <div style={{ fontSize: 24, fontWeight: 400, opacity: 0.5 }}>
          {post?.author?.name ? `por ${post.author.name}` : ''}
        </div>
      </div>
    ),
    { ...size },
  )
}
