import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Server-only secrets for revalidation and forms. The Sanity read token lives in
 * `sanity/token.ts` (used by Live Content and the draft-mode route).
 */
export const serverEnv = createEnv({
  server: {
    SANITY_REVALIDATE_SECRET: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    CONTACT_FORM_TO: z.email().optional(),
    CONTACT_FORM_FROM: z.string().min(1).optional(),
  },
  runtimeEnv: {
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FORM_TO: process.env.CONTACT_FORM_TO,
    CONTACT_FORM_FROM: process.env.CONTACT_FORM_FROM,
  },
  emptyStringAsUndefined: true,
})

export const revalidateSecret = serverEnv.SANITY_REVALIDATE_SECRET
