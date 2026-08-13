// Downloads Unsplash candidate photos and builds labelled contact sheets for visual review.
// Unsplash License: free for commercial use, no attribution required. Only images.unsplash.com
// (free) IDs are used here — plus.unsplash.com / premium_photo IDs are deliberately excluded.
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '../..')
const RAW = path.join(ROOT, 'research', 'raw')
const SHEETS = path.join(ROOT, 'research', 'sheets')

const COLS = 4
const CELL_W = 460
const CELL_H = 300
const PAD = 10
const LABEL_H = 26

async function download(id) {
  const out = path.join(RAW, `${id}.jpg`)
  if (existsSync(out)) return out
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`
  const res = await fetch(url, { headers: { 'User-Agent': 'north-houston-demos/1.0' } })
  if (!res.ok) throw new Error(`${id} -> HTTP ${res.status}`)
  await writeFile(out, Buffer.from(await res.arrayBuffer()))
  return out
}

function labelSvg(text, w) {
  const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return Buffer.from(
    `<svg width="${w}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${LABEL_H}" fill="#111"/>
      <text x="8" y="18" font-family="Consolas,monospace" font-size="14" fill="#fff">${safe}</text>
    </svg>`
  )
}

async function sheet(name, entries) {
  const rows = Math.ceil(entries.length / COLS)
  const W = COLS * (CELL_W + PAD) + PAD
  const H = rows * (CELL_H + LABEL_H + PAD) + PAD
  const composites = []

  for (let i = 0; i < entries.length; i++) {
    const { file, tag } = entries[i]
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const x = PAD + col * (CELL_W + PAD)
    const y = PAD + row * (CELL_H + LABEL_H + PAD)
    try {
      const buf = await sharp(file).resize(CELL_W, CELL_H, { fit: 'cover' }).jpeg({ quality: 78 }).toBuffer()
      composites.push({ input: buf, left: x, top: y + LABEL_H })
      composites.push({ input: labelSvg(tag, CELL_W), left: x, top: y })
    } catch (e) {
      console.error('sheet cell failed', file, e.message)
    }
  }

  const out = path.join(SHEETS, `${name}.jpg`)
  await sharp({ create: { width: W, height: H, channels: 3, background: '#1b1b1b' } })
    .composite(composites)
    .jpeg({ quality: 76 })
    .toFile(out)
  return out
}

const groups = JSON.parse(await readFile(path.join(import.meta.dirname, 'candidates.json'), 'utf8'))
await mkdir(RAW, { recursive: true })
await mkdir(SHEETS, { recursive: true })

for (const [group, ids] of Object.entries(groups)) {
  const entries = []
  let n = 0
  const results = await Promise.allSettled(ids.map(download))
  for (let i = 0; i < ids.length; i++) {
    n++
    if (results[i].status === 'fulfilled') {
      entries.push({ file: results[i].value, tag: `${group}-${String(n).padStart(2, '0')}  ${ids[i].slice(6, 16)}` })
    } else {
      console.error('DL FAIL', ids[i], results[i].reason.message)
    }
  }
  // split into sheets of 12 so each image stays readable
  for (let s = 0; s * 12 < entries.length; s++) {
    const slice = entries.slice(s * 12, s * 12 + 12)
    const p = await sheet(`${group}-${s + 1}`, slice)
    console.log('SHEET', p, `(${slice.length} images)`)
  }
}
console.log('DONE')
