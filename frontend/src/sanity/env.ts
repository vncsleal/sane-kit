import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Single validated source of environment configuration.
 * Throws at build/startup when a required value is missing — no silent fallbacks.
 * https://env.t3.gg
 */
export const env = createEnv({
  server: {
    SANITY_API_READ_TOKEN: z.string().min(1).optional(),
    SANITY_REVALIDATE_SECRET: z.string().min(1).optional(),
  },
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
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
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
export const readToken = env.SANITY_API_READ_TOKEN
export const revalidateSecret = env.SANITY_REVALIDATE_SECRET
