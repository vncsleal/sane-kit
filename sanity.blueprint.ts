import {
  defineBlueprint,
  defineCorsOrigin,
  defineDocumentFunction,
  defineDocumentWebhook,
  type BlueprintResource,
} from '@sanity/blueprints'

/**
 * Sane-Kit project setup as code.
 *
 * Declares the resources a fresh Sanity project needs so setup is reproducible
 * instead of a series of dashboard clicks:
 *
 *   - CORS origins for the frontend (`:3000`) and Studio (`:3333`) dev servers,
 *     with credentials so Draft Mode and click-to-edit work.
 *   - A GROQ-powered webhook that calls the frontend's `/api/revalidate` route
 *     for on-demand (tag) revalidation. Only declared when `SANITY_SITE_URL`
 *     points at a publicly reachable site — a webhook cannot call `localhost`.
 *
 * Configure with environment variables, then deploy:
 *
 *   SANITY_PROJECT_ID=… SANITY_DATASET=production SANITY_SITE_URL=https://… \
 *     SANITY_REVALIDATE_SECRET=… pnpm blueprint:deploy
 *
 * See `docs/RELEASE.md`. Deploying requires a role with the
 * `sanity-project-cors` / `sanity-project-webhooks` permissions.
 */

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? 'production'
const siteUrl = process.env.SANITY_SITE_URL?.replace(/\/+$/, '')
const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is required to deploy the blueprint (see docs/RELEASE.md).')
}

const resources: BlueprintResource[] = [
  defineCorsOrigin({
    name: 'frontend-localhost',
    project: '$.values.projectId',
    origin: 'http://localhost:3000',
    allowCredentials: true,
  }),
  defineCorsOrigin({
    name: 'studio-localhost',
    project: '$.values.projectId',
    origin: 'http://localhost:3333',
    allowCredentials: true,
  }),
  // Illustrative Sanity Function (see functions/derive-excerpt): fills an empty
  // blogPost excerpt from the body on publish.
  defineDocumentFunction({
    name: 'derive-excerpt',
    project: '$.values.projectId',
    event: {
      on: ['create', 'update'],
      filter: '_type == "blogPost"',
      projection: '{_id, excerpt, body}',
      resource: {type: 'dataset', id: `${projectId}.${dataset}`},
    },
  }),
]

if (siteUrl && !/localhost|127\.0\.0\.1/.test(siteUrl)) {
  resources.push(
    defineDocumentWebhook({
      name: 'revalidate',
      project: '$.values.projectId',
      dataset: '$.values.dataset',
      apiVersion: 'v2025-02-19',
      url: `${siteUrl}/api/revalidate`,
      on: ['create', 'update', 'delete'],
      filter:
        '_type in ["page", "blogPost", "blogPage", "author", "category", "header", "footer", "redirect", "locale"]',
      projection: '{ "tags": [_type, _type + ":" + slug.current] }',
      ...(revalidateSecret ? {secret: revalidateSecret} : {}),
    }),
  )
}

export default defineBlueprint({
  values: {projectId, dataset},
  resources,
})
