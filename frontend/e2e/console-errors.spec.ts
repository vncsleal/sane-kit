import {expect, test} from '@playwright/test'

/**
 * Guards against React hydration mismatches (and hard console errors) on the
 * rendered pages. A hydration error means the server and client trees diverge —
 * a real bug that a status-code smoke test would miss.
 */
const pages = ['/pt-BR', '/pt-BR/contato', '/pt-BR/precos', '/pt-BR/blog']

for (const path of pages) {
  test(`no hydration or console errors on ${path}`, async ({page}) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(String(err)))

    await page.goto(path)
    await page.waitForLoadState('load')
    // Give the client time to hydrate (networkidle never settles: <SanityLive />
    // holds an open EventSource).
    await page.waitForTimeout(2500)

    const hydrationErrors = errors.filter((e) => /hydrat|did not match|didn't match/i.test(e))
    expect(hydrationErrors, `hydration errors on ${path}:\n${hydrationErrors.join('\n')}`).toEqual(
      [],
    )
  })
}
