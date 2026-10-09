import {createClient} from '@sanity/client'
import {documentEventHandler} from '@sanity/functions'

/**
 * Illustrative Sanity Function.
 *
 * Runs on Sanity's infrastructure when a `blogPost` is published without an
 * `excerpt`, derives one from the article body, and writes it back. Guarded so
 * it only ever fills an empty `excerpt`, which keeps it idempotent (no loop).
 *
 * Deployed with the blueprint — see `sanity.blueprint.ts`. Test locally with:
 *   pnpm exec sanity functions test derive-excerpt --dataset production
 */

interface BlogPostEventData {
  _id: string
  excerpt?: string | null
  body?: Array<{_type: string; children?: Array<{text?: string}>}>
}

const EXCERPT_LENGTH = 300
const MIN_SOURCE_LENGTH = 50

function deriveExcerpt(body: BlogPostEventData['body']): string {
  const text = (body ?? [])
    .flatMap((block) => (block._type === 'block' ? (block.children ?? []) : []))
    .map((span) => span.text ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length < MIN_SOURCE_LENGTH) return ''
  if (text.length <= EXCERPT_LENGTH) return text

  return `${text.slice(0, EXCERPT_LENGTH - 1).trimEnd()}…`
}

export const handler = documentEventHandler<BlogPostEventData>(async ({context, event}) => {
  const {_id, excerpt, body} = event.data

  if (excerpt?.trim()) return

  const derived = deriveExcerpt(body)
  if (!derived) return

  const client = createClient({
    apiVersion: '2025-02-19',
    ...context.clientOptions,
  })

  await client.patch(_id).setIfMissing({excerpt: derived}).commit()
})
