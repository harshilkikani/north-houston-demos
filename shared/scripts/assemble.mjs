// Assembles the ten built sites into a single _site/ tree for GitHub Pages,
// and writes the operator's root index.
import { cp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const manifest = JSON.parse(await readFile(path.join(ROOT, 'state', 'SITE_MANIFEST.json'), 'utf8'))
const OUT = path.join(ROOT, '_site')

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

for (const s of cfg.sites) {
  await cp(path.join(ROOT, 'sites', s.dir, 'dist'), path.join(OUT, s.segment), { recursive: true })
  console.log(`assembled ${s.segment}`)
}

const rows = cfg.sites
  .map((s) => {
    const b = manifest.sites.find((m) => m.site_id === s.id)
    return `<li><a href="./${s.segment}/"><span class="n">${s.id}</span><span class="t">${b.display_name}</span><span class="i">${b.industry}</span></a></li>`
  })
  .join('\n')

await writeFile(
  path.join(OUT, 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Demo index — North Houston</title>
<style>
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0e0e10;color:#eae7e2;font:16px/1.5 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:clamp(24px,6vw,72px)}
h1{font-size:clamp(22px,4vw,32px);margin:0 0 6px;font-weight:600;letter-spacing:-.02em}
p{margin:0 0 36px;color:#8f8b85;max-width:56ch}
ul{list-style:none;margin:0;padding:0;display:grid;gap:8px;max-width:820px}
a{display:grid;grid-template-columns:44px 1fr auto;gap:16px;align-items:baseline;text-decoration:none;color:inherit;padding:16px 18px;border:1px solid #26262a;border-radius:10px;background:#161619;transition:border-color .15s,background .15s}
a:hover,a:focus-visible{border-color:#4a4a52;background:#1c1c20}
a:focus-visible{outline:2px solid #7d8cff;outline-offset:2px}
.n{color:#6b6b73;font-variant-numeric:tabular-nums;font-size:14px}
.t{font-weight:600}
.i{color:#7c7870;font-size:13px;text-align:right}
@media(max-width:560px){a{grid-template-columns:32px 1fr}.i{grid-column:2;text-align:left}}
</style></head><body>
<h1>North Houston — Day 1 demos</h1>
<p>Ten speculative redesigns. Every site is unpublished, <code>noindex</code>, and built for a single in-person conversation with the owner.</p>
<ul>
${rows}
</ul>
</body></html>
`
)
await writeFile(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
await writeFile(path.join(OUT, '.nojekyll'), '')
console.log('ASSEMBLED', OUT)
