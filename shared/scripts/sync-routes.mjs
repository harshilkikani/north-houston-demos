// Keeps the Routes lines in DESIGN_DIRECTIONS.md honest against what actually shipped.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(readFileSync(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const f = path.join(ROOT, 'state', 'DESIGN_DIRECTIONS.md')
let md = readFileSync(f, 'utf8')

for (const s of cfg.sites) {
  const dist = path.join(ROOT, 'sites', s.dir, 'dist')
  const routes = ['`/`']
  for (const e of readdirSync(dist, { withFileTypes: true })) {
    if (e.isDirectory() && !['assets', 'fonts', '_astro'].includes(e.name)) routes.push('`/' + e.name + '`')
  }
  // replace the Routes line inside this site's block
  const head = md.indexOf(`## ${s.id} —`)
  if (head === -1) continue
  const next = md.indexOf('\n## ', head + 1)
  const block = md.slice(head, next === -1 ? undefined : next)
  const fixed = block.replace(/^- \*\*Routes:\*\*.*$/m, `- **Routes:** ${routes.join(' · ')}`)
  md = md.slice(0, head) + fixed + (next === -1 ? '' : md.slice(next))
  console.log(s.id, routes.join(' '))
}

writeFileSync(f, md)
console.log('DESIGN_DIRECTIONS.md routes synced')
