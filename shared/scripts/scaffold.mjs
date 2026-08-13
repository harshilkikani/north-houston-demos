// Creates the ten Astro packages. Structure only â€” every visual decision lives in the site itself.
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const cfg = JSON.parse(await readFile(path.join(ROOT, 'shared', 'sites.config.json'), 'utf8'))
const manifest = JSON.parse(await readFile(path.join(ROOT, 'state', 'SITE_MANIFEST.json'), 'utf8'))

const ACCENTS = {
  '01': '#B4622D', '02': '#2E6B5E', '03': '#A8763E', '04': '#C8102E', '05': '#7D2E4A',
  '06': '#E8503A', '07': '#FFB800', '08': '#B08375', '09': '#FF2E88', '10': '#7E9682',
}
const INK = {
  '01': '#16130F', '02': '#1C2321', '03': '#2B2118', '04': '#0A0A0B', '05': '#2E211B',
  '06': '#1F2430', '07': '#101010', '08': '#2A2422', '09': '#120A14', '10': '#2F3A32',
}
const MONOGRAM = {
  '01': 'CT', '02': 'D&D', '03': 'S', '04': 'RC', '05': 'LT',
  '06': 'CM', '07': 'LC', '08': 'M', '09': 'V', '10': 'C',
}

for (const site of cfg.sites) {
  const dir = path.join(ROOT, 'sites', site.dir)
  const base = `/${cfg.repo}/${site.segment}`
  const biz = manifest.sites.find((s) => s.site_id === site.id)

  await mkdir(path.join(dir, 'src', 'pages'), { recursive: true })
  await mkdir(path.join(dir, 'src', 'styles'), { recursive: true })
  await mkdir(path.join(dir, 'src', 'components'), { recursive: true })
  await mkdir(path.join(dir, 'content'), { recursive: true })
  await mkdir(path.join(dir, 'public'), { recursive: true })

  await writeFile(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: `@nhd/${site.segment}`,
        private: true,
        type: 'module',
        scripts: { dev: 'astro dev', build: 'astro build', preview: 'astro preview' },
        dependencies: {
          astro: '5.1.1',
          tailwindcss: '^4.1.11',
          '@tailwindcss/vite': '^4.1.11',
          '@nhd/shared': 'workspace:*',
        },
      },
      null,
      2
    ) + '\n'
  )

  await writeFile(
    path.join(dir, 'astro.config.mjs'),
    `import { defineConfig } from 'astro/config'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  site: '${cfg.baseHost}',
  base: '${base}',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  vite: { plugins: [tailwind()] },
})
`
  )

  // Canonical, site-scoped content. Every component reads facts from here â€” never from memory.
  await writeFile(path.join(dir, 'content', 'business.json'), JSON.stringify(biz, null, 2) + '\n')

  // Speculative-demo safeguard (Â§22)
  await writeFile(path.join(dir, 'public', 'robots.txt'), 'User-agent: *\nDisallow: /\n')

  // Per-site favicon: monogram on the site's own ink, in the site's own accent.
  const mono = MONOGRAM[site.id]
  const fs = mono.length > 2 ? 26 : mono.length > 1 ? 34 : 48
  await writeFile(
    path.join(dir, 'public', 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="10" fill="${INK[site.id]}"/><text x="40" y="40" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-weight="700" font-size="${fs}" fill="${ACCENTS[site.id]}">${mono.replace('&', '&amp;')}</text></svg>\n`
  )

  const placeholder = path.join(dir, 'src', 'pages', 'index.astro')
  if (!existsSync(placeholder)) {
    await writeFile(placeholder, `---\nconst t = ${JSON.stringify(biz.display_name)}\n---\n<h1>{t}</h1>\n`)
  }
  console.log(`scaffolded ${site.dir} -> ${base}`)
}
console.log('DONE')

