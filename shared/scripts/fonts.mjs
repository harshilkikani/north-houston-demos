// Self-hosts each site's typefaces so a demo never depends on a third-party font CDN
// mid-pitch (§28 pitch resilience). Writes public/fonts/* and public/fonts/fonts.css per site.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

// Per-site type pairings — see state/DIFFERENTIATION_LEDGER.md
const SITES = {
  '01-countertops-of-texas': ['Instrument+Serif:ital,wght@0,400;1,400', 'IBM+Plex+Mono:wght@400;500;600'],
  '02-dd-granite': ['Space+Grotesk:wght@500;700', 'Inter:wght@400;500;600'],
  '03-sosa-hardwood-floors': ['Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700', 'Karla:wght@400;500;700'],
  '04-richey-collision': ['Oswald:wght@400;500;600', 'Barlow:wght@400;500;600'],
  '05-la-tino-hair': ['Cormorant+Garamond:ital,wght@0,400;0,600;1,400', 'Jost:wght@300;400;500'],
  '06-cutmasters': ['Outfit:wght@400;500;700', 'Source+Sans+3:wght@400;600'],
  '07-latin-cuts': ['Anton', 'DM+Sans:wght@400;500;700'],
  '08-marytere-image-salon': ['Italiana', 'Mulish:wght@300;400;600'],
  '09-vnn-nails': ['Syne:wght@600;700;800', 'Manrope:wght@400;600;800'],
  '10-cali-new-nails': ['Figtree:wght@300;400;600', 'Lora:ital,wght@0,400;1,400'],
}

for (const [dir, families] of Object.entries(SITES)) {
  const out = path.join(ROOT, 'sites', dir, 'public', 'fonts')
  await mkdir(out, { recursive: true })
  const url = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${dir}: font CSS HTTP ${res.status}`)
  let css = await res.text()

  const urls = [...new Set([...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/g)].map((m) => m[0]))]
  let n = 0
  for (const u of urls) {
    const file = u.split('/').slice(-3).join('-')
    const bin = await fetch(u, { headers: { 'User-Agent': UA } })
    await writeFile(path.join(out, file), Buffer.from(await bin.arrayBuffer()))
    css = css.split(u).join(`./${file}`)
    n++
  }
  await writeFile(path.join(out, 'fonts.css'), css)
  console.log(`${dir}: ${n} woff2 files`)
}
console.log('DONE')
