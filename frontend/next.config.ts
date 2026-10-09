import type {NextConfig} from 'next'
import {createClient} from 'next-sanity'

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
