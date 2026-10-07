import { expect, test } from '@playwright/test'

test('root redirects to a locale', async ({ page }) => {
  await page.goto('/')
  // The proxy must redirect `/` to a supported locale prefix.
  await expect(page).toHaveURL(/\/(pt-BR|en)(\/|$)/)
})

test('robots.txt is served with a sitemap reference', async ({ request }) => {
  const response = await request.get('/robots.txt')
  expect(response.ok()).toBeTruthy()
  expect(await response.text()).toContain('Sitemap')
})

test('sitemap.xml is served', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.ok()).toBeTruthy()
})

test('rss.xml is served', async ({ request }) => {
  const response = await request.get('/rss.xml')
  expect(response.ok()).toBeTruthy()
})

for (const locale of ['en', 'pt-BR'] as const) {
  test(`${locale} home responds without a server error`, async ({ request }) => {
    const response = await request.get(`/${locale}`)
    expect(response.status()).toBeLessThan(500)
  })
}
