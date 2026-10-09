'use server'

import {sendEmail, type EmailAttachment} from '@/lib/forms/email'
import {contactFormSchema, newsletterFormSchema} from '@/lib/forms/schema'
import {logger} from '@/lib/logger'
import {serverEnv} from '@/sanity/env.server'

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

/** Honeypot: a hidden field bots fill in. Real users never touch it. */
function isSpam(formData: FormData): boolean {
  return String(formData.get('website') ?? '').trim().length > 0
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function readAttachments(formData: FormData): Promise<EmailAttachment[] | undefined> {
  const file = formData.get('files')
  if (!(file instanceof File) || file.size === 0) return undefined
  return [{filename: file.name, content: Buffer.from(await file.arrayBuffer())}]
}

export async function submitContactForm(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return {status: 'success'}

  const parsed = contactFormSchema.safeParse({
    firstName: formData.get('firstName') ?? undefined,
    lastName: formData.get('lastName') ?? undefined,
    email: formData.get('email'),
    date: formData.get('date') ?? undefined,
  })
  if (!parsed.success) {
    return {status: 'error', message: 'invalid'}
  }

  const to = serverEnv.CONTACT_FORM_TO
  if (!to) {
    logger.error('CONTACT_FORM_TO is not configured')
    return {status: 'error', message: 'not-configured'}
  }

  const {firstName, lastName, email, date} = parsed.data
  const name = [firstName, lastName].filter(Boolean).join(' ')

  try {
    await sendEmail({
      to,
      replyTo: email,
      subject: `Novo contato${name ? ` — ${name}` : ''}`,
      attachments: await readAttachments(formData),
      html: [
        '<h2>Novo contato</h2>',
        '<ul>',
        name ? `<li><strong>Nome:</strong> ${escapeHtml(name)}</li>` : '',
        `<li><strong>Email:</strong> ${escapeHtml(email)}</li>`,
        date ? `<li><strong>Data:</strong> ${escapeHtml(date)}</li>` : '',
        '</ul>',
      ]
        .filter(Boolean)
        .join(''),
    })
    return {status: 'success'}
  } catch (error) {
    logger.error('Contact form submission failed', {error: String(error)})
    return {status: 'error', message: 'send-failed'}
  }
}

export async function submitNewsletterForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (isSpam(formData)) return {status: 'success'}

  const parsed = newsletterFormSchema.safeParse({email: formData.get('email')})
  if (!parsed.success) {
    return {status: 'error', message: 'invalid'}
  }

  const to = serverEnv.CONTACT_FORM_TO
  if (!to) {
    logger.error('CONTACT_FORM_TO is not configured')
    return {status: 'error', message: 'not-configured'}
  }

  try {
    await sendEmail({
      to,
      replyTo: parsed.data.email,
      subject: 'Nova inscrição na newsletter',
      html: `<p>Novo inscrito: ${escapeHtml(parsed.data.email)}</p>`,
    })
    return {status: 'success'}
  } catch (error) {
    logger.error('Newsletter form submission failed', {error: String(error)})
    return {status: 'error', message: 'send-failed'}
  }
}
