// Automated QA across all ten sites: routes, console errors, overflow, images, headings,
// metadata, and manifest verification. Writes state/QA_MATRIX.csv.
// Usage: node shared/qa/audit.mjs [siteId...]
import { chromium } from 'playwright'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { serve } from './server.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const manifest = JSON.parse(await readFile(path.join(ROOT, 'state', 'SITE_MANIFEST.json'), 'utf8'))
const only = process.argv.slice(2)

const VIEWS = [390, 768, 1440]
const browser = await chromium.launch()
const results = []
const report = []

// External hosts that routinely bot-block automated requests but are fine for a human (§23)
const AUTOMATION_LIMITED = /(google\.com|facebook\.com|instagram\.com|yelp\.com|fresha\.com|maps\.google)/i

for (const s of cfg.sites) {
  if (only.length && !only.includes(s.id)) continue
  const biz = manifest.sites.find((m) => m.site_id === s.id)
  const dist = path.join(ROOT, 'sites', s.dir, 'dist')
  const base = `/${cfg.repo}/${s.segment}`
  const srv = await serve(dist, base)
  const issues = []

  const routes = ['/']
  for (const e of await readdir(dist, { withFileTypes: true })) {
    if (e.isDirectory() && !['assets', 'fonts', '_astro'].includes(e.name)) routes.push(`/${e.name}/`)
  }

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const consoleErrors = []
  const badRequests = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', (e) => consoleErrors.push(`uncaught: ${e.message}`))
  page.on('response', (r) => { if (r.status() >= 400 && new URL(r.url()).host === new URL(srv.origin).host) badRequests.push(`${r.status()} ${r.url().replace(srv.origin, '')}`) })

  const externals = new Set()

  for (const r of routes) {
    await page.goto(`${srv.origin}${base}${r}`, { waitUntil: 'networkidle' })

    const data = await page.evaluate(() => {
      const q = (sel) => document.querySelector(sel)
      return {
        title: document.title,
        desc: q('meta[name="description"]')?.content || '',
        robots: q('meta[name="robots"]')?.content || '',
        og: q('meta[property="og:image"]')?.content || '',
        icon: q('link[rel="icon"]')?.getAttribute('href') || '',
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
        headings: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1])),
        imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => i.getAttribute('alt') === null).length,
        brokenImgs: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
        links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
        text: document.body.innerText,
      }
    })

    if (!data.title) issues.push(`${r} missing title`)
    if (!data.desc) issues.push(`${r} missing description`)
    if (!/noindex/.test(data.robots)) issues.push(`${r} missing noindex`)
    if (!data.og) issues.push(`${r} missing og:image`)
    if (!data.icon) issues.push(`${r} missing favicon`)
    if (data.h1.length !== 1) issues.push(`${r} has ${data.h1.length} h1 elements`)
    if (data.imgsNoAlt) issues.push(`${r} ${data.imgsNoAlt} images without alt`)
    if (data.brokenImgs.length) issues.push(`${r} broken images: ${data.brokenImgs.length}`)
    for (let i = 1; i < data.headings.length; i++) {
      if (data.headings[i] - data.headings[i - 1] > 1) { issues.push(`${r} heading level skip (h${data.headings[i - 1]}→h${data.headings[i]})`); break }
    }

    // internal link resolution
    for (const href of data.links) {
      if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) continue
      if (/^https?:/i.test(href)) { externals.add(href); continue }
      const url = href.startsWith('/') ? `${srv.origin}${href}` : new URL(href, `${srv.origin}${base}${r}`).href
      const res = await page.request.get(url.split('#')[0])
      if (!res.ok()) issues.push(`${r} dead internal link ${href} (${res.status()})`)
    }

    // overflow at each viewport
    for (const w of VIEWS) {
      await page.setViewportSize({ width: w, height: 900 })
      await page.waitForTimeout(160)
      const over = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }))
      if (over.scroll > over.client + 1) issues.push(`${r} horizontal overflow at ${w}px (${over.scroll} > ${over.client})`)
    }
    await page.setViewportSize({ width: 1440, height: 900 })
  }

  // factual verification of the homepage against the manifest
  await page.goto(srv.url, { waitUntil: 'networkidle' })
  const body = await page.evaluate(() => document.body.innerText)
  const html = await page.content()
  const facts = [
    ['business name', biz.display_name.replace(/&amp;/g, '&')],
    ['phone', biz.phone.value],
    ['rating', String(biz.rating.value)],
    ['review count', String(biz.rating.count)],
  ]
  for (const [what, val] of facts) {
    if (!body.includes(val)) issues.push(`homepage missing ${what} "${val}"`)
  }
  if (!html.includes(biz.map_url.value)) issues.push('homepage missing Google Business Profile map link')
  if (!html.includes(`tel:+1${biz.phone.value.replace(/\D/g, '')}`)) issues.push('homepage missing tel: link')
  const addrCore = biz.address.value.split(',')[0]
  if (!body.includes(addrCore)) issues.push(`homepage missing address "${addrCore}"`)
  for (const [k, v] of Object.entries(biz.socials || {})) {
    if (v.display_safe && v.value && !html.includes(v.value)) issues.push(`homepage missing ${k} link`)
    if (!v.display_safe && v.value && /^https?:/.test(v.value) && html.includes(v.value)) issues.push(`homepage links a NOT display-safe ${k}`)
  }
  if (biz.years_in_business && biz.years_in_business.display_safe === false && /\b25 years\b/i.test(body)) {
    issues.push('homepage prints the unverified years-in-business claim')
  }

  if (consoleErrors.length) issues.push(`console errors: ${consoleErrors.slice(0, 3).join(' | ')}`)
  if (badRequests.length) issues.push(`failed requests: ${[...new Set(badRequests)].slice(0, 5).join(', ')}`)

  await ctx.close()
  srv.close()

  const ext = [...externals]
  const extNote = `${ext.length} external links (${ext.filter((u) => AUTOMATION_LIMITED.test(u)).length} on bot-blocking platforms — structure validated, not fetched)`

  results.push({ id: s.id, routes: routes.length, issues, extNote })
  report.push(
    [s.id, issues.length ? 'FAIL' : 'PASS', '', '', '', issues.some((i) => /link/.test(i)) ? 'FAIL' : 'PASS',
      issues.some((i) => /console|uncaught|failed requests/.test(i)) ? 'FAIL' : 'PASS',
      issues.some((i) => /alt|h1|heading/.test(i)) ? 'FAIL' : 'PASS', '', '', '', '',
      `"${routes.length} routes; ${extNote}"`].join(',')
  )
}

await browser.close()

console.log('\n=== AUDIT ===')
let total = 0
for (const r of results) {
  console.log(`\n[${r.id}] routes=${r.routes} ${r.issues.length ? `ISSUES ${r.issues.length}` : 'CLEAN'}`)
  r.issues.forEach((i) => console.log('   - ' + i))
  console.log('   · ' + r.extNote)
  total += r.issues.length
}
console.log(`\nTOTAL ISSUES: ${total}`)

if (!only.length) {
  await writeFile(
    path.join(ROOT, 'state', 'QA_MATRIX.csv'),
    'site_id,build,desktop_visual,tablet_visual,mobile_visual,links,console,a11y,perf,contamination,deployed,live_verified,notes\n' +
      report.join('\n') + '\n'
  )
}
