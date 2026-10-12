/**
 * Generates `docs/preview.png` — the 1200×750 Sanity Exchange preview image.
 *
 * Fidelity is the point: the frame is rendered with the **app's own design
 * tokens**, not a hand-picked palette. The `:root` block is read verbatim from
 * `src/app/globals.css` (so `--foreground`, `--muted-foreground`, `--secondary`,
 * `--border`, `--radius` always track the real theme), the type mirrors the
 * hero section's classes (`tracking-tighter` heading at regular weight,
 * `text-muted-foreground` body), and the real header logo is reused with the
 * exact computed filter/blend it gets on the site. Nothing is invented.
 *
 * The screenshot itself is a real capture of the running frontend, so point it
 * at a deployed URL or a local server:
 *
 *   SITE_URL=https://sane-kit-demo.vercel.app/en pnpm preview:image
 */
import {chromium} from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, '../../docs/preview.png')
const SITE = process.env.SITE_URL ?? 'http://localhost:3000/en'

// Single source of truth for colour/radius: the app's stylesheet.
const globals = fs.readFileSync(path.resolve(here, '../src/app/globals.css'), 'utf8')
const rootTokens = globals.match(/:root\s*\{([\s\S]*?)\}/)?.[1]
if (!rootTokens) throw new Error('Could not read the :root token block from src/app/globals.css')

const browser = await chromium.launch()

const site = await browser.newPage({viewport: {width: 1280, height: 900}, deviceScaleFactor: 2})
await site.goto(SITE, {waitUntil: 'load', timeout: 90_000})
await site.waitForTimeout(1500)

// Dismiss the cookie banner so it does not sit on top of the hero.
const accept = site.getByRole('button', {name: /accept|aceitar|allow|got it|concordo/i})
if (await accept.count())
  await accept
    .first()
    .click()
    .catch(() => {})
await site.waitForTimeout(1200)

// Reuse the real header logo, including how the site filters/blends it.
const logo = await site.evaluate(() => {
  const img = document.querySelector('header img')
  if (!img) return null
  const styles = getComputedStyle(img)
  const source = new URL(img.currentSrc || img.src, location.href)
  const original = source.pathname === '/_next/image' ? source.searchParams.get('url') : source.href
  return {
    url: original,
    alt: img.getAttribute('alt') ?? '',
    filter: styles.filter,
    mixBlendMode: styles.mixBlendMode,
  }
})

const shot = await site.screenshot()

let logoHtml = ''
if (logo?.url) {
  const bytes = Buffer.from(await (await fetch(logo.url)).arrayBuffer())
  logoHtml = `<img class="logo" src="data:image/png;base64,${bytes.toString('base64')}" alt="${logo.alt}"
    style="filter:${logo.filter};mix-blend-mode:${logo.mixBlendMode}">`
}

// Compose the exact 1200×750 frame from the real tokens.
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
<style>
  :root {${rootTokens}}
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:750px;overflow:hidden;
    font-family:Geist,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
    background:var(--background);
    color:var(--foreground)}
  .wrap{position:relative;width:1200px;height:750px;padding:56px 64px}
  .brand{display:flex;align-items:center;gap:12px;height:40px}
  .logo{height:40px;width:auto;object-fit:contain;display:block}
  .wordmark{font-weight:600;font-size:19px;letter-spacing:-.01em;color:var(--foreground)}
  .copy{position:absolute;left:64px;top:150px;width:456px}
  h1{font-weight:400;font-size:46px;line-height:1.1;letter-spacing:-.05em;color:var(--foreground)}
  p{margin-top:18px;font-size:18px;line-height:1.625;letter-spacing:-.025em;color:var(--muted-foreground)}
  .badges{position:absolute;left:64px;bottom:56px;display:flex;gap:8px;flex-wrap:wrap;width:520px}
  .badge{display:inline-flex;align-items:center;border-radius:9999px;background:var(--secondary);
    color:var(--secondary-foreground);padding:4px 10px;font-size:13px;font-weight:500;
    line-height:1.25;white-space:nowrap}
  .frame{position:absolute;right:52px;top:150px;width:610px;height:470px;overflow:hidden;
    border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);
    background:var(--card);box-shadow:0 24px 48px -24px rgb(0 0 0 / .28)}
  .bar{height:34px;background:var(--muted);display:flex;align-items:center;gap:7px;padding:0 14px;
    border-bottom:1px solid var(--border)}
  .dot{width:10px;height:10px;border-radius:50%;background:var(--muted-foreground);opacity:.45}
  .frame img{width:100%;height:calc(100% - 34px);object-fit:cover;object-position:top center;display:block}
</style></head><body>
  <div class="wrap">
    <div class="brand">${logoHtml}<span class="wordmark">Sane-Kit</span></div>
    <div class="copy">
      <h1>A Sanity + Next.js starter kit with a page builder.</h1>
      <p>Page-builder Studio, live visual editing, i18n, and a typed Next.js frontend — ready to clone.</p>
    </div>
    <div class="badges">
      <span class="badge">Next.js 16</span><span class="badge">React 19</span><span class="badge">Sanity 6</span>
      <span class="badge">next-sanity 13</span><span class="badge">Tailwind v4</span><span class="badge">TypeScript</span>
      <span class="badge">Base UI</span>
    </div>
    <div class="frame">
      <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
      <img src="data:image/png;base64,${shot.toString('base64')}" alt="">
    </div>
  </div>
</body></html>`

const frame = await browser.newPage({viewport: {width: 1200, height: 750}, deviceScaleFactor: 1})
await frame.setContent(html, {waitUntil: 'networkidle'})
await frame.evaluate(() => document.fonts.ready)
await frame.waitForTimeout(400)
await frame.screenshot({path: OUT})

await browser.close()
console.log(`wrote ${OUT} (logo: ${logo?.url ? 'reused from site' : 'wordmark only'})`)
