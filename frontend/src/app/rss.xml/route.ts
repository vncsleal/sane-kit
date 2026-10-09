import {client} from '@/sanity/client'
import {RSS_QUERY} from '@/sanity/queries'
import {i18n} from '@/i18n/i18n-config'
import {siteUrl} from '@/sanity/env'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const locale = i18n.defaultLocale
  const posts = await client.fetch(RSS_QUERY, {language: locale})

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/${locale}/blog/${post.slug}`
      return [
        '    <item>',
        `      <title>${escapeXml(post.title ?? '')}</title>`,
        `      <link>${link}</link>`,
        `      <guid>${link}</guid>`,
        post.publishedAt
          ? `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`
          : '',
        post.excerpt ? `      <description>${escapeXml(post.excerpt)}</description>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Sane Kit Blog</title>
    <link>${siteUrl}</link>
    <description>Latest posts</description>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {'Content-Type': 'application/rss+xml; charset=utf-8'},
  })
}
