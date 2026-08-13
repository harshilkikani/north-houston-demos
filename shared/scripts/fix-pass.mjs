import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..', 'sites')
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

let n = 0
function walk(p) {
  for (const e of readdirSync(p, { withFileTypes: true })) {
    const f = path.join(p, e.name)
    if (e.isDirectory()) {
      if (!['dist', 'node_modules', '.astro', 'public'].includes(e.name)) walk(f)
    } else if (e.name.endsWith('.astro')) {
      const before = readFileSync(f, 'utf8')
      let c = before
      // map_url is an object in the manifest — .value is the href
      c = c.replaceAll('href={biz.map_url}', 'href={biz.map_url.value}')
      // an empty src fires a request for the page itself and reports as a broken image
      c = c.replaceAll('src="" alt=""', `src="${PIXEL}" alt=""`)
      if (c !== before) {
        writeFileSync(f, c)
        n++
        console.log('fixed', path.relative(ROOT, f))
      }
    }
  }
}
for (const d of readdirSync(ROOT)) walk(path.join(ROOT, d))
console.log('files changed:', n)
