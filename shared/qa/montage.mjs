// Portfolio differentiation audit (§29C): all ten live heroes side by side, desktop then mobile.
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const OUT = path.join(ROOT, 'qa', '_portfolio')
await mkdir(OUT, { recursive: true })

async function sheet(kind, cellW, cols) {
  const cellH = kind === 'mobile' ? Math.round(cellW * (844 / 390)) : Math.round(cellW * (900 / 1440))
  const LABEL = 26
  const rows = Math.ceil(cfg.sites.length / cols)
  const W = cols * (cellW + 8) + 8
  const H = rows * (cellH + LABEL + 8) + 8
  const parts = []

  for (let i = 0; i < cfg.sites.length; i++) {
    const s = cfg.sites[i]
    const f = path.join(ROOT, 'qa', s.id, 'live', 'final', `${kind}.png`)
    const x = 8 + (i % cols) * (cellW + 8)
    const y = 8 + Math.floor(i / cols) * (cellH + LABEL + 8)
    const buf = await sharp(f).resize(cellW, cellH, { fit: 'cover', position: 'top' }).png().toBuffer()
    parts.push({ input: buf, left: x, top: y + LABEL })
    parts.push({
      input: Buffer.from(
        `<svg width="${cellW}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg"><rect width="${cellW}" height="${LABEL}" fill="#000"/><text x="8" y="18" font-family="monospace" font-size="14" fill="#fff">${s.id} ${s.segment}</text></svg>`
      ),
      left: x,
      top: y,
    })
  }
  const out = path.join(OUT, `heroes-${kind}.jpg`)
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0d0d0f' } })
    .composite(parts)
    .jpeg({ quality: 78 })
    .toFile(out)
  console.log(out)
}

await sheet('desktop', 460, 5)
await sheet('mobile', 260, 5)
