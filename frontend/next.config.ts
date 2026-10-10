import type {NextConfig} from 'next'
import {createClient} from 'next-sanity'
import {sanity as sanityCacheLife} from 'next-sanity/live/cache-life'

import {REDIRECTS_QUERY} from './src/sanity/queries'
import {toNextRedirect} from './src/lib/redirects'

// Config-level client: `redirects()` is evaluated at build time, outside the
// request lifecycle, so it can't reuse the request-scoped app client.
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? '',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-10-01',
  useCdn: true,
  perspective: 'published',
})

const nextConfig: NextConfig = {
  // Cache Components: every route prerenders a static shell, with cached
  // content tag-revalidated by Sanity Live and dynamic content streamed in.
  cacheComponents: true,
  // Documented companion to Cache Components for a new project: unlisted dynamic
  // params serve the App Shell and upgrade in the background.
  partialPrefetching: true,
  // Sanity Live handles on-demand revalidation, so the default profile is
  // widened to a year to avoid redundant time-based revalidation.
  cacheLife: {default: sanityCacheLife},
  // Stable since Next 16.0.0 (SWC-optimized). The experimental Rust/Turbopack
  // variant (experimental.turbopackRustReactCompiler) is intentionally not used.
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  // Required for PostHog trailing-slash API requests (vendor-documented setup).
  skipTrailingSlashRedirect: true,
  async redirects() {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
      return []
    }
    const docs = await sanity.fetch(REDIRECTS_QUERY)
    return docs.map(toNextRedirect)
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ]
  },
}

export default nextConfig
