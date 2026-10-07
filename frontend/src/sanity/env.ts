import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Client-safe environment. Must not reference server variables at module scope —
 * this module is imported by client components (via `sanity/client`).
 * Server-only secrets live in `env.server.ts`.
 */
export const env = createEnv({
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().default('2026-10-01'),
    NEXT_PUBLIC_SANITY_STUDIO_URL: z.string().url().default('http://localhost:3333'),
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_STUDIO_URL: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  emptyStringAsUndefined: true,
})

export const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = env.NEXT_PUBLIC_SANITY_DATASET
export const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION
export const studioUrl = env.NEXT_PUBLIC_SANITY_STUDIO_URL
export const siteUrl = env.NEXT_PUBLIC_SITE_URL
