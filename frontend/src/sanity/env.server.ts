import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Server-only secrets. Imported exclusively from server code (Live Content,
 * draft-mode and revalidation routes) so they never reach the client bundle.
 */
export const serverEnv = createEnv({
  server: {
    SANITY_API_READ_TOKEN: z.string().min(1).optional(),
    SANITY_REVALIDATE_SECRET: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    CONTACT_FORM_TO: z.email().optional(),
    CONTACT_FORM_FROM: z.string().min(1).optional(),
  },
  runtimeEnv: {
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FORM_TO: process.env.CONTACT_FORM_TO,
    CONTACT_FORM_FROM: process.env.CONTACT_FORM_FROM,
  },
  emptyStringAsUndefined: true,
})

export const readToken = serverEnv.SANITY_API_READ_TOKEN
export const revalidateSecret = serverEnv.SANITY_REVALIDATE_SECRET
