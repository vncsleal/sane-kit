import { z } from 'zod'

export const contactFormSchema = z.object({
  firstName: z.string().trim().max(100).optional(),
  lastName: z.string().trim().max(100).optional(),
  email: z.email(),
  date: z.string().trim().max(100).optional(),
})

export const newsletterFormSchema = z.object({
  email: z.email(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>
