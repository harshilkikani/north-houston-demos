// Live-URL QA (§22 steps 12–20): loads each deployed site over HTTPS, checks assets, console
// and routes, then writes the final pitch screenshots to qa/<id>/live/final/.
import { chromium } from 'playwright'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const manifest = JSON.parse(await readFile(path.join(ROOT, 'state', 'SITE_MANIFEST.json'), 'utf8'))
const ORIGIN = `${cfg.baseHost}/${cfg.repo}`

const browser = await chromium.launch()
const rows = []

for (const s of cfg.sites) {
  const biz = manifest.sites.find((m) => m.site_id === s.id)
  const url = `${ORIGIN}/${s.segment}/`
  const outDir = path.join(ROOT, 'qa', s.id, 'live', 'final')
  await mkdir(outDir, { recursive: true })

  const issues = []
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const errs = []
  const bad = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(`uncaught: ${e.message}`))
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(cfg.baseHost)) bad.push(`${r.status()} ${r.url().replace(ORIGIN, '')}`)
  })

  let status = 0
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
    status = res?.status() || 0
  } catch (e) {
    issues.push(`navigation failed: ${e.message.split('\n')[0]}`)
  }
  if (status !== 200) issues.push(`HTTP ${status}`)
  if (!url.startsWith('https://')) issues.push('not HTTPS')

  const info = await page.evaluate(() => ({
    title: document.title,
    robots: document.querySelector('meta[name="robots"]')?.content || '',
    text: document.body.innerText,
    brokenImgs: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length,
    css: getComputedStyle(document.body).backgroundColor,
    routes: [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin) && !h.includes('#')),
  }))

  if (!/noindex/.test(info.robots)) issues.push('noindex missing on live page')
  if (info.brokenImgs) issues.push(`${info.brokenImgs} broken images live`)
  if (!info.text.includes(biz.phone.value)) issues.push('phone missing from live page')
  if (info.css === 'rgba(0, 0, 0, 0)') issues.push('stylesheet did not load (transparent body)')

  // secondary routes
  for (const r of [...new Set(info.routes)].filter((h) => h !== url && h.startsWith(`${ORIGIN}/${s.segment}/`))) {
    const res = await page.request.get(r)
    if (!res.ok()) issues.push(`live route ${r.replace(ORIGIN, '')} -> ${res.status()}`)
  }

  await page.evaluate(async () => {
    // smooth scrolling would still be animating when the shot is taken
    document.documentElement.style.scrollBehavior = 'auto'
    const step = Math.round(window.innerHeight * 0.8)
    for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)) }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 200))
  })
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(outDir, 'desktop.png'), fullPage: false })
  await page.screenshot({ path: path.join(outDir, 'desktop-full.png'), fullPage: true })
  await ctx.close()

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const mp = await mctx.newPage()
  try {
    await mp.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
    await mp.evaluate(() => document.fonts && document.fonts.ready)
    await mp.waitForTimeout(600)
    // measure before any full-page screenshot: that resizes the viewport and briefly skews scrollWidth
    const over = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
    if (over) issues.push('horizontal overflow at 390px live')
    await mp.screenshot({ path: path.join(outDir, 'mobile.png'), fullPage: false })
    await mp.screenshot({ path: path.join(outDir, 'mobile-full.png'), fullPage: true })
  } catch (e) {
    issues.push(`mobile load failed: ${e.message.split('\n')[0]}`)
  }
  await mctx.close()

  if (errs.length) issues.push(`console: ${errs.slice(0, 2).join(' | ')}`)
  if (bad.length) issues.push(`failed requests: ${[...new Set(bad)].slice(0, 4).join(', ')}`)

  rows.push({ id: s.id, url, issues })
  console.log(`[${s.id}] ${url} ${issues.length ? 'ISSUES' : 'OK'}`)
  issues.forEach((i) => console.log('   - ' + i))
}

await browser.close()
console.log(`\nLIVE ISSUES TOTAL: ${rows.reduce((a, r) => a + r.issues.length, 0)}`)
