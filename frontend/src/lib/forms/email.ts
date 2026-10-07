import { Resend } from 'resend'

import { serverEnv } from '@/sanity/env.server'

export interface EmailAttachment {
  filename: string
  content: Buffer
}

export interface EmailMessage {
  to: string
  subject: string
  html: string
  replyTo?: string
  attachments?: EmailAttachment[]
}

/**
 * Send an email through Resend. Throws when Resend is not configured or the API
 * returns an error — callers surface the failure rather than swallowing it.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = serverEnv.RESEND_API_KEY
  const from = serverEnv.CONTACT_FORM_FROM

  if (!apiKey || !from) {
    throw new Error('Resend is not configured (RESEND_API_KEY / CONTACT_FORM_FROM)')
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    replyTo: message.replyTo,
    attachments: message.attachments,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
