import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
}

/** Serves `root` mounted at `mount` (e.g. '/north-houston-demos/richey-collision'). */
export async function serve(root, mount = '') {
  const m = mount.replace(/\/$/, '')
  const server = http.createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
      if (m && p.startsWith(m)) p = p.slice(m.length)
      if (p === '' || p.endsWith('/')) p += 'index.html'
      let file = path.join(root, p)
      try {
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
      } catch {
        if (!path.extname(file)) file = `${file}/index.html`
      }
      const body = await readFile(file)
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('404')
    }
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  const port = server.address().port
  return { origin: `http://127.0.0.1:${port}`, url: `http://127.0.0.1:${port}${m}/`, close: () => server.close() }
}
