// Renders each site at three viewports and composites a contact sheet for visual review.
// Usage: node shared/qa/screenshot.mjs [pass] [siteId...]
import { chromium } from 'playwright'
import { mkdir, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { serve } from './server.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const pass = process.argv[2] || 'pass-01'
const only = process.argv.slice(3)

const VIEWS = [
  { name: 'mobile', width: 390, height: 844, dsf: 2 },
  { name: 'tablet', width: 768, height: 1024, dsf: 2 },
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
]
const SHEET_H = 900

/** Scrolls the whole page so scroll-triggered reveals fire, then returns to the top. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 350))
  })
  await page.waitForTimeout(500)
}

const browser = await chromium.launch()

for (const s of cfg.sites) {
  if (only.length && !only.includes(s.id)) continue
  const dist = path.join(ROOT, 'sites', s.dir, 'dist')
  const base = `/${cfg.repo}/${s.segment}`
  const srv = await serve(dist, base)
  const outDir = path.join(ROOT, 'qa', s.id, pass.startsWith('live') ? 'live' : 'local', pass)
  await mkdir(outDir, { recursive: true })

  // route list = every directory containing an index.html
  const routes = ['/']
  for (const e of await readdir(dist, { withFileTypes: true })) {
    if (e.isDirectory() && !['assets', 'fonts', '_astro'].includes(e.name)) routes.push(`/${e.name}/`)
  }

  const shots = []
  for (const v of VIEWS) {
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.dsf })
    const page = await ctx.newPage()
    await page.goto(srv.url, { waitUntil: 'networkidle' })
    await settle(page)
    // above-the-fold capture: the first impression is judged on its own (§4)
    await page.screenshot({ path: path.join(outDir, `${v.name}-fold.png`), fullPage: false })
    const f = path.join(outDir, `${v.name}.png`)
    await page.screenshot({ path: f, fullPage: true })
    shots.push({ file: f, name: v.name })

    // secondary routes at desktop + mobile only
    if (v.name !== 'tablet') {
      for (const r of routes.slice(1)) {
        await page.goto(`${srv.origin}${base}${r}`, { waitUntil: 'networkidle' })
        await settle(page)
        await page.screenshot({ path: path.join(outDir, `${v.name}-${r.replace(/\//g, '')}.png`), fullPage: true })
      }
    }
    await ctx.close()
  }

  // contact sheet: three viewports side by side, each scaled to a common height
  const cells = []
  let x = 0
  for (const sh of shots) {
    const meta = await sharp(sh.file).metadata()
    const w = Math.round((meta.width / meta.height) * SHEET_H)
    const buf = await sharp(sh.file).resize(w, SHEET_H, { fit: 'contain', background: '#101012' }).png().toBuffer()
    cells.push({ input: buf, left: x, top: 34 })
    cells.push({
      input: Buffer.from(
        `<svg width="${w}" height="34" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="34" fill="#000"/><text x="10" y="23" font-family="monospace" font-size="16" fill="#fff">${s.id} ${sh.name} (${meta.width / (sh.name === 'desktop' ? 1 : 2)}px wide)</text></svg>`
      ),
      left: x,
      top: 0,
    })
    x += w + 8
  }
  await sharp({ create: { width: x, height: SHEET_H + 34, channels: 3, background: '#101012' } })
    .composite(cells)
    .jpeg({ quality: 72 })
    .toFile(path.join(outDir, 'contact-sheet.jpg'))

  srv.close()
  console.log(`${s.id} ${s.segment} -> ${outDir}`)
}

await browser.close()
console.log('DONE')
