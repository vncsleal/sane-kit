import 'server-only'

/**
 * Viewer token used for Draft Mode and Live Content drafts.
 *
 * Optional by design: the published site builds and runs without it — only
 * previews (the Presentation tool, draft mode) need it. Configure
 * `SANITY_API_READ_TOKEN` to enable them.
 */
export const token = process.env.SANITY_API_READ_TOKEN
