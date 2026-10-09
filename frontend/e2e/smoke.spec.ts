import {expect, test} from '@playwright/test'

test('root redirects to a supported locale', async ({page}) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/(pt-BR|en)(\/|$)/)
})

for (const locale of ['pt-BR', 'en'] as const) {
  test(`${locale} home renders content`, async ({page}) => {
    const response = await page.goto(`/${locale}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('body')).toContainText('Sane Kit')
  })
}

test('a blog post renders', async ({page}) => {
  const response = await page.goto('/pt-BR/blog/como-usar-o-sane-kit')
  expect(response?.status()).toBe(200)
  await expect(page.locator('body')).toContainText('Sane Kit')
})

test('contact form renders with an email field and a honeypot', async ({page}) => {
  await page.goto('/pt-BR/contato')
  await expect(page.locator('input[name="email"]').first()).toBeVisible()
  await expect(page.locator('input[name="website"]')).toHaveCount(1)
})

test('newsletter form renders', async ({page}) => {
  await page.goto('/pt-BR/newsletter')
  await expect(page.locator('input[name="email"]').first()).toBeVisible()
})

test('draft-mode enable rejects unauthenticated requests', async ({request}) => {
  const response = await request.get('/api/draft-mode/enable')
  // 401/403 when configured but unauthenticated; 501 when no read token is set.
  expect([401, 403, 501]).toContain(response.status())
})

test('robots.txt is served with a sitemap reference', async ({request}) => {
  const response = await request.get('/robots.txt')
  expect(response.ok()).toBeTruthy()
  expect(await response.text()).toContain('Sitemap')
})

test('sitemap.xml is served', async ({request}) => {
  const response = await request.get('/sitemap.xml')
  expect(response.ok()).toBeTruthy()
})

test('rss.xml is served', async ({request}) => {
  const response = await request.get('/rss.xml')
  expect(response.ok()).toBeTruthy()
})
