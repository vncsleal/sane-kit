/**
 * Generates `docs/preview.png` — the 1200×750 Sanity Exchange preview image.
 *
 * It captures a real screenshot of the running frontend (the hero), then
 * composes it into a branded marketing frame at exactly the Exchange size.
 * Nothing here is mocked: point it at a deployed URL or a local server.
 *
 *   SITE_URL=https://sane-kit-demo.vercel.app/en pnpm preview:image
 *
 * `SITE_URL` defaults to the local production server. In CI the image is not
 * regenerated (it is a committed artifact) — this exists so a redesign can be
 * re-captured reproducibly instead of by hand.
 */
import {chromium} from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, '../../docs/preview.png')
const SITE = process.env.SITE_URL ?? 'http://localhost:3000/en'

const browser = await chromium.launch()

// 1) Screenshot the site hero, cookie banner dismissed, at 2× for crispness.
const site = await browser.newPage({viewport: {width: 1280, height: 900}, deviceScaleFactor: 2})
await site.goto(SITE, {waitUntil: 'load', timeout: 90_000})
await site.waitForTimeout(1500)
for (const label of ['Accept', 'Aceitar', 'Accept all']) {
  const button = site.getByRole('button', {name: label})
  if (await button.count()) {
    await button
      .first()
      .click()
      .catch(() => {})
    break
  }
}
await site.waitForTimeout(1200)
const shot = await site.screenshot()

// 2) Compose the exact 1200×750 frame.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box;font-family:ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  body{width:1200px;height:750px;overflow:hidden;background:#0b0b0f;color:#fff}
  .wrap{position:relative;width:1200px;height:750px;overflow:hidden;
    background:
      radial-gradient(900px 520px at 92% -12%, rgba(249,115,22,.30), transparent 60%),
      radial-gradient(720px 520px at -12% 112%, rgba(56,189,248,.22), transparent 60%),
      linear-gradient(135deg,#0b0b0f 0%,#141419 100%)}
  .row{position:absolute;left:64px;top:58px;display:flex;align-items:center;gap:13px}
  .mark{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#f97316,#fb923c);
    display:grid;place-items:center;font-weight:800;font-size:22px;color:#0b0b0f}
  .name{font-size:29px;font-weight:800;letter-spacing:-.02em}
  .left{position:absolute;left:64px;top:150px;width:470px}
  h1{font-size:40px;line-height:1.08;letter-spacing:-.03em}
  h1 span{background:linear-gradient(90deg,#f97316,#fb923c);-webkit-background-clip:text;background-clip:text;color:transparent}
  p{margin-top:16px;font-size:16px;line-height:1.5;color:#c9c9d1}
  .badges{position:absolute;left:64px;bottom:56px;display:flex;gap:9px;flex-wrap:wrap;width:520px}
  .b{font-size:13px;font-weight:600;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.08);
    border:1px solid rgba(255,255,255,.14);color:#e7e7ee}
  .frame{position:absolute;right:52px;top:150px;width:610px;height:470px;border-radius:16px;overflow:hidden;
    border:1px solid rgba(255,255,255,.16);box-shadow:0 40px 90px rgba(0,0,0,.6);background:#fff}
  .bar{height:34px;background:#f1f1f4;display:flex;align-items:center;gap:7px;padding:0 13px}
  .dot{width:10px;height:10px;border-radius:50%}
  .frame img{width:100%;height:calc(100% - 34px);object-fit:cover;object-position:top center;display:block}
</style></head><body>
  <div class="wrap">
    <div class="row"><div class="mark">S</div><div class="name">Sane&#8209;Kit</div></div>
    <div class="left">
      <h1>The Sanity + Next.js <span>starter kit</span> with a page builder.</h1>
      <p>Page-builder Studio, live visual editing, i18n, and a typed Next.js 16 frontend — ready to clone.</p>
    </div>
    <div class="badges">
      <div class="b">Next.js 16</div><div class="b">React 19</div><div class="b">Sanity 6</div>
      <div class="b">next-sanity 13</div><div class="b">Tailwind v4</div><div class="b">TypeScript</div>
      <div class="b">Base UI</div>
    </div>
    <div class="frame">
      <div class="bar">
        <div class="dot" style="background:#ff5f57"></div><div class="dot" style="background:#febc2e"></div>
        <div class="dot" style="background:#28c840"></div>
      </div>
      <img src="data:image/png;base64,${shot.toString('base64')}" alt="">
    </div>
  </div>
</body></html>`

const frame = await browser.newPage({viewport: {width: 1200, height: 750}, deviceScaleFactor: 1})
await frame.setContent(html, {waitUntil: 'load'})
await frame.waitForTimeout(600)
await frame.screenshot({path: OUT})

await browser.close()
console.log(`wrote ${OUT}`)
