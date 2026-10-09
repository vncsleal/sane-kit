import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

import {revalidateSecret} from '@/sanity/env.server'

type WebhookPayload = {tags?: string[]}

export async function POST(req: NextRequest) {
  if (!revalidateSecret) {
    return new NextResponse('Missing SANITY_REVALIDATE_SECRET', {status: 500})
  }

  const {isValidSignature, body} = await parseBody<WebhookPayload>(req, revalidateSecret, true)

  if (!isValidSignature) {
    return new NextResponse('Invalid signature', {status: 401})
  }
  if (!Array.isArray(body?.tags) || body.tags.length === 0) {
    return new NextResponse('Missing tags', {status: 400})
  }

  for (const tag of body.tags) {
    revalidateTag(tag, 'max')
  }

  return NextResponse.json({revalidated: body.tags})
}
