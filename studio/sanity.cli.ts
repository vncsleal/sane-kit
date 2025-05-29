/**
 * Sanity CLI Configuration
 * This file configures the Sanity CLI tool with project-specific settings
 * and customizes the Vite bundler configuration.
 * Learn more: https://www.sanity.io/docs/cli
 */

import { defineCliConfig } from "sanity/cli";

const projectIdFromEnv = process.env.SANITY_STUDIO_PROJECT_ID;
const datasetFromEnv = process.env.SANITY_STUDIO_DATASET;

if (!projectIdFromEnv) {
  throw new Error("The SANITY_STUDIO_PROJECT_ID environment variable is missing or empty. Please set it in your environment.");
}
if (!datasetFromEnv) {
  throw new Error("The SANITY_STUDIO_DATASET environment variable is missing or empty. Please set it in your environment.");
}

export const projectId: string = projectIdFromEnv;
export const dataset: string = datasetFromEnv;

export default defineCliConfig({
  api: {
    projectId,
    dataset,  
  },
  studioHost: process.env.SANITY_STUDIO_STUDIO_HOST || "", // Visit https://www.sanity.io/docs/environment-variables to leanr more about using environment variables for local & production.
  autoUpdates: true,
});
