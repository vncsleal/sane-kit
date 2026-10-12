import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    navigationTimeout: 60_000,
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  webServer: {
    // In CI the build is a separate step, so the server is only started here.
    command: process.env.CI ? 'pnpm start' : 'pnpm build && pnpm start',
    url: 'http://localhost:3000/robots.txt',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
