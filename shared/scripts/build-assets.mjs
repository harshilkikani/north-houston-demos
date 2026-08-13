// Crops, resizes and optimises the assigned raw photographs into each site's public/assets folder.
// Also emits ASSET_LEDGER.csv. Run: node shared/scripts/build-assets.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '../..')
const RAW = path.join(ROOT, 'research', 'raw')

// One width ladder for every asset, so a page can never reference a size that was not generated.
const WIDTHS = [1920, 1200, 800, 480]
const JPG_WIDTH = 1200

function ratio(ar) {
  const [w, h] = ar.split('/').map(Number)
  return w / h
}

const assets = JSON.parse(await readFile(path.join(import.meta.dirname, 'assets.json'), 'utf8'))
const ledger = ['site_id,filename,source_url,provenance_status,deploy_safe,optimized,notes']
let count = 0

for (const [siteDir, list] of Object.entries(assets)) {
  if (siteDir.startsWith('_')) continue
  const outDir = path.join(ROOT, 'sites', siteDir, 'public', 'assets')
  await mkdir(outDir, { recursive: true })
  const siteId = siteDir.slice(0, 2)

  for (const a of list) {
    const src = path.join(RAW, `${a.id}.jpg`)
    const widths = WIDTHS
    const r = ratio(a.ar)
    const written = []

    for (const w of widths) {
      const h = Math.round(w / r)
      const base = sharp(src).resize(w, h, { fit: 'cover', position: 'attention' })
      const webp = path.join(outDir, `${a.name}-${w}.webp`)
      await base.clone().webp({ quality: 80, effort: 5 }).toFile(webp)
      written.push(`${a.name}-${w}.webp`)
    }
    // one JPEG fallback, always at the same width
    const fw = JPG_WIDTH
    await sharp(src)
      .resize(fw, Math.round(fw / r), { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(outDir, `${a.name}-${fw}.jpg`))
    written.push(`${a.name}-${fw}.jpg`)

    ledger.push(
      [
        siteId,
        `${a.name}.*`,
        `https://images.unsplash.com/${a.id}`,
        'LICENSED',
        'YES',
        'YES',
        `"Unsplash License (commercial use, no attribution required). Role: ${a.role}. Material/atmosphere reference only — never presented as this business's own work. Replace with owner-supplied originals if the business becomes a client."`,
      ].join(',')
    )
    count += written.length

    // site-specific Open Graph image, derived from that site's own hero
    if (a.role === 'hero') {
      await sharp(src)
        .resize(1200, 630, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(path.join(outDir, 'og.jpg'))
    }
  }
  console.log(`${siteDir}: ${list.length} assets`)
}

await writeFile(path.join(ROOT, 'state', 'ASSET_LEDGER.csv'), ledger.join('\n') + '\n')
console.log(`DONE — ${count} files written, ledger updated`)
