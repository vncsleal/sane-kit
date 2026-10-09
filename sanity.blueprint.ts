import {
  defineBlueprint,
  defineCorsOrigin,
  defineDocumentFunction,
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
 *   - An illustrative Sanity Function (see `functions/derive-excerpt`).
 *
 * On-demand revalidation is handled by `<SanityLive />` (the Live Content API),
 * not a webhook — see `frontend/src/app/layout.tsx`.
 *
 * Configure with environment variables, then deploy:
 *
 *   SANITY_PROJECT_ID=… SANITY_DATASET=production pnpm blueprint:deploy
 *
 * See `docs/RELEASE.md`. Deploying requires a role with the
 * `sanity-project-cors` permission.
 */

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? 'production'

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

export default defineBlueprint({
  values: {projectId, dataset},
  resources,
})
