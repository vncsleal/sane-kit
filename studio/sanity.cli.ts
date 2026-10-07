/**
 * Sanity CLI + TypeGen configuration.
 * https://www.sanity.io/docs/cli
 */
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID')
}
if (!dataset) {
  throw new Error('Missing SANITY_STUDIO_DATASET')
}

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID || '',
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: '../frontend/src/**/*.{ts,tsx,js,jsx}',
    schema: '../frontend/src/sanity/extract.json',
    generates: '../frontend/src/sanity/types.ts',
    overloadClientMethods: true,
  },
})
