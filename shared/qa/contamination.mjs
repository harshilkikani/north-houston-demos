// Cross-contamination audit (§29A): scans every built page of every site for identifiers
// belonging to any of the other nine businesses. Shared neutral technical assets are ignored;
// the check is on business-specific identity only.
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const manifest = JSON.parse(await readFile(path.join(ROOT, 'state', 'SITE_MANIFEST.json'), 'utf8'))

/** Every string that uniquely identifies a business. */
function identifiers(b) {
  const out = []
  const push = (kind, v) => { if (v && String(v).trim() && !/UNKNOWN/i.test(v)) out.push({ kind, v: String(v).trim() }) }
  push('display name', b.display_name)
  push('legal name', b.legal_name?.value)
  push('phone', b.phone?.value)
  push('phone digits', b.phone?.value?.replace(/\D/g, ''))
  push('address', b.address?.value?.split(',')[0])
  push('map cid', b.map_url?.value?.split('cid=')[1])
  for (const v of Object.values(b.socials || {})) if (v?.value && /^https?:/.test(v.value)) push('social', v.value)
  if (b.owner_or_contact?.display_safe) push('owner name', b.owner_or_contact.value)
  if (b.front_desk?.display_safe) push('staff name', b.front_desk.value)
  for (const s of b.staff || []) if (s.display_safe) push('staff name', s.name)
  for (const r of b.reviews || []) push('review text', r.excerpt.slice(0, 60))
  return out
}

async function pages(dir) {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (e.isFile() && e.name.endsWith('.html')) out.push(path.join(e.parentPath || e.path, e.name))
  }
  return out
}

// Names too common to be a reliable signal on their own (a first name in prose is not an identifier).
const AMBIGUOUS = new Set(['Ben', 'Ana', 'Marie', 'Diana', 'Amanda', 'Angie', 'Mario', 'Ricky', 'Tito', 'Chris', 'Tammy', 'Victor'])

let findings = 0
for (const site of cfg.sites) {
  const dist = path.join(ROOT, 'sites', site.dir, 'dist')
  const files = await pages(dist)
  const others = manifest.sites.filter((m) => m.site_id !== site.id)
  const hits = []

  for (const f of files) {
    const html = await readFile(f, 'utf8')
    for (const other of others) {
      for (const id of identifiers(other)) {
        // a bare first name shared across businesses is not proof of contamination
        if (id.kind.includes('name') && AMBIGUOUS.has(id.v)) continue
        if (id.v.length < 6) continue
        if (html.includes(id.v)) {
          hits.push(`${path.relative(dist, f)} :: ${other.display_name} ${id.kind} "${id.v.slice(0, 44)}"`)
        }
      }
    }
  }
  if (hits.length) {
    findings += hits.length
    console.log(`\n[${site.id} ${site.segment}] ${hits.length} CONTAMINATION HIT(S)`)
    hits.forEach((h) => console.log('   - ' + h))
  } else {
    console.log(`[${site.id} ${site.segment}] clean (${files.length} pages)`)
  }
}

// second check: no raw asset file is shared between two sites
const seen = new Map()
let shared = 0
for (const site of cfg.sites) {
  const dir = path.join(ROOT, 'sites', site.dir, 'public', 'assets')
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isFile() || !e.name.endsWith('.jpg')) continue
    const buf = await readFile(path.join(dir, e.name))
    const key = `${buf.length}`
    const prev = seen.get(key)
    if (prev && prev.site !== site.id && Buffer.compare(prev.buf, buf) === 0) {
      console.log(`\nSHARED IMAGE: ${prev.site} and ${site.id} both ship ${e.name}`)
      shared++
    } else if (!prev) seen.set(key, { site: site.id, buf })
  }
}

console.log(`\nCONTAMINATION FINDINGS: ${findings}`)
console.log(`SHARED PHOTOGRAPHS ACROSS SITES: ${shared}`)
if (findings || shared) process.exitCode = 1
