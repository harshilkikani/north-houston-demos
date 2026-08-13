import { readFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const only = process.argv.slice(2)

const failures = []
for (const s of cfg.sites) {
  if (only.length && !only.includes(s.id) && !only.includes(s.dir)) continue
  process.stdout.write(`build ${s.dir} ... `)
  try {
    execSync('npx astro build', { cwd: path.join(ROOT, 'sites', s.dir), stdio: 'pipe' })
    console.log('OK')
  } catch (e) {
    console.log('FAIL')
    console.error(String(e.stdout || '') + String(e.stderr || ''))
    failures.push(s.dir)
  }
}
if (failures.length) {
  console.error('FAILED:', failures.join(', '))
  process.exit(1)
}
console.log('ALL BUILDS OK')
