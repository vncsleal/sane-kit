import { describe, expect, it } from 'vitest'

import { contactFormSchema, newsletterFormSchema } from './schema'

describe('contactFormSchema', () => {
  it('accepts a minimal valid submission', () => {
    expect(contactFormSchema.safeParse({ email: 'a@b.com' }).success).toBe(true)
  })

  it('accepts optional fields', () => {
    const result = contactFormSchema.safeParse({
      email: 'a@b.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      date: '2026-10-07',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(contactFormSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects an over-long name', () => {
    expect(contactFormSchema.safeParse({ email: 'a@b.com', firstName: 'x'.repeat(101) }).success).toBe(
      false,
    )
  })
})

describe('newsletterFormSchema', () => {
  it('accepts a valid email', () => {
    expect(newsletterFormSchema.safeParse({ email: 'a@b.com' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(newsletterFormSchema.safeParse({ email: 'x' }).success).toBe(false)
  })
})
