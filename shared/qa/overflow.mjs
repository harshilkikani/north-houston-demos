// Pinpoints which elements push past the viewport at a given width, in real mobile emulation.
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const ids = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const width = Number(process.argv.find((a) => a.startsWith('-w='))?.slice(3) || 390)

const browser = await chromium.launch()
for (const s of cfg.sites) {
  if (ids.length && !ids.includes(s.id)) continue
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto(`${cfg.baseHost}/${cfg.repo}/${s.segment}/`, { waitUntil: 'networkidle' })
  const out = await page.evaluate((w) => {
    const bad = []
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0) return
      if (r.right > w + 1 || r.left < -1) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 44),
          id: el.id,
          left: Math.round(r.left),
          right: Math.round(r.right),
          text: (el.textContent || '').trim().slice(0, 38),
        })
      }
    })
    return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, bad: bad.slice(0, 14) }
  }, width)
  console.log(`\n[${s.id} ${s.segment}] scrollWidth=${out.scroll} clientWidth=${out.client}`)
  out.bad.forEach((b) => console.log(`   ${b.tag}${b.id ? '#' + b.id : ''}.${b.cls} [${b.left}..${b.right}] "${b.text}"`))
  await ctx.close()
}
await browser.close()
